import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { listFavorites, toggleFavorite } from '../api/public/favorites'
import { PublicApiError } from '../api/public/http'
import type { Product } from '../api/public/types'
import type { CartLineSnapshot } from '../types'
import { useAuthState } from './AuthContext'

export type FavoriteProduct = {
  productId: number
  snapshot: CartLineSnapshot
}

const STORAGE_KEY = 'papamia-favorites'

function loadLocalFavorites(): FavoriteProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is FavoriteProduct =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as FavoriteProduct).productId === 'number' &&
        typeof (x as FavoriteProduct).snapshot?.name === 'string' &&
        typeof (x as FavoriteProduct).snapshot?.price === 'number' &&
        typeof (x as FavoriteProduct).snapshot?.imageUrl === 'string',
    )
  } catch {
    return []
  }
}

function snapshotToProduct(productId: number, snapshot: CartLineSnapshot): Product {
  return {
    id: productId,
    name: snapshot.name,
    description: '',
    price: snapshot.price,
    imageUrl: snapshot.imageUrl,
    weight: 0,
    weightType: 'g',
    allergens: '',
    isActive: true,
    categoryId: 0,
  }
}

type FavoritesState = {
  products: Product[]
  loading: boolean
}

const FavoritesContext = createContext<FavoritesState | null>(null)
const FavoritesDispatchContext = createContext<{
  toggle: (productId: number, snapshot: CartLineSnapshot) => Promise<void>
  has: (productId: number) => boolean
} | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthState()
  const [localItems, setLocalItems] = useState<FavoriteProduct[]>(() => loadLocalFavorites())
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const syncedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems))
    }
  }, [isAuthenticated, localItems])

  const reloadApiFavorites = useCallback(async () => {
    const list = await listFavorites()
    setApiProducts(list)
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setApiProducts([])
      syncedRef.current = false
      return
    }

    let cancelled = false
    setLoading(true)
    reloadApiFavorites()
      .catch(() => {
        if (!cancelled) setApiProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, reloadApiFavorites])

  useEffect(() => {
    if (!isAuthenticated || syncedRef.current || authLoading) return
    const pending = loadLocalFavorites()
    if (pending.length === 0) {
      syncedRef.current = true
      return
    }

    let cancelled = false
    ;(async () => {
      for (const item of pending) {
        if (cancelled) return
        try {
          await toggleFavorite(item.productId)
        } catch {
          /* skip invalid ids */
        }
      }
      if (cancelled) return
      localStorage.removeItem(STORAGE_KEY)
      setLocalItems([])
      syncedRef.current = true
      await reloadApiFavorites()
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, reloadApiFavorites])

  const products = useMemo(() => {
    if (isAuthenticated) return apiProducts
    return localItems.map((f) => snapshotToProduct(f.productId, f.snapshot))
  }, [apiProducts, isAuthenticated, localItems])

  const toggle = useCallback(
    async (productId: number, snapshot: CartLineSnapshot) => {
      if (isAuthenticated) {
        try {
          const isFavorite = await toggleFavorite(productId)
          if (isFavorite) {
            setApiProducts((prev) => {
              if (prev.some((p) => p.id === productId)) return prev
              return [...prev, snapshotToProduct(productId, snapshot)]
            })
          } else {
            setApiProducts((prev) => prev.filter((p) => p.id !== productId))
          }
        } catch (err) {
          if (err instanceof PublicApiError && err.message === 'product_not_found') {
            throw err
          }
          throw err
        }
        return
      }

      setLocalItems((prev) => {
        const exists = prev.some((p) => p.productId === productId)
        if (exists) return prev.filter((p) => p.productId !== productId)
        return [...prev, { productId, snapshot }]
      })
    },
    [isAuthenticated],
  )

  const has = useCallback(
    (productId: number) => products.some((p) => p.id === productId),
    [products],
  )

  const state = useMemo(() => ({ products, loading }), [products, loading])
  const api = useMemo(() => ({ toggle, has }), [toggle, has])

  return (
    <FavoritesContext.Provider value={state}>
      <FavoritesDispatchContext.Provider value={api}>
        {children}
      </FavoritesDispatchContext.Provider>
    </FavoritesContext.Provider>
  )
}

export function useFavoriteProducts(): Product[] {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoriteProducts must be used within FavoritesProvider')
  return ctx.products
}

export function useFavoritesLoading(): boolean {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoritesLoading must be used within FavoritesProvider')
  return ctx.loading
}

/** Returns favorite product ids for badge counts. */
export function useFavoriteIds(): Set<number> {
  const items = useFavoriteProducts()
  return useMemo(() => new Set(items.map((p) => p.id)), [items])
}

export function useFavoritesApi() {
  const ctx = useContext(FavoritesDispatchContext)
  if (!ctx) throw new Error('useFavoritesApi must be used within FavoritesProvider')
  return ctx
}

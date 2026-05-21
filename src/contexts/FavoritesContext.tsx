import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLineSnapshot } from '../types'

export type FavoriteProduct = {
  productId: number
  snapshot: CartLineSnapshot
}

const STORAGE_KEY = 'papamia-favorites'

function loadFavorites(): FavoriteProduct[] {
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

const FavoritesContext = createContext<FavoriteProduct[] | null>(null)
const FavoritesDispatchContext = createContext<{
  toggle: (productId: number, snapshot: CartLineSnapshot) => void
  has: (productId: number) => boolean
} | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteProduct[]>(() => loadFavorites())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const toggle = useCallback((productId: number, snapshot: CartLineSnapshot) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.productId === productId)
      if (exists) return prev.filter((p) => p.productId !== productId)
      return [...prev, { productId, snapshot }]
    })
  }, [])

  const has = useCallback(
    (productId: number) => items.some((p) => p.productId === productId),
    [items],
  )

  const api = useMemo(() => ({ toggle, has }), [toggle, has])

  return (
    <FavoritesContext.Provider value={items}>
      <FavoritesDispatchContext.Provider value={api}>
        {children}
      </FavoritesDispatchContext.Provider>
    </FavoritesContext.Provider>
  )
}

export function useFavoriteProducts() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoriteProducts must be used within FavoritesProvider')
  return ctx
}

/** @deprecated Use useFavoriteProducts — returns favorite product ids for badge counts. */
export function useFavoriteIds(): Set<number> {
  const items = useFavoriteProducts()
  return useMemo(() => new Set(items.map((p) => p.productId)), [items])
}

export function useFavoritesApi() {
  const ctx = useContext(FavoritesDispatchContext)
  if (!ctx) throw new Error('useFavoritesApi must be used within FavoritesProvider')
  return ctx
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const FavoritesContext = createContext<Set<string> | null>(null)
const FavoritesDispatchContext = createContext<{
  toggle: (id: string) => void
  has: (id: string) => boolean
} | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set())

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const has = useCallback((id: string) => ids.has(id), [ids])

  const api = useMemo(() => ({ toggle, has }), [toggle, has])

  return (
    <FavoritesContext.Provider value={ids}>
      <FavoritesDispatchContext.Provider value={api}>
        {children}
      </FavoritesDispatchContext.Provider>
    </FavoritesContext.Provider>
  )
}

export function useFavoriteIds() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavoriteIds must be used within FavoritesProvider')
  return ctx
}

export function useFavoritesApi() {
  const ctx = useContext(FavoritesDispatchContext)
  if (!ctx) throw new Error('useFavoritesApi must be used within FavoritesProvider')
  return ctx
}

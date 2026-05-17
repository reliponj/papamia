import { useCallback, useEffect, useMemo, useState } from 'react'

export type CrudResourceConfig<T> = {
  loadItems: () => Promise<T[]>
  getId: (item: T) => number
  sortItems?: (a: T, b: T) => number
  filterItem?: (item: T, query: string) => boolean
}

export function useCrudResource<T>(config: CrudResourceConfig<T>) {
  const { loadItems, getId, sortItems, filterItem } = config

  const sort = sortItems ?? ((a: T, b: T) => getId(a) - getId(b))

  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const reload = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const list = await loadItems()
      list.sort(sort)
      setItems(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [loadItems, sort])

  useEffect(() => {
    void reload()
  }, [reload])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !filterItem) return items
    return items.filter((row) => filterItem(row, q))
  }, [items, query, filterItem])

  const upsertItem = useCallback(
    (item: T) => {
      setItems((prev) => {
        const id = getId(item)
        const next = [...prev.filter((x) => getId(x) !== id), item]
        next.sort(sort)
        return next
      })
    },
    [getId, sort],
  )

  const removeItemById = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => getId(x) !== id))
  }, [getId])

  const runMutation = useCallback(
    async (fn: () => Promise<void>, fallbackMessage: string) => {
      setSaving(true)
      setError(null)
      try {
        await fn()
      } catch (e) {
        setError(e instanceof Error ? e.message : fallbackMessage)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  return {
    items,
    filteredItems,
    loading,
    saving,
    error,
    setError,
    query,
    setQuery,
    reload,
    upsertItem,
    removeItemById,
    runMutation,
  }
}

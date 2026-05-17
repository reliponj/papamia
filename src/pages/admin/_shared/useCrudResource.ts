import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type CrudResourceConfig<T> = {
  loadItems: () => Promise<T[]>
  getId: (item: T) => number
  sortItems?: (a: T, b: T) => number
  filterItem?: (item: T, query: string) => boolean
}

export function useCrudResource<T>(config: CrudResourceConfig<T>) {
  const configRef = useRef(config)
  configRef.current = config

  const defaultSort = useCallback((a: T, b: T) => configRef.current.getId(a) - configRef.current.getId(b), [])

  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const reload = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const { loadItems, sortItems } = configRef.current
      const sort = sortItems ?? defaultSort
      const list = await loadItems()
      list.sort(sort)
      setItems(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [defaultSort])

  useEffect(() => {
    void reload()
  }, [reload])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    const { filterItem } = configRef.current
    if (!q || !filterItem) return items
    return items.filter((row) => filterItem(row, q))
  }, [items, query])

  const upsertItem = useCallback((item: T) => {
    const { getId, sortItems } = configRef.current
    const sort = sortItems ?? defaultSort
    setItems((prev) => {
      const id = getId(item)
      const next = [...prev.filter((x) => getId(x) !== id), item]
      next.sort(sort)
      return next
    })
  }, [defaultSort])

  const removeItemById = useCallback((id: number) => {
    const { getId } = configRef.current
    setItems((prev) => prev.filter((x) => getId(x) !== id))
  }, [])

  const runMutation = useCallback(async (fn: () => Promise<void>, fallbackMessage: string) => {
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
  }, [])

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

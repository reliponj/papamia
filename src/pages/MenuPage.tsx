import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { listAllergens } from '../api/public/allergen'
import { listCategories } from '../api/public/category'
import { listProductsByCategory, type ProductListQuery } from '../api/public/product'
import type { Allergen } from '../api/public/types'
import type { Category, Product } from '../api/public/types'
import { CategoryTabs, type CategoryFilter } from '../components/menu/CategoryTabs'
import { MenuGridSkeleton } from '../components/menu/MenuGridSkeleton'
import { ProductCard } from '../components/menu/ProductCard'
import { useLocale } from '../contexts/LocaleContext'

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc'

function sortToQuery(sort: SortOption): Pick<ProductListQuery, 'sortBy' | 'sortDir'> {
  switch (sort) {
    case 'priceAsc':
      return { sortBy: 'price', sortDir: 'asc' }
    case 'priceDesc':
      return { sortBy: 'price', sortDir: 'desc' }
    case 'nameAsc':
      return { sortBy: 'name', sortDir: 'asc' }
    case 'nameDesc':
      return { sortBy: 'name', sortDir: 'desc' }
    default:
      return {}
  }
}

export function MenuPage() {
  const { t, lang } = useLocale()
  const [categories, setCategories] = useState<Category[]>([])
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [cat, setCat] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('default')
  const [excludedAllergenIds, setExcludedAllergenIds] = useState<Set<number>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const hasLoadedOnce = useRef(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([listCategories(), listAllergens()])
      .then(([cats, allergenList]) => {
        if (cancelled) return
        setCategories(cats)
        setAllergens(allergenList)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load menu')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loadProducts = useCallback(async () => {
    if (categories.length === 0) {
      setProducts([])
      setInitialLoading(false)
      return
    }

    if (hasLoadedOnce.current) setRefreshing(true)
    else setInitialLoading(true)

    setError('')
    const query: ProductListQuery = {
      ...sortToQuery(sort),
      allergenExclude:
        excludedAllergenIds.size > 0 ? [...excludedAllergenIds] : undefined,
    }

    try {
      const categoryIds =
        cat === 'all' ? categories.map((c) => c.id) : [cat as number]
      const lists = await Promise.all(
        categoryIds.map((id) => listProductsByCategory(id, query)),
      )
      const merged = lists.flat()
      const byId = new Map<number, Product>()
      for (const p of merged) byId.set(p.id, p)
      setProducts([...byId.values()])
      hasLoadedOnce.current = true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      if (!hasLoadedOnce.current) setProducts([])
    } finally {
      setInitialLoading(false)
      setRefreshing(false)
    }
  }, [cat, categories, excludedAllergenIds, sort])

  useEffect(() => {
    if (categories.length === 0) return
    void loadProducts()
  }, [loadProducts, categories.length])

  function handleCatChange(c: CategoryFilter) {
    setCat(c)
    setSearch('')
  }

  function toggleAllergen(id: number) {
    setExcludedAllergenIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function clearFilters() {
    setSearch('')
    setSort('default')
    setExcludedAllergenIds(new Set())
  }

  const hasActiveFilters =
    search.trim() !== '' || sort !== 'default' || excludedAllergenIds.size > 0

  const list = useMemo(() => {
    let result = [...products]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    }
    return result
  }, [products, search])

  const FOUND_LABEL: Record<string, (n: number) => string> = {
    ro: (n) => `${n} ${n === 1 ? 'preparat găsit' : 'preparate găsite'}`,
    ru: (n) => {
      const mod = n % 10
      const mod100 = n % 100
      if (mod === 1 && mod100 !== 11) return `${n} блюдо найдено`
      if (mod >= 2 && mod <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} блюда найдено`
      return `${n} блюд найдено`
    },
    en: (n) => `${n} ${n === 1 ? 'dish' : 'dishes'} found`,
  }

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('menu.filter.price') },
    { value: 'priceAsc', label: t('menu.filter.priceAsc') },
    { value: 'priceDesc', label: t('menu.filter.priceDesc') },
    { value: 'nameAsc', label: t('menu.filter.nameAsc') },
    { value: 'nameDesc', label: t('menu.filter.nameDesc') },
  ]

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? t('menu.filter.price')

  const showSkeleton = initialLoading && products.length === 0

  return (
    <div className="menu-page section">
      <header className="section-head menu-page__head">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-sub">{t('menu.sub')}</p>
      </header>

      <CategoryTabs categories={categories} active={cat} onChange={handleCatChange} />

      <div className="menu-filters">
        <div className="menu-filters__search-row">
          <div className="menu-filters__search-wrap">
            <svg className="menu-filters__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              className="menu-filters__search"
              type="search"
              placeholder={t('menu.search.placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t('menu.search.placeholder')}
            />
          </div>

          <Select.Root value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <Select.Trigger className="sort-trigger" aria-label={t('menu.filter.price')}>
              <Select.Value>{currentSortLabel}</Select.Value>
              <Select.Icon className="sort-trigger__icon">
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="sort-content" position="popper" sideOffset={6}>
                <Select.Viewport className="sort-viewport">
                  {SORT_OPTIONS.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value} className="sort-item">
                      <Select.ItemText>{opt.label}</Select.ItemText>
                      <Select.ItemIndicator className="sort-item__check">
                        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {hasActiveFilters && (
            <button className="menu-filters__clear" onClick={clearFilters} type="button">
              {t('menu.filter.clearAll')}
            </button>
          )}
        </div>

        {allergens.length > 0 && (
          <div className="menu-filters__allergens">
            <span className="menu-filters__allergens-label">{t('menu.filter.allergens')}:</span>
            <div className="menu-filters__allergens-list">
              {allergens.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`menu-filters__allergen-btn crm-pill${excludedAllergenIds.has(a.id) ? ' is-excluded' : ''}`}
                  onClick={() => toggleAllergen(a.id)}
                  aria-pressed={excludedAllergenIds.has(a.id)}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="menu-page__results" aria-busy={refreshing}>
        {error && <p className="menu-page__error">{error}</p>}

        {showSkeleton ? (
          <MenuGridSkeleton />
        ) : (
          <>
            <p className="menu-page__count">
              {refreshing ? t('menu.loading') : FOUND_LABEL[lang](list.length)}
            </p>

            <div className={`menu-page__grid-wrap${refreshing ? ' is-refreshing' : ''}`}>
              {refreshing && (
                <div className="menu-page__refresh-overlay" aria-hidden>
                  <span className="menu-page__spinner" />
                </div>
              )}

              {list.length === 0 ? (
                <p className="menu-page__empty">{t('menu.filter.noResults')}</p>
              ) : (
                <div className="menu-page__grid">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

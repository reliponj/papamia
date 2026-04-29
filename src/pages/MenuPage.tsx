import { useMemo, useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { MENU_PRODUCTS } from '../data/menu'
import { useLocale } from '../contexts/LocaleContext'
import type { Allergen, MenuCategory } from '../types'
import { CategoryTabs, type CategoryFilter } from '../components/menu/CategoryTabs'
import { ProductCard } from '../components/menu/ProductCard'

const ALL_ALLERGENS: Allergen[] = ['gluten', 'dairy', 'eggs', 'fish', 'nuts', 'soy', 'alcohol']

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc'

const ALLERGEN_EMOJI: Record<Allergen, string> = {
  gluten: '🌾',
  dairy: '🥛',
  eggs: '🥚',
  fish: '🐟',
  nuts: '🥜',
  soy: '🫘',
  alcohol: '🍷',
}

const ALLERGEN_KEY = {
  gluten: 'allergen.gluten',
  dairy: 'allergen.dairy',
  eggs: 'allergen.eggs',
  fish: 'allergen.fish',
  nuts: 'allergen.nuts',
  soy: 'allergen.soy',
  alcohol: 'allergen.alcohol',
} as const

export function MenuPage() {
  const { t, lang } = useLocale()
  const [cat, setCat] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('default')
  const [excludedAllergens, setExcludedAllergens] = useState<Set<Allergen>>(new Set())

  function handleCatChange(c: CategoryFilter) {
    setCat(c)
    setSearch('')
  }

  function toggleAllergen(a: Allergen) {
    setExcludedAllergens((prev) => {
      const next = new Set(prev)
      next.has(a) ? next.delete(a) : next.add(a)
      return next
    })
  }

  function clearFilters() {
    setSearch('')
    setSort('default')
    setExcludedAllergens(new Set())
  }

  const hasActiveFilters = search.trim() !== '' || sort !== 'default' || excludedAllergens.size > 0

  const list = useMemo(() => {
    let result = cat === 'all'
      ? [...MENU_PRODUCTS]
      : MENU_PRODUCTS.filter((p) => p.category === (cat as MenuCategory))

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name[lang].toLowerCase().includes(q) ||
          p.description[lang].toLowerCase().includes(q),
      )
    }

    if (excludedAllergens.size > 0) {
      result = result.filter(
        (p) => !p.allergens?.some((a) => excludedAllergens.has(a)),
      )
    }

    if (sort === 'priceAsc') result = [...result].sort((a, b) => a.price - b.price)
    else if (sort === 'priceDesc') result = [...result].sort((a, b) => b.price - a.price)
    else if (sort === 'nameAsc') result = [...result].sort((a, b) => a.name[lang].localeCompare(b.name[lang]))
    else if (sort === 'nameDesc') result = [...result].sort((a, b) => b.name[lang].localeCompare(a.name[lang]))

    return result
  }, [cat, search, sort, excludedAllergens, lang])

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('menu.filter.price') },
    { value: 'priceAsc', label: t('menu.filter.priceAsc') },
    { value: 'priceDesc', label: t('menu.filter.priceDesc') },
    { value: 'nameAsc', label: t('menu.filter.nameAsc') },
    { value: 'nameDesc', label: t('menu.filter.nameDesc') },
  ]

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? t('menu.filter.price')

  return (
    <div className="menu-page section">
      <header className="section-head menu-page__head">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-sub">{t('menu.sub')}</p>
      </header>

      <CategoryTabs active={cat} onChange={handleCatChange} />

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

        <div className="menu-filters__allergens">
          <span className="menu-filters__allergens-label">{t('menu.filter.allergens')}:</span>
          <div className="menu-filters__allergens-list">
            {ALL_ALLERGENS.map((a) => (
              <button
                key={a}
                type="button"
                className={`menu-filters__allergen-btn${excludedAllergens.has(a) ? ' is-excluded' : ''}`}
                onClick={() => toggleAllergen(a)}
                title={t(ALLERGEN_KEY[a])}
                aria-pressed={excludedAllergens.has(a)}
              >
                <span>{ALLERGEN_EMOJI[a]}</span>
                <span>{t(ALLERGEN_KEY[a])}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
  )
}

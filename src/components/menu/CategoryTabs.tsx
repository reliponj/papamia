import type { MenuCategory } from '../../types'
import { CATEGORY_LABELS } from '../../data/translations'
import { useLocale } from '../../contexts/LocaleContext'

const ORDER: MenuCategory[] = [
  'pizza',
  'pinsa',
  'antipasti',
  'pasta',
  'dolci',
  'drinks',
]

const ALL_LABEL: Record<string, string> = {
  ro: 'Toate',
  ru: 'Все',
  en: 'All',
}

export type CategoryFilter = MenuCategory | 'all'

type Props = {
  active: CategoryFilter
  onChange: (c: CategoryFilter) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  const { lang } = useLocale()
  return (
    <div className="category-tabs" role="tablist" aria-label="Menu categories">
      <button
        key="all"
        type="button"
        role="tab"
        aria-selected={active === 'all'}
        className={`category-tabs__btn${active === 'all' ? ' is-active' : ''}`}
        onClick={() => onChange('all')}
      >
        {ALL_LABEL[lang]}
      </button>
      {ORDER.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={active === cat}
          className={`category-tabs__btn${active === cat ? ' is-active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {CATEGORY_LABELS[cat][lang]}
        </button>
      ))}
    </div>
  )
}

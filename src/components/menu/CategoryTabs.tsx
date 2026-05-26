import type { Category } from '../../api/public/types'
import { useLocale } from '../../contexts/LocaleContext'

const ALL_LABEL: Record<string, string> = {
  ro: 'Toate',
  ru: 'Все',
  en: 'All',
}

export type CategoryFilter = number | 'all'

type Props = {
  categories: Category[]
  active: CategoryFilter
  onChange: (c: CategoryFilter) => void
}

export function CategoryTabs({ categories, active, onChange }: Props) {
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
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={active === cat.id}
          className={`category-tabs__btn${active === cat.id ? ' is-active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.icon ? `${cat.icon} ` : ''}
          {cat.name}
        </button>
      ))}
    </div>
  )
}

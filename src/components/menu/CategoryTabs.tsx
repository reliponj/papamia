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

type Props = {
  active: MenuCategory
  onChange: (c: MenuCategory) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  const { lang } = useLocale()
  return (
    <div className="category-tabs" role="tablist" aria-label="Menu categories">
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

import type { FC } from 'react'
import type { Category } from '../data/products'

export type FilterValue = 'all' | Category

interface FilterButtonsProps {
  activeFilter: FilterValue
  onChange: (value: FilterValue) => void
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Все блюда' },
  { value: 'pizza', label: 'Пицца' },
  { value: 'pasta', label: 'Паста' },
  { value: 'soup', label: 'Супы' },
]

export const FilterButtons: FC<FilterButtonsProps> = ({
  activeFilter,
  onChange,
}) => {
  return (
    <div className="filter-buttons">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={
            activeFilter === filter.value
              ? 'filter-button filter-button-active'
              : 'filter-button'
          }
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}


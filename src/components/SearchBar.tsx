import type { ChangeEvent, FC } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <section className="search-section">
      <label className="search-label" htmlFor="search">
        Найдите своё идеальное блюдо
      </label>
      <input
        id="search"
        type="text"
        className="search-input"
        placeholder="Поиск по названию: пицца, паста, суп..."
        value={value}
        onChange={handleChange}
      />
    </section>
  )
}


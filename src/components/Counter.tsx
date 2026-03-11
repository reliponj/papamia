import type { FC } from 'react'

interface CounterProps {
  foundCount: number
  cartCount: number
}

export const Counter: FC<CounterProps> = ({ foundCount, cartCount }) => {
  return (
    <p className="catalog-count">
      Найдено блюд: <span>{foundCount}</span> | В корзине:{' '}
      <span>{cartCount}</span>
    </p>
  )
}


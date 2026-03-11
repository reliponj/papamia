import type { FC } from 'react'

interface CounterProps {
  count: number
}

export const Counter: FC<CounterProps> = ({ count }) => {
  return (
    <p className="catalog-count">
      Найдено блюд: <span>{count}</span>
    </p>
  )
}


import type { FC } from 'react'
import type { Product } from '../data/products'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
}

export const ProductList: FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <p className="empty-state">
        Ничего не найдено. Попробуйте другой запрос или фильтр.
      </p>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}


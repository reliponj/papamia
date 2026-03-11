import type { FC } from 'react'
import type { Product } from '../data/products'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  favoriteIds: number[]
  onToggleFavorite: (id: number) => void
  onAddToCart: (product: Product) => void
  getQuantityForProduct: (id: number) => number
  onIncreaseQuantity: (product: Product) => void
  onDecreaseQuantity: (product: Product) => void
}

export const ProductList: FC<ProductListProps> = ({
  products,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  getQuantityForProduct,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
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
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteIds.includes(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
          quantity={getQuantityForProduct(product.id)}
          onIncrease={() => onIncreaseQuantity(product)}
          onDecrease={() => onDecreaseQuantity(product)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  )
}


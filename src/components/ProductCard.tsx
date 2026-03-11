import type { FC } from 'react'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
  onAddToCart: () => void
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) => {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className={`product-tag product-tag-${product.category}`}>
          {product.category === 'pizza' && 'Пицца'}
          {product.category === 'pasta' && 'Паста'}
          {product.category === 'soup' && 'Суп'}
        </span>
        <button
          type="button"
          className={
            isFavorite ? 'favorite-button favorite-button-active' : 'favorite-button'
          }
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          {isFavorite ? '❤' : '♡'}
        </button>
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-footer">
        <span className="product-price">{product.price} MDL</span>
        <button type="button" className="product-button" onClick={onAddToCart}>
          В корзину
        </button>
      </div>
    </article>
  )
}


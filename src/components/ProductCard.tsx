import { type FC, useState } from 'react'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onAddToCart: () => void
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}) => {
  const [likes, setLikes] = useState(0)

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
        <button
          type="button"
          className="like-button"
          onClick={() => setLikes((current) => current + 1)}
        >
          👍 {likes}
        </button>
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-footer">
        <span className="product-price">{product.price} MDL</span>
        <div className="product-actions">
          {quantity > 0 ? (
            <div className="quantity-control">
              <button
                type="button"
                className="quantity-button"
                onClick={onDecrease}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <input
                className="quantity-input"
                type="text"
                readOnly
                value={quantity}
              />
              <button
                type="button"
                className="quantity-button"
                onClick={onIncrease}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
          ) : (
            <button type="button" className="product-button" onClick={onAddToCart}>
              В корзину
            </button>
          )}
        </div>
      </div>
    </article>
  )
}


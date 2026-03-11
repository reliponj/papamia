import type { FC } from 'react'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
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
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="product-footer">
        <span className="product-price">{product.price} MDL</span>
        <button type="button" className="product-button">
          В корзину
        </button>
      </div>
    </article>
  )
}


import type { FC } from 'react'
import type { CartItem } from '../types/cart'

interface CartModalProps {
  isOpen: boolean
  items: CartItem[]
  onClose: () => void
}

export const CartModal: FC<CartModalProps> = ({ isOpen, items, onClose }) => {
  if (!isOpen) return null

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  return (
    <div className="cart-dropdown">
      <header className="cart-modal-header">
        <h3>Корзина</h3>
        <button
          type="button"
          className="cart-modal-close"
          onClick={onClose}
        >
          ✕
        </button>
      </header>

      {items.length === 0 ? (
        <p className="cart-empty">Ваша корзина пуста.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.product.name}</span>
                  <span className="cart-item-price">
                    {item.quantity} × {item.product.price} MDL
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Итого:</span>
            <span className="cart-total-value">{total} MDL</span>
          </div>
          <button type="button" className="cart-checkout-button">
            Оформить заказ
          </button>
        </>
      )}
    </div>
  )
}



import type { FC } from 'react'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export const Header: FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-badge">🍕</span>
        <div>
          <div className="logo-title">PapaMia</div>
          <div className="logo-subtitle">Итальянская кухня с доставкой</div>
        </div>
      </div>
      <div className="header-right">
        <nav className="nav">
          <a href="#catalog">Каталог</a>
          <a href="#favorites">Избранное</a>
          <a href="#about">О нас</a>
        </nav>
        <button type="button" className="cart-button" onClick={onCartClick}>
          <span className="cart-button-icon">🛒</span>
          <span className="cart-button-label">Корзина</span>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}


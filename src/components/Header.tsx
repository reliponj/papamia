import type { FC } from 'react'

export const Header: FC = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-badge">🍕</span>
        <div>
          <div className="logo-title">PapaMia</div>
          <div className="logo-subtitle">Итальянская кухня с доставкой</div>
        </div>
      </div>
      <nav className="nav">
        <a href="#catalog">Каталог</a>
        <a href="#favorites">Избранное</a>
        <a href="#about">О нас</a>
      </nav>
    </header>
  )
}


import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCartActions, useCartTotals } from '../../contexts/CartContext'
import { useFavoriteIds } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import type { Lang } from '../../types'
import { Button } from '../ui/Button'

const LANGS: Lang[] = ['ro', 'ru', 'en']

export function SiteHeader() {
  const { t, lang, setLang } = useLocale()
  const { count } = useCartTotals()
  const favorites = useFavoriteIds()
  const { openDrawer, toggleDrawer } = useCartActions()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand" onClick={() => setMenuOpen(false)}>
          <span className="site-header__logo">Papa Mia</span>
          <span className="site-header__tagline">{t('brand.tagline')}</span>
        </Link>

        <button
          type="button"
          className={`site-header__burger${menuOpen ? ' is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={t('aria.openMenu')}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav${menuOpen ? ' is-open' : ''}`}>
          <NavLink
            to="/menu"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.menu')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.about')}
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.contacts')}
          </NavLink>
          <Button
            variant="primary"
            className="site-nav__cta"
            onClick={() => {
              setMenuOpen(false)
              openDrawer()
            }}
          >
            {t('nav.order')}
          </Button>
        </nav>

        <div className="site-header__tools">
          <div className="lang-switch" role="group" aria-label={t('aria.lang')}>
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                className={`lang-switch__btn${lang === code ? ' is-active' : ''}`}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <span className="site-header__fav" title={t('favorites.title')}>
            ♥ {favorites.size}
          </span>
          <button
            type="button"
            className="site-header__cart"
            onClick={() => toggleDrawer()}
            aria-label={t('cart.title')}
          >
            <span className="site-header__cart-icon" aria-hidden>
              🛒
            </span>
            <span className="site-header__cart-count">{count}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCartActions, useCartTotals } from '../../contexts/CartContext'
import { useFavoriteIds } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useAuthState, useAuthApi } from '../../contexts/AuthContext'
import type { Lang } from '../../types'

const LANGS: Lang[] = ['ro', 'ru', 'en']

export function SiteHeader() {
  const { t, lang, setLang } = useLocale()
  const { count } = useCartTotals()
  const favorites = useFavoriteIds()
  const { toggleDrawer } = useCartActions()
  const { isAuthenticated } = useAuthState()
  const { logout } = useAuthApi()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

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
            to="/builder"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.builder')}
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
          <NavLink
            to="/blog"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.blog')}
          </NavLink>
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
          {isAuthenticated ? (
            <button
              type="button"
              className="site-header__login"
              onClick={() => { logout(); navigate('/') }}
            >
              {t('auth.logout')}
            </button>
          ) : (
            <button
              type="button"
              className="site-header__login"
              onClick={() => navigate('/login')}
            >
              {t('auth.login')}
            </button>
          )}
          {isAuthenticated && (
            <button
              type="button"
              className="site-header__account"
              onClick={() => navigate('/account')}
              title={t('account.nav')}
              aria-label={t('account.nav')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          )}
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

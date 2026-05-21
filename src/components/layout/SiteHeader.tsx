import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCartActions, useCartTotals } from '../../contexts/CartContext'
import { useFavoriteIds } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useAuthState, useAuthApi } from '../../contexts/AuthContext'
import type { Lang } from '../../types'

const LANGS: Lang[] = ['ro', 'ru', 'en']
const SCROLL_THRESHOLD = 56

const LANG_LABELS: Record<Lang, string> = {
  ro: 'RO — Română',
  ru: 'RU — Русский',
  en: 'EN — English',
}

export function SiteHeader() {
  const { t, lang, setLang } = useLocale()
  const { count } = useCartTotals()
  const favorites = useFavoriteIds()
  const { toggleDrawer } = useCartActions()
  const { isAuthenticated } = useAuthState()
  const { logout } = useAuthApi()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }

    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const headerClass = [
    'site-header',
    isHome ? 'site-header--home' : '',
    isHome && !scrolled ? 'site-header--overlay' : 'site-header--solid',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClass}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand" onClick={() => setMenuOpen(false)}>
          <span className="site-header__logo">Papa Mia</span>
          <span className="site-header__tagline">{t('brand.tagline')}</span>
        </Link>

        <button
          type="button"
          className={`site-header__burger btn btn--icon btn--secondary${menuOpen ? ' is-open' : ''}`}
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
          <NavLink
            to="/reviews"
            className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.reviews')}
          </NavLink>
        </nav>

        <div className="site-header__tools">
          <label className="lang-select-wrap">
            <span className="visually-hidden">{t('aria.lang')}</span>
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label={t('aria.lang')}
            >
              {LANGS.map((code) => (
                <option key={code} value={code}>
                  {LANG_LABELS[code]}
                </option>
              ))}
            </select>
          </label>

          <Link
            to="/favorites"
            className="btn btn--icon btn--secondary site-header__fav-btn"
            aria-label={t('favorites.title')}
            title={t('favorites.title')}
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden>♥</span>
            {favorites.size > 0 && (
              <span className="site-header__badge">{favorites.size}</span>
            )}
          </Link>

          <button
            type="button"
            className="btn btn--secondary btn--sm site-header__auth-btn"
            onClick={() => {
              if (isAuthenticated) {
                logout()
                navigate('/')
              } else {
                navigate('/login')
              }
            }}
          >
            {isAuthenticated ? t('auth.logout') : t('auth.login')}
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="btn btn--icon btn--secondary"
              onClick={() => navigate('/account')}
              title={t('account.nav')}
              aria-label={t('account.nav')}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>
          )}

          <button
            type="button"
            className="btn btn--icon btn--secondary site-header__cart"
            onClick={() => toggleDrawer()}
            aria-label={t('cart.title')}
          >
            <span className="site-header__cart-icon" aria-hidden>
              🛒
            </span>
            {count > 0 && <span className="site-header__badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

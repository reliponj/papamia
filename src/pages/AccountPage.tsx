import { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { useFavoriteIds, useFavoritesApi } from '../contexts/FavoritesContext'
import { MENU_PRODUCTS } from '../data/menu'
import { Button } from '../components/ui/Button'
import { useCartActions } from '../contexts/CartContext'

type Tab = 'profile' | 'favorites' | 'orders' | 'security'

const MOCK_ORDERS = [
  {
    id: '#1042',
    date: '2024-12-15',
    total: 385,
    status: 'delivered' as const,
    items: 4,
  },
  {
    id: '#1031',
    date: '2024-11-28',
    total: 220,
    status: 'delivered' as const,
    items: 2,
  },
  {
    id: '#1028',
    date: '2024-11-10',
    total: 510,
    status: 'delivered' as const,
    items: 5,
  },
]

export function AccountPage() {
  const { t, lang } = useLocale()
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div className="account-page section">
      <h1 className="account-page__title">{t('account.title')}</h1>

      <div className="account-tabs">
        {(['profile', 'favorites', 'orders', 'security'] as Tab[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`account-tabs__btn${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {t(`account.tab.${id}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      <div className="account-content">
        {tab === 'profile' && <ProfileTab />}
        {tab === 'favorites' && <FavoritesTab lang={lang} />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}

function ProfileTab() {
  const { t } = useLocale()
  const [name, setName] = useState('Alina')
  const [email, setEmail] = useState('alina@example.com')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__section">
        <label className="auth-form__label">
          {t('account.profile.name')}
          <input
            className="auth-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="auth-form__label">
          {t('account.profile.email')}
          <input
            className="auth-form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <Button variant="primary" className="profile-form__submit">
        {saved ? t('account.profile.saved') : t('account.profile.save')}
      </Button>
    </form>
  )
}

function SecurityTab() {
  const { t } = useLocale()
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setError(t('account.security.mismatch'))
      return
    }
    setError('')
    setSaved(true)
    setNewPw('')
    setConfirmPw('')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__section">
        <label className="auth-form__label">
          {t('account.security.newPassword')}
          <input
            className="auth-form__input"
            type="password"
            autoComplete="new-password"
            value={newPw}
            onChange={(e) => { setNewPw(e.target.value); setError('') }}
          />
        </label>
        <label className="auth-form__label">
          {t('account.security.confirmPassword')}
          <input
            className="auth-form__input"
            type="password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setError('') }}
          />
        </label>
        {error && <p className="profile-form__error">{error}</p>}
      </div>

      <Button variant="primary" className="profile-form__submit">
        {saved ? t('account.security.saved') : t('account.security.save')}
      </Button>
    </form>
  )
}

function FavoritesTab({ lang }: { lang: string }) {
  const { t } = useLocale()
  const favoriteIds = useFavoriteIds()
  const { toggle } = useFavoritesApi()
  const { add, openDrawer } = useCartActions()

  const favoriteProducts = MENU_PRODUCTS.filter((p) => favoriteIds.has(p.id))

  if (favoriteProducts.length === 0) {
    return <p className="account-empty">{t('favorites.empty')}</p>
  }

  return (
    <ul className="favorites-grid">
      {favoriteProducts.map((product) => (
        <li key={product.id} className="favorites-card">
          <img
            src={product.image}
            alt={product.name[lang as keyof typeof product.name]}
            className="favorites-card__img"
          />
          <div className="favorites-card__body">
            <p className="favorites-card__name">
              {product.name[lang as keyof typeof product.name]}
            </p>
            <p className="favorites-card__price">
              {product.price} {t('menu.currency')}
            </p>
          </div>
          <div className="favorites-card__actions">
            <Button
              variant="primary"
              onClick={() => {
                add(product.id)
                openDrawer()
              }}
            >
              {t('menu.add')}
            </Button>
            <button
              type="button"
              className="favorites-card__remove"
              onClick={() => toggle(product.id)}
              title={t('cart.remove')}
            >
              ♥
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function OrdersTab() {
  const { t } = useLocale()

  if (MOCK_ORDERS.length === 0) {
    return <p className="account-empty">{t('account.orders.empty')}</p>
  }

  return (
    <ul className="orders-list">
      {MOCK_ORDERS.map((order) => (
        <li key={order.id} className="order-card">
          <div className="order-card__row">
            <span className="order-card__id">
              {t('account.orders.order')} {order.id}
            </span>
            <span
              className={`order-card__status order-card__status--${order.status}`}
            >
              {t(`account.orders.status.${order.status}` as Parameters<typeof t>[0])}
            </span>
          </div>
          <div className="order-card__meta">
            <span className="order-card__date">{order.date}</span>
            <span className="order-card__items">
              {order.items} {t('account.orders.items')}
            </span>
            <span className="order-card__total">
              {order.total} {t('menu.currency')}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

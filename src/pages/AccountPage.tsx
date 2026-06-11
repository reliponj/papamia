import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { listMyOrders } from '../api/public/order'
import type { Order, OrderStatus } from '../api/public/types'
import { useLocale } from '../contexts/LocaleContext'
import { FavoritesList } from '../components/favorites/FavoritesList'
import { Button } from '../components/ui/Button'
import { PasswordInput } from '../components/ui/PasswordInput'
import { useAuthState, useAuthApi } from '../contexts/AuthContext'
import { apiChangePassword, apiUpdateMe } from '../services/api'
import type { UiKey } from '../data/translations'

type Tab = 'profile' | 'favorites' | 'orders' | 'security'

const ORDER_STATUS_KEYS: Record<OrderStatus, UiKey> = {
  0: 'order.status.new',
  1: 'order.status.process',
  2: 'order.status.done',
  3: 'order.status.cancel',
}

function orderItemCount(order: Order): number {
  const productQty = order.items.reduce((s, i) => s + i.quantity, 0)
  const pizzaQty = order.customPizzaItems.reduce((s, i) => s + i.quantity, 0)
  return productQty + pizzaQty
}

const AVATAR_MAX_BYTES = 2 * 1024 * 1024

function avatarStorageKey(userId: string | number): string {
  return `papamia-avatar-${userId}`
}

function readStoredAvatar(userId: string | number): string | null {
  try {
    return localStorage.getItem(avatarStorageKey(userId))
  } catch {
    return null
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/** UI-only avatar picker — persists the chosen image in localStorage. */
function ProfileAvatar({ userId, name }: { userId: string | number; name: string }) {
  const { t } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string | null>(() => readStoredAvatar(userId))
  const [error, setError] = useState('')

  useEffect(() => {
    setAvatar(readStoredAvatar(userId))
  }, [userId])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(t('account.avatar.hint'))
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setError(t('account.avatar.hint'))
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      setAvatar(dataUrl)
      try {
        localStorage.setItem(avatarStorageKey(userId), dataUrl)
      } catch {
        /* storage full — keep it in memory only */
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    setAvatar(null)
    setError('')
    try {
      localStorage.removeItem(avatarStorageKey(userId))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="profile-avatar">
      <div className="profile-avatar__preview">
        {avatar ? (
          <img src={avatar} alt="" className="profile-avatar__img" />
        ) : (
          <span className="profile-avatar__initials">{initialsFromName(name)}</span>
        )}
      </div>
      <div className="profile-avatar__body">
        <div className="profile-avatar__actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => inputRef.current?.click()}
          >
            {t('account.avatar.change')}
          </button>
          {avatar && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleRemove}>
              {t('account.avatar.remove')}
            </button>
          )}
        </div>
        {error && <p className="profile-avatar__hint profile-avatar__hint--error">{error}</p>}
      </div>
    </div>
  )
}

export function AccountPage() {
  const { t } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthApi()
  const initialTab = (location.state as { tab?: Tab } | null)?.tab
  const [tab, setTab] = useState<Tab>(initialTab ?? 'profile')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="account-page section">
      <div className="account-page__head">
        <h1 className="account-page__title">{t('account.title')}</h1>
        <button type="button" className="btn btn--secondary account-page__logout" onClick={handleLogout}>
          {t('auth.logout')}
        </button>
      </div>

      <div className="account-tabs">
        {(['profile', 'favorites', 'orders', 'security'] as Tab[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`account-tabs__btn${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {t(`account.tab.${id}` as UiKey)}
          </button>
        ))}
      </div>

      <div className="account-content">
        {tab === 'profile' && <ProfileTab />}
        {tab === 'favorites' && <FavoritesTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}

function ProfileTab() {
  const { t } = useLocale()
  const { user, isLoading } = useAuthState()
  const { refetchUser } = useAuthApi()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiUpdateMe({ username, email })
      await refetchUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <p className="account-empty">...</p>
  }

  return (
    <form className="profile-form" onSubmit={(e) => void handleSubmit(e)}>
      {user && <ProfileAvatar userId={user.id} name={username || user.username || ''} />}

      <div className="profile-form__section">
        <label className="auth-form__label">
          {t('auth.username')}
          <input
            className="auth-form__input"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="auth-form__label">
          {t('account.profile.email')}
          <input
            className="auth-form__input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {error && <p className="profile-form__error">{error}</p>}
      </div>

      <Button type="submit" variant="primary" className="profile-form__submit" disabled={loading}>
        {saved ? t('account.profile.saved') : loading ? '...' : t('account.profile.save')}
      </Button>
    </form>
  )
}

function SecurityTab() {
  const { t } = useLocale()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setError(t('account.security.mismatch'))
      return
    }
    setError('')
    setLoading(true)
    try {
      await apiChangePassword(currentPw, newPw)
      setSaved(true)
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="profile-form" onSubmit={(e) => void handleSubmit(e)}>
      <div className="profile-form__section">
        <label className="auth-form__label">
          {t('account.security.currentPassword')}
          <PasswordInput
            value={currentPw}
            onChange={(v) => {
              setCurrentPw(v)
              setError('')
            }}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="auth-form__label">
          {t('account.security.newPassword')}
          <PasswordInput
            value={newPw}
            onChange={(v) => {
              setNewPw(v)
              setError('')
            }}
            autoComplete="new-password"
            required
          />
        </label>
        <label className="auth-form__label">
          {t('account.security.confirmPassword')}
          <PasswordInput
            value={confirmPw}
            onChange={(v) => {
              setConfirmPw(v)
              setError('')
            }}
            autoComplete="new-password"
            required
          />
        </label>
        {error && <p className="profile-form__error">{error}</p>}
      </div>

      <Button type="submit" variant="primary" className="profile-form__submit" disabled={loading}>
        {saved ? t('account.security.saved') : loading ? '...' : t('account.security.save')}
      </Button>
    </form>
  )
}

function FavoritesTab() {
  return <FavoritesList />
}

function OrdersTab() {
  const { t, lang } = useLocale()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listMyOrders()
      .then((items) => {
        if (!cancelled) setOrders(items)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p className="account-empty">...</p>
  if (error) return <p className="account-empty">{error}</p>
  if (orders.length === 0) return <p className="account-empty">{t('account.orders.empty')}</p>

  return (
    <ul className="orders-list">
      {orders.map((order) => {
        const count = orderItemCount(order)
        const date = new Date(order.createdAt).toLocaleDateString(
          lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
        )
        return (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`} className="order-card order-card--link">
              <div className="order-card__row">
                <span className="order-card__id">
                  {t('account.orders.order')} #{order.id}
                </span>
                <span className={`order-card__status order-card__status--${order.status}`}>
                  {t(ORDER_STATUS_KEYS[order.status])}
                </span>
              </div>
              <div className="order-card__meta">
                <span className="order-card__date">{date}</span>
                <span className="order-card__items">
                  {count} {t('account.orders.items')}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

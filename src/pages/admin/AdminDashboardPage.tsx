import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOrders } from '../../api/admin/order'
import { listPromocodes } from '../../api/admin/promocode'
import { listReviews } from '../../api/admin/review'
import { ORDER_STATUS_LABELS } from '../../api/admin/types'
import { AdminApiError } from '../../api/admin/http'
import { AdminAlert } from './_shared/AdminAlert'
import { AdminPageHeader } from './_shared/AdminPageHeader'

type DashboardStats = {
  ordersToday: number
  ordersPending: number
  reviewsHidden: number
  promocodesActive: number
  ordersTotal: number
  reviewsTotal: number
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function errorMessage(err: unknown): string {
  if (err instanceof AdminApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Failed to load dashboard'
}

const QUICK_LINKS = [
  { to: '/admin/orders', label: 'Orders', hint: 'View and edit orders' },
  { to: '/admin/reviews', label: 'Reviews', hint: 'Moderate customer feedback' },
  { to: '/admin/products', label: 'Products', hint: 'Menu catalog' },
  { to: '/admin/promocodes', label: 'Promo codes', hint: 'Discounts' },
  { to: '/admin/users', label: 'Users', hint: 'Accounts and roles' },
  { to: '/admin/banners', label: 'Banners', hint: 'Homepage slides' },
] as const

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void (async () => {
      try {
        const [orders, reviews, promocodes] = await Promise.all([
          listOrders(),
          listReviews(),
          listPromocodes(),
        ])
        if (cancelled) return
        setStats({
          ordersToday: orders.filter((o) => isToday(o.createdAt)).length,
          ordersPending: orders.filter((o) => o.status === 0 || o.status === 1).length,
          reviewsHidden: reviews.filter((r) => r.isHidden).length,
          promocodesActive: promocodes.filter((p) => p.isActive).length,
          ordersTotal: orders.length,
          reviewsTotal: reviews.length,
        })
      } catch (err) {
        if (!cancelled) setError(errorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const tiles = useMemo(() => {
    if (!stats) return []
    return [
      {
        key: 'orders-today',
        title: 'Orders today',
        value: stats.ordersToday,
        hint: `${stats.ordersTotal} total in system`,
        to: '/admin/orders',
      },
      {
        key: 'orders-pending',
        title: 'Pending orders',
        value: stats.ordersPending,
        hint: `${ORDER_STATUS_LABELS[0]} / ${ORDER_STATUS_LABELS[1]}`,
        to: '/admin/orders',
      },
      {
        key: 'reviews-hidden',
        title: 'Hidden reviews',
        value: stats.reviewsHidden,
        hint: `${stats.reviewsTotal} reviews total`,
        to: '/admin/reviews',
      },
      {
        key: 'promos-active',
        title: 'Active promo codes',
        value: stats.promocodesActive,
        hint: 'Currently valid codes',
        to: '/admin/promocodes',
      },
    ]
  }, [stats])

  return (
    <section className="crm-section admin-dashboard">
      <AdminPageHeader title="Dashboard" />
      {error && <AdminAlert message={error} />}

      <div className="admin-dashboard__tiles" aria-busy={loading}>
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="admin-stat-card admin-stat-card--skeleton" />
          ))}
        {!loading &&
          tiles.map((tile) => (
            <Link key={tile.key} to={tile.to} className="admin-stat-card">
              <span className="admin-stat-card__label">{tile.title}</span>
              <span className="admin-stat-card__value">{tile.value}</span>
              <span className="admin-stat-card__hint">{tile.hint}</span>
            </Link>
          ))}
      </div>

      <section className="admin-dashboard__links">
        <h3>Quick links</h3>
        <ul className="admin-quick-links">
          {QUICK_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="admin-quick-link">
                <span className="admin-quick-link__label">{link.label}</span>
                <span className="admin-quick-link__hint">{link.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

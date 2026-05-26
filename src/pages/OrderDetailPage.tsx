import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { formatPriceMdl } from '../api/money'
import { getMyOrder } from '../api/public/order'
import { fetchProductsByIds } from '../api/public/orderProducts'
import { getCustomPizza, listIngredients } from '../api/public/pizza-constructor'
import { PublicApiError } from '../api/public/http'
import type { CustomPizzaDto, Order, OrderStatus } from '../api/public/types'
import type { Product } from '../api/public/types'
import { useAuthState } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import type { UiKey } from '../data/translations'
import { previewFromIngredientIds } from '../utils/pizzaBuilderUi'
import { ButtonLink } from '../components/ui/Button'

type LocationState = {
  order?: Order
  justPlaced?: boolean
}

type CustomPizzaResolved = {
  item: { customPizzaId: number; quantity: number }
  pizza: CustomPizzaDto
  previewLabel: string
}

const ORDER_STATUS_KEYS: Record<OrderStatus, UiKey> = {
  0: 'order.status.new',
  1: 'order.status.process',
  2: 'order.status.done',
  3: 'order.status.cancel',
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  0: 'order-detail__status--new',
  1: 'order-detail__status--process',
  2: 'order-detail__status--done',
  3: 'order-detail__status--cancel',
}

function paymentLabel(order: Order, t: (key: UiKey) => string): string {
  if (order.paymentKind === 1) {
    const provider =
      order.cardProvider === 1 ? 'Mastercard' : order.cardProvider === 2 ? 'PayPal' : 'Visa'
    return `${t('checkout.payment.card')} (${provider})`
  }
  return t('checkout.payment.cash')
}

function formatCustomPizzaLabel(
  preview: ReturnType<typeof previewFromIngredientIds>,
  t: (key: UiKey) => string,
): string {
  const parts = [preview.doughName, preview.sauceName, ...preview.toppingNames].filter(Boolean)
  if (parts.length === 0) return t('builder.custom')
  return parts.join(', ')
}

export function OrderDetailPage() {
  const { t, lang } = useLocale()
  const { isAuthenticated, isLoading: authLoading } = useAuthState()
  const { id: idParam } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as LocationState

  const orderId = idParam ? Number(idParam) : NaN
  const validId = Number.isFinite(orderId) && orderId > 0

  const [order, setOrder] = useState<Order | null>(
    state.order && state.order.id === orderId ? state.order : null,
  )
  const [products, setProducts] = useState<Map<number, Product>>(new Map())
  const [customPizzas, setCustomPizzas] = useState<CustomPizzaResolved[]>([])
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState('')
  const justPlaced = Boolean(state.justPlaced && state.order?.id === orderId)

  useEffect(() => {
    if (!validId) return
    if (order?.id === orderId) {
      setLoading(false)
      return
    }
    if (authLoading) return
    if (!isAuthenticated) {
      setLoading(false)
      setError('login')
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    getMyOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof PublicApiError && err.status === 404) {
          setError('not_found')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load order')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, order, orderId, validId])

  useEffect(() => {
    if (!order || order.items.length === 0) {
      setProducts(new Map())
      return
    }
    let cancelled = false
    const ids = order.items.map((i) => i.productId)
    fetchProductsByIds(ids)
      .then((map) => {
        if (!cancelled) setProducts(map)
      })
      .catch(() => {
        if (!cancelled) setProducts(new Map())
      })
    return () => {
      cancelled = true
    }
  }, [order])

  useEffect(() => {
    if (!order || order.customPizzaItems.length === 0) {
      setCustomPizzas([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const ingredients = await listIngredients()
        if (cancelled) return
        const byId = new Map(ingredients.map((i) => [i.id, i]))

        const resolved = await Promise.all(
          order.customPizzaItems.map(async (item) => {
            try {
              const pizza = await getCustomPizza(item.customPizzaId)
              const preview = previewFromIngredientIds(pizza.ingridientIds, byId)
              return {
                item,
                pizza,
                previewLabel: formatCustomPizzaLabel(preview, t),
              }
            } catch {
              return {
                item,
                pizza: {
                  id: item.customPizzaId,
                  totalPrice: 0,
                  ingridientIds: [],
                },
                previewLabel: `${t('builder.custom')} #${item.customPizzaId}`,
              }
            }
          }),
        )
        if (!cancelled) setCustomPizzas(resolved)
      } catch {
        if (!cancelled) setCustomPizzas([])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [order, t])

  const lineTotal = useMemo(() => {
    if (!order) return 0
    let total = 0
    for (const item of order.items) {
      const product = products.get(item.productId)
      if (product) total += product.price * item.quantity
    }
    for (const row of customPizzas) {
      total += row.pizza.totalPrice * row.item.quantity
    }
    return total
  }, [order, products, customPizzas])

  if (!validId) {
    return <Navigate to="/menu" replace />
  }

  if (!authLoading && !isAuthenticated && !order) {
    const next = encodeURIComponent(location.pathname)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  const dateLocale = lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB'

  return (
    <div className="order-detail section">
      <div className="order-detail__head">
        <button type="button" className="order-detail__back" onClick={() => navigate(-1)}>
          ← {t('order.detail.back')}
        </button>
        <h1 className="section-title">
          {t('account.orders.order')} #{orderId}
        </h1>
      </div>

      {justPlaced && (
        <div className="order-detail__success" role="status">
          <span className="order-detail__success-icon" aria-hidden>
            ✓
          </span>
          <div>
            <p className="order-detail__success-title">{t('order.success.title')}</p>
            <p className="order-detail__success-sub">{t('order.success.sub')}</p>
          </div>
        </div>
      )}

      {loading && <p className="order-detail__state">{t('order.detail.loading')}</p>}

      {!loading && error === 'not_found' && (
        <div className="order-detail__state">
          <p>{t('order.detail.notFound')}</p>
          <ButtonLink to="/account" variant="secondary">
            {t('order.success.account')}
          </ButtonLink>
        </div>
      )}

      {!loading && error && error !== 'not_found' && error !== 'login' && (
        <p className="order-detail__state order-detail__state--error">{error}</p>
      )}

      {!loading && order && (
        <div className="order-detail__grid">
          <section className="order-detail__card">
            <div className="order-detail__card-head">
              <h2>{t('order.detail.summary')}</h2>
              <span className={`order-detail__status ${STATUS_CLASS[order.status]}`}>
                {t(ORDER_STATUS_KEYS[order.status])}
              </span>
            </div>
            <dl className="order-detail__meta">
              <div>
                <dt>{t('account.orders.date')}</dt>
                <dd>
                  {new Date(order.createdAt).toLocaleString(dateLocale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </dd>
              </div>
              <div>
                <dt>{t('order.detail.payment')}</dt>
                <dd>{paymentLabel(order, t)}</dd>
              </div>
            </dl>
          </section>

          <section className="order-detail__card">
            <h2>{t('order.detail.delivery')}</h2>
            <dl className="order-detail__meta">
              <div>
                <dt>{t('checkout.form.firstName')}</dt>
                <dd>
                  {order.firstName} {order.lastName}
                </dd>
              </div>
              <div>
                <dt>{t('checkout.form.phone')}</dt>
                <dd>{order.phone}</dd>
              </div>
              <div>
                <dt>{t('checkout.form.email')}</dt>
                <dd>{order.email}</dd>
              </div>
              <div>
                <dt>{t('checkout.form.address')}</dt>
                <dd>
                  {order.district}, {order.address}
                </dd>
              </div>
              {order.note && (
                <div>
                  <dt>{t('checkout.form.notes')}</dt>
                  <dd>{order.note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="order-detail__card order-detail__card--wide">
            <h2>{t('order.detail.items')}</h2>
            <ul className="order-detail__items">
              {order.items.map((item) => {
                const product = products.get(item.productId)
                return (
                  <li key={`p-${item.productId}`} className="order-detail__item">
                    {product?.imageUrl ? (
                      <img
                        className="order-detail__item-img"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <div className="order-detail__item-img order-detail__item-img--placeholder" />
                    )}
                    <div className="order-detail__item-info">
                      <span className="order-detail__item-name">
                        {product?.name ?? `${t('order.detail.product')} #${item.productId}`}
                      </span>
                      <span className="order-detail__item-qty">× {item.quantity}</span>
                    </div>
                    {product && (
                      <span className="order-detail__item-price">
                        {formatPriceMdl(product.price * item.quantity)}
                      </span>
                    )}
                  </li>
                )
              })}
              {customPizzas.map((row) => (
                <li key={`c-${row.item.customPizzaId}`} className="order-detail__item">
                  <div className="order-detail__item-img order-detail__item-img--pizza" aria-hidden>
                    🍕
                  </div>
                  <div className="order-detail__item-info">
                    <span className="order-detail__item-name">{row.previewLabel}</span>
                    <span className="order-detail__item-qty">× {row.item.quantity}</span>
                  </div>
                  {row.pizza.totalPrice > 0 && (
                    <span className="order-detail__item-price">
                      {formatPriceMdl(row.pizza.totalPrice * row.item.quantity)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {lineTotal > 0 && (
              <div className="order-detail__total">
                <span>{t('account.orders.total')}</span>
                <strong>{formatPriceMdl(lineTotal)}</strong>
              </div>
            )}
          </section>
        </div>
      )}

      {!loading && order && (
        <div className="order-detail__actions">
          {isAuthenticated && (
            <ButtonLink to="/account" state={{ tab: 'orders' }} variant="secondary">
              {t('order.detail.allOrders')}
            </ButtonLink>
          )}
          <ButtonLink to="/menu" variant="primary">
            {t('order.success.back')}
          </ButtonLink>
        </div>
      )}
    </div>
  )
}

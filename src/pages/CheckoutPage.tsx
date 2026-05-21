import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPriceMdl, majorToMinor } from '../api/money'
import { createOrder } from '../api/public/order'
import { validatePromocode } from '../api/public/promocode'
import { PublicApiError } from '../api/public/http'
import { useCartActions, useCartTotals } from '../contexts/CartContext'
import { useAuthState } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import type { UiKey } from '../data/translations'
import { Button } from '../components/ui/Button'

/** Delivery fee in minor units (35 MDL). */
const DELIVERY_FEE_MINOR = majorToMinor(35)
const FREE_DELIVERY_THRESHOLD_MINOR = majorToMinor(500)

type PaymentMethod = 'cash' | 'card'
type CardType = 'Visa' | 'Mastercard' | 'PayPal'
type PromoStatus = 'idle' | 'valid' | 'invalid'

const CARD_TYPES: CardType[] = ['Visa', 'Mastercard', 'PayPal']

const PROMO_ERROR_KEYS: Record<string, UiKey> = {
  promocode_not_found: 'checkout.promo.notFound',
  promocode_inactive: 'checkout.promo.inactive',
  promocode_expired: 'checkout.promo.expired',
  promocode_already_used: 'checkout.promo.used',
}

function cardProviderValue(cardType: CardType): number {
  if (cardType === 'Mastercard') return 1
  if (cardType === 'PayPal') return 2
  return 0
}

export function CheckoutPage() {
  const { t } = useLocale()
  const { isAuthenticated } = useAuthState()
  const { lines, customLines, total } = useCartTotals()
  const { clear } = useCartActions()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [change, setChange] = useState('')
  const [cardType, setCardType] = useState<CardType>('Visa')
  const [agreed, setAgreed] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState<PromoStatus>('idle')
  const [promoPercent, setPromoPercent] = useState(0)
  const [promocodeId, setPromocodeId] = useState<number | null>(null)
  const [promoError, setPromoError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const isEmpty = lines.length === 0 && customLines.length === 0

  useEffect(() => {
    if (isEmpty) navigate('/menu', { replace: true })
  }, [isEmpty, navigate])

  async function applyPromo() {
    if (!isAuthenticated) return
    const code = promoCode.trim()
    if (!code) return
    setPromoError('')
    try {
      const promo = await validatePromocode(code)
      setPromoPercent(promo.percent)
      setPromocodeId(promo.id)
      setPromoStatus('valid')
    } catch (err) {
      setPromoPercent(0)
      setPromocodeId(null)
      setPromoStatus('invalid')
      const msg =
        err instanceof PublicApiError
          ? PROMO_ERROR_KEYS[err.message] ?? 'checkout.promo.invalid'
          : 'checkout.promo.invalid'
      setPromoError(t(msg))
    }
  }

  const discountAmount =
    promoStatus === 'valid' ? Math.round((total * promoPercent) / 100) : 0
  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD_MINOR ? 0 : DELIVERY_FEE_MINOR
  const grandTotal = total - discountAmount + deliveryFee

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const order = await createOrder({
        firstName,
        lastName,
        phone,
        email,
        district,
        address,
        note: note.trim() || null,
        promocodeId: isAuthenticated ? promocodeId : null,
        paymentKind: payment === 'cash' ? 0 : 1,
        cardProvider: payment === 'card' ? cardProviderValue(cardType) : null,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.qty })),
        customPizzaItems: customLines.map((cl) => ({
          customPizzaId: cl.customPizzaId,
          quantity: cl.qty,
        })),
      })
      clear()
      navigate('/order-success', { state: { orderId: order.id } })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  void change

  return (
    <div className="checkout-page section">
      <h1 className="checkout-page__title">{t('checkout.title')}</h1>
      <div className="checkout-page__inner">
        <form className="checkout-form" onSubmit={(e) => void handleSubmit(e)} noValidate>
          <div className="checkout-section">
            <h2 className="checkout-section__title">{t('checkout.form.title')}</h2>
            <div className="checkout-fields">
              <div className="checkout-fields__row">
                <label className="checkout-field">
                  <span className="checkout-field__label">{t('checkout.form.firstName')} *</span>
                  <input
                    className="checkout-field__input"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="checkout-field">
                  <span className="checkout-field__label">{t('checkout.form.lastName')} *</span>
                  <input
                    className="checkout-field__input"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
              <div className="checkout-fields__row">
                <label className="checkout-field">
                  <span className="checkout-field__label">{t('checkout.form.phone')} *</span>
                  <input
                    className="checkout-field__input"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="checkout-field">
                  <span className="checkout-field__label">{t('checkout.form.email')} *</span>
                  <input
                    className="checkout-field__input"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <label className="checkout-field">
                <span className="checkout-field__label">{t('checkout.form.district')} *</span>
                <input
                  className="checkout-field__input"
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </label>
              <label className="checkout-field">
                <span className="checkout-field__label">{t('checkout.form.address')} *</span>
                <input
                  className="checkout-field__input"
                  type="text"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
              <label className="checkout-field">
                <span className="checkout-field__label">{t('checkout.form.notes')}</span>
                <textarea
                  className="checkout-field__textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="checkout-section">
              <h2 className="checkout-section__title">{t('checkout.promo.label')}</h2>
              <div className="checkout-promo__row">
                <input
                  className="checkout-field__input checkout-promo__input"
                  type="text"
                  placeholder={t('checkout.promo.placeholder')}
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value)
                    setPromoStatus('idle')
                    setPromoError('')
                  }}
                  disabled={promoStatus === 'valid'}
                />
                <button
                  type="button"
                  className="btn btn--outline checkout-promo__btn"
                  onClick={() => void applyPromo()}
                  disabled={!promoCode.trim() || promoStatus === 'valid'}
                >
                  {t('checkout.promo.apply')}
                </button>
              </div>
              {promoStatus === 'valid' && (
                <p className="checkout-promo__msg checkout-promo__msg--valid">
                  {t('checkout.promo.applied')}
                </p>
              )}
              {promoStatus === 'invalid' && (
                <p className="checkout-promo__msg checkout-promo__msg--invalid">
                  {promoError || t('checkout.promo.invalid')}
                </p>
              )}
            </div>
          ) : (
            <p className="checkout-promo__hint">
              {t('checkout.promo.loginHint')}{' '}
              <Link to="/login?next=%2Fcheckout">{t('auth.login')}</Link>
            </p>
          )}

          <div className="checkout-section">
            <h2 className="checkout-section__title">{t('checkout.payment.title')}</h2>
            <div className="checkout-payment">
              <label className="checkout-payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={payment === 'cash'}
                  onChange={() => setPayment('cash')}
                />
                <span>{t('checkout.payment.cash')}</span>
              </label>
              <label className="checkout-payment__option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === 'card'}
                  onChange={() => setPayment('card')}
                />
                <span>{t('checkout.payment.card')}</span>
              </label>
            </div>

            {payment === 'cash' && (
              <div className="checkout-payment__sub">
                <label className="checkout-field">
                  <span className="checkout-field__label">{t('checkout.payment.change')}</span>
                  <input
                    className="checkout-field__input"
                    type="number"
                    min={0}
                    value={change}
                    onChange={(e) => setChange(e.target.value)}
                    placeholder="0"
                  />
                </label>
              </div>
            )}

            {payment === 'card' && (
              <div className="checkout-payment__sub">
                <span className="checkout-field__label">{t('checkout.payment.cardType')}</span>
                <div className="checkout-card-types">
                  {CARD_TYPES.map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      className={`checkout-card-type${cardType === ct ? ' checkout-card-type--active' : ''}`}
                      onClick={() => setCardType(ct)}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="checkout-terms">
            <input
              className="checkout-terms__checkbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="checkout-terms__text">{t('checkout.terms')}</span>
          </label>

          {submitError && <p className="checkout-form__error">{submitError}</p>}

          <Button variant="primary" className="checkout-submit" disabled={!agreed || submitting}>
            {submitting ? '...' : t('checkout.submit')}
          </Button>
        </form>

        <aside className="checkout-summary">
          <h2 className="checkout-section__title">{t('checkout.summary.title')}</h2>

          <ul className="checkout-summary__list">
            {lines.map((line) => (
              <li key={line.productId} className="checkout-summary__item">
                {line.snapshot.imageUrl && (
                  <img
                    className="checkout-summary__img"
                    src={line.snapshot.imageUrl}
                    alt={line.snapshot.name}
                  />
                )}
                <div className="checkout-summary__info">
                  <div className="checkout-summary__name">{line.snapshot.name}</div>
                  <div className="checkout-summary__qty">× {line.qty}</div>
                </div>
                <div className="checkout-summary__price">
                  {formatPriceMdl(line.snapshot.price * line.qty)}
                </div>
              </li>
            ))}
            {customLines.map((cl) => (
              <li key={cl.id} className="checkout-summary__item">
                <div className="checkout-summary__info">
                  <div className="checkout-summary__name">{cl.label}</div>
                  <div className="checkout-summary__qty">× {cl.qty}</div>
                </div>
                <div className="checkout-summary__price">{formatPriceMdl(cl.price * cl.qty)}</div>
              </li>
            ))}
          </ul>

          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>{t('checkout.summary.subtotal')}</span>
              <span>{formatPriceMdl(total)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <span>{t('checkout.summary.discount')}</span>
                <span>−{formatPriceMdl(discountAmount)}</span>
              </div>
            )}
            <div className="checkout-summary__row">
              <span>{t('checkout.summary.delivery')}</span>
              <span className={deliveryFee === 0 ? 'checkout-summary__free' : ''}>
                {deliveryFee === 0
                  ? t('checkout.summary.deliveryFree')
                  : formatPriceMdl(deliveryFee)}
              </span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>{t('checkout.summary.total')}</span>
              <strong>{formatPriceMdl(grandTotal)}</strong>
            </div>
          </div>

          {total < FREE_DELIVERY_THRESHOLD_MINOR && (
            <p className="checkout-summary__note">{t('checkout.deliveryNote')}</p>
          )}
        </aside>
      </div>
    </div>
  )
}

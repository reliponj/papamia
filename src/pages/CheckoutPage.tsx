import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductById } from '../data/menu'
import { useCartActions, useCartTotals } from '../contexts/CartContext'
import { useLocale } from '../contexts/LocaleContext'
import { Button } from '../components/ui/Button'

const DELIVERY_FEE = 35
const FREE_DELIVERY_THRESHOLD = 500
const PROMO_CODES: Record<string, number> = { PAPA10: 0.1, PAPA20: 0.2 }

type PaymentMethod = 'cash' | 'card'
type CardType = 'Visa' | 'Mastercard' | 'Maestro' | 'UnionPay'
type PromoStatus = 'idle' | 'valid' | 'invalid'

const CARD_TYPES: CardType[] = ['Visa', 'Mastercard', 'Maestro', 'UnionPay']

export function CheckoutPage() {
  const { t, lang } = useLocale()
  const { lines, customLines, total } = useCartTotals()
  const { clear } = useCartActions()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [change, setChange] = useState('')
  const [cardType, setCardType] = useState<CardType>('Visa')
  const [agreed, setAgreed] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState<PromoStatus>('idle')
  const [promoDiscount, setPromoDiscount] = useState(0)

  const isEmpty = lines.length === 0 && customLines.length === 0

  useEffect(() => {
    if (isEmpty) navigate('/menu', { replace: true })
  }, [isEmpty, navigate])

  function applyPromo() {
    const code = promoCode.trim().toUpperCase()
    const disc = PROMO_CODES[code]
    if (disc) {
      setPromoDiscount(disc)
      setPromoStatus('valid')
    } else {
      setPromoDiscount(0)
      setPromoStatus('invalid')
    }
  }

  const discountAmount = total * promoDiscount
  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const grandTotal = total - discountAmount + deliveryFee

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clear()
    navigate('/order-success')
  }

  return (
    <div className="checkout-page section">
      <h1 className="checkout-page__title">{t('checkout.title')}</h1>
      <div className="checkout-page__inner">

        {/* ── LEFT: Delivery & payment form ── */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          </div>

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
                }}
                disabled={promoStatus === 'valid'}
              />
              <button
                type="button"
                className="btn btn--outline checkout-promo__btn"
                onClick={applyPromo}
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
                {t('checkout.promo.invalid')}
              </p>
            )}
          </div>

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

          <Button variant="primary" className="checkout-submit" disabled={!agreed}>
            {t('checkout.submit')}
          </Button>
        </form>

        {/* ── RIGHT: Order summary ── */}
        <aside className="checkout-summary">
          <h2 className="checkout-section__title">{t('checkout.summary.title')}</h2>

          <ul className="checkout-summary__list">
            {lines.map((line) => {
              const p = getProductById(line.productId)
              if (!p) return null
              return (
                <li key={line.productId} className="checkout-summary__item">
                  {p.image && (
                    <img
                      className="checkout-summary__img"
                      src={p.image}
                      alt={p.name[lang]}
                    />
                  )}
                  <div className="checkout-summary__info">
                    <div className="checkout-summary__name">{p.name[lang]}</div>
                    <div className="checkout-summary__qty">× {line.qty}</div>
                  </div>
                  <div className="checkout-summary__price">
                    {(p.price * line.qty).toFixed(2)} {t('menu.currency')}
                  </div>
                </li>
              )
            })}
            {customLines.map((cl) => (
              <li key={cl.id} className="checkout-summary__item">
                <div className="checkout-summary__info">
                  <div className="checkout-summary__name">{cl.label}</div>
                  <div className="checkout-summary__qty">× {cl.qty}</div>
                </div>
                <div className="checkout-summary__price">
                  {(cl.price * cl.qty).toFixed(2)} {t('menu.currency')}
                </div>
              </li>
            ))}
          </ul>

          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>{t('checkout.summary.subtotal')}</span>
              <span>
                {total.toFixed(2)} {t('menu.currency')}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <span>{t('checkout.summary.discount')}</span>
                <span>−{discountAmount.toFixed(2)} {t('menu.currency')}</span>
              </div>
            )}
            <div className="checkout-summary__row">
              <span>{t('checkout.summary.delivery')}</span>
              <span className={deliveryFee === 0 ? 'checkout-summary__free' : ''}>
                {deliveryFee === 0
                  ? t('checkout.summary.deliveryFree')
                  : `${deliveryFee} ${t('menu.currency')}`}
              </span>
            </div>
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>{t('checkout.summary.total')}</span>
              <strong>
                {grandTotal.toFixed(2)} {t('menu.currency')}
              </strong>
            </div>
          </div>

          {total < FREE_DELIVERY_THRESHOLD && (
            <p className="checkout-summary__note">{t('checkout.deliveryNote')}</p>
          )}
        </aside>
      </div>
    </div>
  )
}

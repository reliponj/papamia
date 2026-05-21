import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPriceMdl } from '../../api/money'
import { useCartActions, useCartState, useCartTotals } from '../../contexts/CartContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Button } from '../ui/Button'

export function CartDrawer() {
  const { isDrawerOpen: open } = useCartState()
  const { lines, customLines, total } = useCartTotals()
  const { setQty, closeDrawer, removeLine, removeCustomLine } = useCartActions()
  const navigate = useNavigate()
  const { t } = useLocale()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeDrawer])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const isEmpty = lines.length === 0 && customLines.length === 0

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button
        type="button"
        className="cart-drawer__backdrop"
        aria-label={t('aria.closeCart')}
        onClick={closeDrawer}
      />
      <div className="cart-drawer__panel">
        <header className="cart-drawer__head">
          <h2 id="cart-title">{t('cart.title')}</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
            aria-label={t('aria.closeCart')}
          >
            ×
          </button>
        </header>

        {isEmpty ? (
          <p className="cart-drawer__empty">{t('cart.empty')}</p>
        ) : (
          <ul className="cart-drawer__list">
            {lines.map((line) => (
              <li key={line.productId} className="cart-line">
                {line.snapshot.imageUrl && (
                  <img
                    className="cart-line__img"
                    src={line.snapshot.imageUrl}
                    alt={line.snapshot.name}
                  />
                )}
                <div className="cart-line__info">
                  <div className="cart-line__name">{line.snapshot.name}</div>
                  <div className="cart-line__meta">{formatPriceMdl(line.snapshot.price)}</div>
                </div>
                <div className="cart-line__controls">
                  <button
                    type="button"
                    className="cart-line__step"
                    aria-label="Decrease"
                    onClick={() => setQty(line.productId, line.qty - 1)}
                  >
                    −
                  </button>
                  <span className="cart-line__count">{line.qty}</span>
                  <button
                    type="button"
                    className="cart-line__step"
                    aria-label="Increase"
                    onClick={() => setQty(line.productId, line.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="cart-line__remove"
                    onClick={() => removeLine(line.productId)}
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </li>
            ))}

            {customLines.map((cl) => (
              <li key={cl.id} className="cart-line cart-line--custom">
                <div className="cart-line__info">
                  <div className="cart-line__name">{cl.label}</div>
                  <div className="cart-line__meta cart-line__meta--custom">{t('builder.custom')}</div>
                  <div className="cart-line__meta">
                    {formatPriceMdl(cl.price)} × {cl.qty}
                  </div>
                </div>
                <div className="cart-line__controls">
                  <button
                    type="button"
                    className="cart-line__remove"
                    onClick={() => removeCustomLine(cl.id)}
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="cart-drawer__foot">
          <div className="cart-drawer__total">
            <span>{t('cart.total')}</span>
            <strong>{formatPriceMdl(total)}</strong>
          </div>
          <Button
            variant="primary"
            className="cart-drawer__checkout"
            disabled={isEmpty}
            onClick={() => {
              closeDrawer()
              navigate('/checkout')
            }}
          >
            {t('cart.checkout')}
          </Button>
          <button type="button" className="cart-drawer__link" onClick={closeDrawer}>
            {t('cart.continue')}
          </button>
        </footer>
      </div>
    </div>
  )
}

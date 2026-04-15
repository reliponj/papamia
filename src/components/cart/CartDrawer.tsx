import { useEffect } from 'react'
import { getProductById } from '../../data/menu'
import { useCartActions, useCartState, useCartTotals } from '../../contexts/CartContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Button } from '../ui/Button'

export function CartDrawer() {
  const { isDrawerOpen: open } = useCartState()
  const { lines, total } = useCartTotals()
  const { setQty, closeDrawer, removeLine } = useCartActions()
  const { lang, t } = useLocale()

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
        {lines.length === 0 ? (
          <p className="cart-drawer__empty">{t('cart.empty')}</p>
        ) : (
          <ul className="cart-drawer__list">
            {lines.map((line) => {
              const p = getProductById(line.productId)
              if (!p) return null
              return (
                <li key={line.productId} className="cart-line">
                  <div>
                    <div className="cart-line__name">{p.name[lang]}</div>
                    <div className="cart-line__meta">
                      {p.price} {t('menu.currency')} × {line.qty}
                    </div>
                  </div>
                  <div className="cart-line__controls">
                    <input
                      className="cart-line__qty"
                      type="number"
                      min={0}
                      value={line.qty}
                      aria-label="Quantity"
                      onChange={(e) =>
                        setQty(line.productId, Number.parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <button
                      type="button"
                      className="cart-line__remove"
                      onClick={() => removeLine(line.productId)}
                    >
                      {t('cart.remove')}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <footer className="cart-drawer__foot">
          <div className="cart-drawer__total">
            <span>{t('cart.total')}</span>
            <strong>
              {total.toFixed(2)} {t('menu.currency')}
            </strong>
          </div>
          <Button
            variant="primary"
            className="cart-drawer__checkout"
            disabled={lines.length === 0}
            onClick={() => {
              window.alert('Checkout demo — connect your payment backend here.')
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

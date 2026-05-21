import { Trash2 } from 'lucide-react'
import { formatPriceMdl } from '../../api/money'
import type { CustomPizzaPreview } from '../../types'
import { useLocale } from '../../contexts/LocaleContext'
import { PizzaPreview } from './PizzaPreview'

type Props = {
  preview: CustomPizzaPreview
  price: number
  qty?: number
  onSetQty?: (qty: number) => void
  onRemove?: () => void
  variant?: 'drawer' | 'checkout'
}

function toPreviewIngredients(preview: CustomPizzaPreview) {
  return {
    dough: { id: 0, name: preview.doughName },
    sauce: { id: 0, name: preview.sauceName },
    toppings: preview.toppingNames.map((name, id) => ({ id, name })),
  }
}

export function CustomPizzaCartItem({
  preview,
  price,
  qty = 1,
  onSetQty,
  onRemove,
  variant = 'drawer',
}: Props) {
  const { t } = useLocale()
  const { dough, sauce, toppings } = toPreviewIngredients(preview)
  const lineTotal = price * qty

  if (variant === 'checkout') {
    return (
      <>
        <div className="custom-pizza-cart__thumb custom-pizza-cart__thumb--checkout">
          <PizzaPreview dough={dough} sauce={sauce} toppings={toppings} compact />
        </div>
        <div className="checkout-summary__info">
          <div className="checkout-summary__name">{t('builder.custom')}</div>
          <div className="checkout-summary__qty">× {qty}</div>
        </div>
        <div className="checkout-summary__price">{formatPriceMdl(lineTotal)}</div>
      </>
    )
  }

  return (
    <li className="cart-line cart-line--custom">
      <div className="custom-pizza-cart__thumb">
        <PizzaPreview dough={dough} sauce={sauce} toppings={toppings} compact />
      </div>
      <div className="cart-line__info">
        <div className="cart-line__name">{t('builder.custom')}</div>
        <div className="cart-line__meta">{formatPriceMdl(price)}</div>
      </div>
      <div className="cart-line__controls">
        {onSetQty && (
          <>
            <button
              type="button"
              className="cart-line__step"
              aria-label="Decrease"
              onClick={() => onSetQty(qty - 1)}
            >
              −
            </button>
            <span className="cart-line__count">{qty}</span>
            <button
              type="button"
              className="cart-line__step"
              aria-label="Increase"
              onClick={() => onSetQty(qty + 1)}
            >
              +
            </button>
          </>
        )}
        {onRemove && (
          <button
            type="button"
            className="cart-line__remove"
            aria-label={t('cart.remove')}
            onClick={onRemove}
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
    </li>
  )
}

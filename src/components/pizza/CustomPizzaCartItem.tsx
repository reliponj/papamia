import { formatPriceMdl } from '../../api/money'
import type { CustomPizzaPreview } from '../../types'
import { useLocale } from '../../contexts/LocaleContext'
import { PizzaPreview } from './PizzaPreview'

type Props = {
  preview: CustomPizzaPreview
  price: number
  qty?: number
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

export function CustomPizzaCartItem({ preview, price, qty = 1, onRemove, variant = 'drawer' }: Props) {
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
          {qty > 1 && <div className="checkout-summary__qty">× {qty}</div>}
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
        <div className="cart-line__meta">{formatPriceMdl(lineTotal)}</div>
      </div>
      {onRemove && (
        <div className="cart-line__controls">
          <button type="button" className="cart-line__remove" onClick={onRemove}>
            {t('cart.remove')}
          </button>
        </div>
      )}
    </li>
  )
}

import type { MenuProduct } from '../../types'
import { useCartActions, useCartTotals } from '../../contexts/CartContext'
import { useFavoritesApi } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Button } from '../ui/Button'

type Props = {
  product: MenuProduct
}

export function ProductCard({ product }: Props) {
  const { lang, t } = useLocale()
  const { add, setQty } = useCartActions()
  const { toggle, has } = useFavoritesApi()
  const { lines } = useCartTotals()
  const isFav = has(product.id)
  const line = lines.find((l) => l.productId === product.id)
  const qty = line?.qty ?? 0

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={product.image} alt="" loading="lazy" decoding="async" />
        <button
          type="button"
          className={`product-card__heart${isFav ? ' is-active' : ''}`}
          aria-pressed={isFav}
          aria-label={t('favorites.title')}
          onClick={() => toggle(product.id)}
        >
          <span aria-hidden>♥</span>
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name[lang]}</h3>
        <p className="product-card__desc">{product.description[lang]}</p>
        <div className="product-card__row">
          <span className="product-card__price">
            {product.price} {t('menu.currency')}
          </span>
          {qty === 0 ? (
            <Button variant="primary" onClick={() => add(product.id)}>
              {t('menu.add')}
            </Button>
          ) : (
            <div className="qty-control">
              <button
                type="button"
                className="qty-control__step"
                aria-label="Decrease"
                onClick={() => setQty(product.id, qty - 1)}
              >
                −
              </button>
              <span className="qty-control__count">{qty}</span>
              <button
                type="button"
                className="qty-control__step"
                aria-label="Increase"
                onClick={() => setQty(product.id, qty + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

import { useState } from 'react'
import type { Product } from '../../api/public/types'
import { formatPriceMdl } from '../../api/money'
import { PublicApiError } from '../../api/public/http'
import { useCartActions, useCartTotals } from '../../contexts/CartContext'
import { useFavoritesApi } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Button } from '../ui/Button'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { t } = useLocale()
  const { add, setQty } = useCartActions()
  const { toggle, has } = useFavoritesApi()
  const { lines } = useCartTotals()
  const [favBusy, setFavBusy] = useState(false)
  const isFav = has(product.id)
  const line = lines.find((l) => l.productId === product.id)
  const qty = line?.qty ?? 0

  const snapshot = {
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={product.imageUrl} alt="" loading="lazy" decoding="async" />
        <button
          type="button"
          className={`product-card__heart${isFav ? ' is-active' : ''}`}
          aria-pressed={isFav}
          aria-label={t('favorites.title')}
          disabled={favBusy}
          onClick={() => {
            setFavBusy(true)
            void toggle(product.id, snapshot)
              .catch((err) => {
                if (err instanceof PublicApiError && err.message === 'product_not_found') {
                  window.alert(t('favorites.error.notFound'))
                }
              })
              .finally(() => setFavBusy(false))
          }}
        >
          <span aria-hidden>♥</span>
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__row">
          <span className="product-card__price">{formatPriceMdl(product.price)}</span>
          {qty === 0 ? (
            <Button variant="primary" onClick={() => add(product.id, snapshot)}>
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

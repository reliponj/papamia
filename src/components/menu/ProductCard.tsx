import type { MenuProduct } from '../../types'
import { useCartActions } from '../../contexts/CartContext'
import { useFavoritesApi } from '../../contexts/FavoritesContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Button } from '../ui/Button'

type Props = {
  product: MenuProduct
}

export function ProductCard({ product }: Props) {
  const { lang, t } = useLocale()
  const { add } = useCartActions()
  const { toggle, has } = useFavoritesApi()
  const isFav = has(product.id)

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
          <Button variant="primary" onClick={() => add(product.id)}>
            {t('menu.add')}
          </Button>
        </div>
      </div>
    </article>
  )
}

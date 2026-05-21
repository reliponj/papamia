import { useLocale } from '../../contexts/LocaleContext'
import { useFavoriteProducts, useFavoritesApi } from '../../contexts/FavoritesContext'
import { useCartActions } from '../../contexts/CartContext'
import { formatPriceMdl } from '../../api/money'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'

export function FavoritesList() {
  const { t } = useLocale()
  const favorites = useFavoriteProducts()
  const { toggle } = useFavoritesApi()
  const { add, openDrawer } = useCartActions()

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <p>{t('favorites.empty')}</p>
        <Link to="/menu" className="btn btn--primary">
          {t('favorites.browseMenu')}
        </Link>
      </div>
    )
  }

  return (
    <ul className="favorites-grid">
      {favorites.map(({ productId, snapshot }) => (
        <li key={productId} className="favorites-card">
          <img src={snapshot.imageUrl} alt={snapshot.name} className="favorites-card__img" />
          <div className="favorites-card__body">
            <p className="favorites-card__name">{snapshot.name}</p>
            <p className="favorites-card__price">{formatPriceMdl(snapshot.price)}</p>
          </div>
          <div className="favorites-card__actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                add(productId, snapshot)
                openDrawer()
              }}
            >
              {t('menu.add')}
            </Button>
            <Button
              variant="icon"
              size="sm"
              aria-label={t('favorites.remove')}
              className="favorites-card__remove-btn"
              onClick={() => toggle(productId, snapshot)}
            >
              ♥
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

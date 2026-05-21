import { Link } from 'react-router-dom'
import { FavoritesList } from '../components/favorites/FavoritesList'
import { useLocale } from '../contexts/LocaleContext'
import { useFavoriteProducts } from '../contexts/FavoritesContext'

export function FavoritesPage() {
  const { t } = useLocale()
  const favorites = useFavoriteProducts()

  return (
    <div className="favorites-page section">
      <header className="section-head favorites-page__head">
        <h1 className="section-title">{t('favorites.title')}</h1>
        {favorites.length > 0 && (
          <p className="section-sub">
            {favorites.length}{' '}
            {favorites.length === 1 ? t('favorites.itemOne') : t('favorites.itemMany')}
          </p>
        )}
      </header>
      <FavoritesList />
      {favorites.length > 0 && (
        <div className="favorites-page__footer">
          <Link to="/menu" className="btn btn--secondary">
            {t('favorites.browseMenu')} →
          </Link>
        </div>
      )}
    </div>
  )
}

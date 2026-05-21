import { useLocale } from '../../contexts/LocaleContext'
import { useFavoriteProducts, useFavoritesLoading } from '../../contexts/FavoritesContext'
import { ProductCard } from '../menu/ProductCard'
import { ButtonLink } from '../ui/Button'

export function FavoritesList() {
  const { t } = useLocale()
  const favorites = useFavoriteProducts()
  const loading = useFavoritesLoading()

  if (loading) {
    return <p className="favorites-empty">...</p>
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <p>{t('favorites.empty')}</p>
        <ButtonLink to="/menu" variant="primary">
          {t('favorites.browseMenu')}
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="menu-page__grid favorites-page__grid">
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

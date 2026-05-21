import type { Product } from '../../api/public/types'
import { useLocale } from '../../contexts/LocaleContext'
import { useFavoriteProducts } from '../../contexts/FavoritesContext'
import { ProductCard } from '../menu/ProductCard'
import { ButtonLink } from '../ui/Button'

function toProduct(productId: number, snapshot: { name: string; price: number; imageUrl: string }): Product {
  return {
    id: productId,
    name: snapshot.name,
    description: '',
    price: snapshot.price,
    imageUrl: snapshot.imageUrl,
    weight: 0,
    weightType: 'g',
    allergens: '',
    isActive: true,
    categoryId: 0,
  }
}

export function FavoritesList() {
  const { t } = useLocale()
  const favorites = useFavoriteProducts()

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
      {favorites.map(({ productId, snapshot }) => (
        <ProductCard key={productId} product={toProduct(productId, snapshot)} />
      ))}
    </div>
  )
}

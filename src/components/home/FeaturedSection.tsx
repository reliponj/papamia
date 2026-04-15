import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../../data/menu'
import { useLocale } from '../../contexts/LocaleContext'
import { ProductCard } from '../menu/ProductCard'

export function FeaturedSection() {
  const { t } = useLocale()
  const items = getFeaturedProducts()
  return (
    <section className="featured section">
      <header className="section-head">
        <h2 className="section-title">{t('featured.title')}</h2>
        <p className="section-sub">{t('featured.sub')}</p>
      </header>
      <div className="featured__grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="featured__more">
        <Link to="/menu" className="text-link">
          {t('featured.order')} →
        </Link>
      </div>
    </section>
  )
}

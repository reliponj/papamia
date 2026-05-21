import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCategories } from '../../api/public/category'
import { listProductsByCategory } from '../../api/public/product'
import type { Product } from '../../api/public/types'
import { ProductCard } from '../menu/ProductCard'
import { useLocale } from '../../contexts/LocaleContext'

export function FeaturedSection() {
  const { t } = useLocale()
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    listCategories()
      .then((cats) => {
        const first = cats[0]
        if (!first) return []
        return listProductsByCategory(first.id)
      })
      .then((products) => {
        if (!cancelled) setItems(products.slice(0, 6))
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0) return null

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
        <Link to="/menu" className="btn btn--outline">
          {t('featured.menu')} →
        </Link>
      </div>
    </section>
  )
}

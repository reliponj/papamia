import { useMemo, useState } from 'react'
import { MENU_PRODUCTS } from '../data/menu'
import { useLocale } from '../contexts/LocaleContext'
import type { MenuCategory } from '../types'
import { CategoryTabs } from '../components/menu/CategoryTabs'
import { ProductCard } from '../components/menu/ProductCard'

export function MenuPage() {
  const { t } = useLocale()
  const [cat, setCat] = useState<MenuCategory>('pizza')

  const list = useMemo(() => MENU_PRODUCTS.filter((p) => p.category === cat), [cat])

  return (
    <div className="menu-page section">
      <header className="section-head menu-page__head">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-sub">{t('menu.sub')}</p>
      </header>
      <CategoryTabs active={cat} onChange={setCat} />
      <div className="menu-page__grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

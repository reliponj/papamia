import { Link } from 'react-router-dom'
import { useLocale } from '../../contexts/LocaleContext'

const ITEMS = [
  {
    key: 'pizza' as const,
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80',
  },
  {
    key: 'pasta' as const,
    img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900&q=80',
  },
  {
    key: 'starters' as const,
    img: 'https://images.unsplash.com/photo-1572695157199-bea00591eaa0?w=900&q=80',
  },
  {
    key: 'bar' as const,
    img: 'https://images.unsplash.com/photo-1560512820-29e2ae1dd490?w=900&q=80',
  },
]

export function PromoGrid() {
  const { t } = useLocale()
  const copy: Record<(typeof ITEMS)[number]['key'], { title: string; text: string; cta: string }> =
    {
      pizza: {
        title: t('promo.pizza.title'),
        text: t('promo.pizza.text'),
        cta: t('promo.pizza.cta'),
      },
      pasta: {
        title: t('promo.pasta.title'),
        text: t('promo.pasta.text'),
        cta: t('promo.pasta.cta'),
      },
      starters: {
        title: t('promo.starters.title'),
        text: t('promo.starters.text'),
        cta: t('promo.starters.cta'),
      },
      bar: {
        title: t('promo.bar.title'),
        text: t('promo.bar.text'),
        cta: t('promo.bar.cta'),
      },
    }

  return (
    <section className="promo-grid section">
      <div className="promo-grid__list">
        {ITEMS.map((item) => (
          <article key={item.key} className="promo-card">
            <div className="promo-card__media">
              <img src={item.img} alt="" loading="lazy" />
            </div>
            <div className="promo-card__body">
              <h2 className="promo-card__title">{copy[item.key].title}</h2>
              <p className="promo-card__text">{copy[item.key].text}</p>
              <Link to="/menu" className="promo-card__link">
                {copy[item.key].cta} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

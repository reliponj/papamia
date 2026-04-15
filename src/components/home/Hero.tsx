import { Link } from 'react-router-dom'
import { useLocale } from '../../contexts/LocaleContext'

export function Hero() {
  const { t } = useLocale()
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden />
      <div className="hero__content">
        <p className="hero__eyebrow">{t('hero.welcome')}</p>
        <h1 className="hero__title">{t('hero.title')}</h1>
        <p className="hero__sub">{t('hero.sub')}</p>
        <div className="hero__actions">
          <Link to="/menu" className="btn btn--primary">
            {t('hero.menuCta')}
          </Link>
          <Link to="/menu" className="btn btn--outline">
            {t('hero.orderCta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

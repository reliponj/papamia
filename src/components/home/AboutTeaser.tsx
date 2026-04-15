import { Link } from 'react-router-dom'
import { useLocale } from '../../contexts/LocaleContext'

export function AboutTeaser() {
  const { t } = useLocale()
  return (
    <section className="about-teaser section">
      <div className="about-teaser__inner">
        <div>
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="about-teaser__text">{t('about.text')}</p>
          <div className="about-teaser__actions">
            <Link to="/contacts" className="btn btn--primary">
              {t('about.reserve')}
            </Link>
            <Link to="/contacts" className="btn btn--ghost">
              {t('about.contact')}
            </Link>
          </div>
        </div>
        <div className="about-teaser__visual" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80"
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

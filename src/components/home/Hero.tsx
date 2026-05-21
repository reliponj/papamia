import { ButtonLink } from '../ui/Button'
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
          <ButtonLink to="/menu" variant="primary">
            {t('hero.menuCta')}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

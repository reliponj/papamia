import { useLocale } from '../contexts/LocaleContext'
import { ButtonLink } from '../components/ui/Button'

export function NotFoundPage() {
  const { t } = useLocale()

  return (
    <div className="not-found section">
      <div className="not-found__inner">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found__title">{t('notFound.title')}</h1>
        <p className="not-found__sub">{t('notFound.sub')}</p>
        <ButtonLink to="/" variant="primary" className="not-found__btn">
          {t('notFound.home')}
        </ButtonLink>
      </div>
    </div>
  )
}

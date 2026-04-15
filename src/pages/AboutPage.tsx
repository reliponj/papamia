import { useLocale } from '../contexts/LocaleContext'

export function AboutPage() {
  const { t } = useLocale()
  return (
    <article className="static-page section">
      <h1 className="section-title">{t('about.page.title')}</h1>
      <p className="static-page__lead">{t('about.page.p1')}</p>
      <p>{t('about.page.p2')}</p>
      <blockquote className="static-page__quote">{t('about.page.chef')}</blockquote>
    </article>
  )
}

import { useLocale } from '../contexts/LocaleContext'
import type { UiKey } from '../data/translations'

const SECTIONS = ['s1', 's2', 's3', 's4', 's5'] as const

function privacyKey(section: (typeof SECTIONS)[number], field: 'title' | 'text'): UiKey {
  return `legal.privacy.${section}.${field}` as UiKey
}
export function PrivacyPage() {
  const { t } = useLocale()

  return (
    <article className="legal-page section">
      <header className="legal-page__head">
        <h1 className="section-title">{t('legal.privacy.title')}</h1>
        <p className="section-sub">{t('legal.privacy.updated')}</p>
      </header>
      <div className="legal-page__body">
        <p className="legal-page__intro">{t('legal.privacy.intro')}</p>
        {SECTIONS.map((id) => (
          <section key={id} className="legal-page__section">
            <h2>{t(privacyKey(id, 'title'))}</h2>
            <p>{t(privacyKey(id, 'text'))}</p>
          </section>
        ))}
      </div>
    </article>
  )
}

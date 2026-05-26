import { useLocale } from '../contexts/LocaleContext'
import type { UiKey } from '../data/translations'

const SECTIONS = ['s1', 's2', 's3', 's4', 's5'] as const

function termsKey(section: (typeof SECTIONS)[number], field: 'title' | 'text'): UiKey {
  return `legal.terms.${section}.${field}` as UiKey
}
export function TermsPage() {
  const { t } = useLocale()

  return (
    <article className="legal-page section">
      <header className="legal-page__head">
        <h1 className="section-title">{t('legal.terms.title')}</h1>
        <p className="section-sub">{t('legal.terms.updated')}</p>
      </header>
      <div className="legal-page__body">
        <p className="legal-page__intro">{t('legal.terms.intro')}</p>
        {SECTIONS.map((id) => (
          <section key={id} className="legal-page__section">
            <h2>{t(termsKey(id, 'title'))}</h2>
            <p>{t(termsKey(id, 'text'))}</p>
          </section>
        ))}
      </div>
    </article>
  )
}

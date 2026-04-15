import type { FormEvent } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { Button } from '../components/ui/Button'

export function ContactsPage() {
  const { t } = useLocale()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    window.alert('Form demo — wire to your backend or form service.')
  }

  return (
    <article className="static-page section contacts-page">
      <h1 className="section-title">{t('contacts.title')}</h1>
      <div className="contacts-page__grid">
        <div>
          <p>
            <strong>{t('contacts.address')}</strong>
          </p>
          <p>{t('contacts.phone')}</p>
          <p>{t('contacts.email')}</p>
        </div>
        <form className="contacts-page__form" onSubmit={onSubmit}>
          <label className="field">
            <span>{t('contacts.form.name')}</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea name="message" rows={4} required />
          </label>
          <Button variant="primary" type="submit">
            {t('contacts.form.send')}
          </Button>
        </form>
      </div>
    </article>
  )
}

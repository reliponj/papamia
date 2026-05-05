import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.alert('Auth demo — connect your backend here.')
  }

  return (
    <div className="auth-page section">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('auth.login.title')}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">
            {t('auth.email')}
            <input
              className="auth-form__input"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="auth-form__label">
            {t('auth.password')}
            <input
              className="auth-form__input"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <Button variant="primary" className="auth-form__submit">
            {t('auth.login.submit')}
          </Button>
        </form>
        <p className="auth-card__footer">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="auth-card__link">
            {t('auth.login.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}

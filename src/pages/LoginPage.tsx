import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { useAuthApi } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { PasswordInput } from '../components/ui/PasswordInput'

export function LoginPage() {
  const { t } = useLocale()
  const { login } = useAuthApi()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextPath = searchParams.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const target =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/account'
      navigate(target)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
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
            <PasswordInput
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="auth-form__error">{error}</p>}
          <Button type="submit" variant="primary" className="auth-form__submit" disabled={loading}>
            {loading ? '...' : t('auth.login.submit')}
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

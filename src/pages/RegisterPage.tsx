import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { useAuthApi } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { PasswordInput } from '../components/ui/PasswordInput'

export function RegisterPage() {
  const { t } = useLocale()
  const { register } = useAuthApi()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError(t('auth.register.mismatch'))
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page section">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('auth.register.title')}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">
            {t('auth.username')}
            <input
              className="auth-form__input"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
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
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" required />
          </label>
          <label className="auth-form__label">
            {t('auth.register.confirm')}
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" required />
          </label>
          {error && <p className="auth-form__error">{error}</p>}
          <Button type="submit" variant="primary" className="auth-form__submit" disabled={loading}>
            {loading ? '...' : t('auth.register.submit')}
          </Button>
        </form>
        <p className="auth-card__footer">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="auth-card__link">
            {t('auth.register.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}

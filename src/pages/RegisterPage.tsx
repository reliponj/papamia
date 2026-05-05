import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { useAuthApi } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

function PasswordInput({
  value,
  onChange,
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="auth-form__password-wrap">
      <input
        className="auth-form__input"
        type={visible ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="auth-form__eye"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}

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

  async function handleSubmit(e: React.FormEvent) {
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
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
          </label>
          <label className="auth-form__label">
            {t('auth.register.confirm')}
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" />
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

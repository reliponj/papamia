import { Link } from 'react-router-dom'
import { useAuthApi } from '../../contexts/AuthContext'

export function AdminForbiddenPage() {
  const { logout } = useAuthApi()

  return (
    <div className="admin-guard admin-guard--forbidden">
      <section className="crm-section" style={{ maxWidth: 480, margin: '4rem auto' }}>
        <h2>Access denied</h2>
        <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1.25rem' }}>
          Admin panel requires an account with the <strong>admin</strong> or <strong>moderator</strong>{' '}
          role. Sign in with a different account or return to the storefront.
        </p>
        <div className="crm-form__actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn--primary">
            Home
          </Link>
          <button type="button" className="btn btn--ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}

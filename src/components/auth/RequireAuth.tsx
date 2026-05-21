import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthState } from '../../contexts/AuthContext'

type Props = {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuthState()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="auth-guard">
        <p className="auth-guard__text">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return children
}

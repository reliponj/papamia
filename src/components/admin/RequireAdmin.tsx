import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthState } from '../../contexts/AuthContext'
import {
  fetchUserRoles,
  hasAdminPanelAccess,
  isForbiddenError,
} from '../../api/admin/access'
import { parseId } from '../../api/admin/http'
import { AdminForbiddenPage } from '../../pages/admin/AdminForbiddenPage'

type Props = {
  children: ReactNode
}

export function RequireAdmin({ children }: Props) {
  const { isAuthenticated, isLoading, user } = useAuthState()
  const location = useLocation()
  const [accessState, setAccessState] = useState<'pending' | 'allowed' | 'forbidden'>('pending')

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      setAccessState('pending')
      return
    }

    const userId = parseId(user.id)
    if (userId === null) {
      setAccessState('forbidden')
      return
    }

    let cancelled = false
    setAccessState('pending')

    fetchUserRoles(userId)
      .then((roles) => {
        if (cancelled) return
        setAccessState(hasAdminPanelAccess(roles) ? 'allowed' : 'forbidden')
      })
      .catch((err) => {
        if (cancelled) return
        if (isForbiddenError(err)) {
          setAccessState('forbidden')
          return
        }
        setAccessState('forbidden')
      })

    return () => {
      cancelled = true
    }
  }, [isLoading, isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="admin-guard">
        <p className="admin-guard__text">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  if (accessState === 'pending') {
    return (
      <div className="admin-guard">
        <p className="admin-guard__text">Checking access…</p>
      </div>
    )
  }

  if (accessState === 'forbidden') {
    return <AdminForbiddenPage />
  }

  return children
}

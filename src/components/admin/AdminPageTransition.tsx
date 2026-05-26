import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export function AdminPageTransition({ children }: Props) {
  const location = useLocation()
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    setProgress(true)
    const done = window.setTimeout(() => setProgress(false), 420)
    return () => window.clearTimeout(done)
  }, [location.pathname])

  return (
    <>
      <div
        className={`admin-route-progress${progress ? ' is-active' : ''}`}
        role="progressbar"
        aria-hidden
      />
      <div key={location.pathname} className="admin-page-enter">
        {children}
      </div>
    </>
  )
}

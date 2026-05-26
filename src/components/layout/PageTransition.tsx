import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export function PageTransition({ children }: Props) {
  const location = useLocation()
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    setProgress(true)
    const done = window.setTimeout(() => setProgress(false), 450)
    return () => window.clearTimeout(done)
  }, [location.pathname])

  return (
    <>
      <div
        className={`route-progress${progress ? ' is-active' : ''}`}
        role="progressbar"
        aria-hidden
      />
      <div key={location.pathname} className="page-enter">
        {children}
      </div>
    </>
  )
}

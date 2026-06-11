import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  /** `lg` — wider panel for forms with rich content (e.g. role permissions). */
  size?: 'md' | 'lg'
}

export function AdminModal({ title, open, onClose, children, size = 'md' }: Props) {
  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  // Render into <body> so the dialog escapes any transformed/clipped admin
  // ancestor (page-transition wrappers use CSS transforms, which would
  // otherwise trap a `position: fixed` element inside the content area).
  return createPortal(
    <div className="crm-modal crm-modal--open" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="crm-modal__backdrop" onClick={onClose} aria-label="Close modal" />
      <div className={`crm-modal__panel${size === 'lg' ? ' crm-modal__panel--lg' : ''}`}>
        <header className="crm-modal__head">
          <h3>{title}</h3>
          <button type="button" className="crm-icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="crm-modal__body crm-scroll">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

import type { ReactNode } from 'react'

type Props = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function AdminModal({ title, open, onClose, children }: Props) {
  if (!open) return null

  return (
    <div className="crm-modal crm-modal--open" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="crm-modal__backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="crm-modal__panel">
        <header className="crm-modal__head">
          <h3>{title}</h3>
          <button type="button" className="crm-icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="crm-modal__body crm-scroll">{children}</div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

type Props = {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

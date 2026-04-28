import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
}

export function AdminIconButton({ label, children, className = '', ...rest }: Props) {
  return (
    <button type="button" className={`crm-icon-btn ${className}`.trim()} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  )
}

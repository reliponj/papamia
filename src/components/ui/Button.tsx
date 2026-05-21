import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'
type Size = 'md' | 'sm'

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type LinkButtonProps = BaseProps & {
  to: string
  state?: unknown
  onClick?: () => void
}

function btnClass(variant: Variant, size: Size, extra = ''): string {
  return ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', extra]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={btnClass(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  state,
  children,
  onClick,
}: LinkButtonProps) {
  return (
    <Link to={to} state={state} className={btnClass(variant, size, className)} onClick={onClick}>
      {children}
    </Link>
  )
}

/** @deprecated use variant="secondary" */
export type { Variant as ButtonVariant }

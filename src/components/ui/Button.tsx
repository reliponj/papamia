import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: Props & { type?: 'button' | 'submit' | 'reset' }) {
  const cls = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}

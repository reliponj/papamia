import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: Props) {
  const cls = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}

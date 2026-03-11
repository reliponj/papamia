import type { FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} PapaMia. Все права защищены.</p>
      <p>Сделано в рамках лабораторной работы по React.</p>
    </footer>
  )
}


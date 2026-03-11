import type { FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} PapaMia. Все права защищены.</p>
      <p>PapaMia — итальянская кухня с доставкой по всему городу Кишинёв.</p>
      <p>Сделано в рамках лабораторной работы по React.</p>
    </footer>
  )
}


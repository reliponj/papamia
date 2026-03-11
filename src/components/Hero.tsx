import type { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Итальянский ресторан PapaMia</h1>
        <p>
          Горячая пицца, свежая паста и ароматные супы прямо из сердца Италии.
          Закажите онлайн — мы доставим тепло итальянской кухни к вам домой.
        </p>
        <a className="hero-button" href="#catalog">
          Перейти к каталогу
        </a>
      </div>
      <div className="hero-decoration" aria-hidden="true" />
    </section>
  )
}


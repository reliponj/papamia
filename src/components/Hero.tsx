import type { FC } from 'react'

export const Hero: FC = () => {
  return (
    <section className="hero hero-dark">
      <div className="hero-overlay" />
      <div className="hero-content hero-content-dark">
        <h1>PapaMia — вкус Италии ночью</h1>
        <p>
          Атмосферный итальянский ресторан с доставкой до поздней ночи. Горячая
          пицца из печи, свежая паста и супы, приготовленные по семейным
          рецептам. Мы заботимся о том, чтобы каждое блюдо было таким же тёплым,
          как огни нашего зала.
        </p>
        <a className="hero-button hero-button-light" href="#catalog">
          Посмотреть меню
        </a>
      </div>
    </section>
  )
}


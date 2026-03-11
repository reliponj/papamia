import './App.css'
import { useMemo, useState } from 'react'
import { products } from './products'

function App() {
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return products
    return products.filter((product) =>
      product.name.toLowerCase().includes(query),
    )
  }, [search])

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <span className="logo-badge">🍕</span>
          <div>
            <div className="logo-title">PapaMia</div>
            <div className="logo-subtitle">Итальянская кухня с доставкой</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#catalog">Каталог</a>
          <a href="#favorites">Избранное</a>
          <a href="#about">О нас</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Итальянский ресторан PapaMia</h1>
            <p>
              Горячая пицца, свежая паста и ароматные супы прямо из сердца
              Италии. Закажите онлайн — мы доставим тепло итальянской кухни к
              вам домой.
            </p>
            <a className="hero-button" href="#catalog">
              Перейти к каталогу
            </a>
          </div>
          <div className="hero-decoration" aria-hidden="true" />
        </section>

        <section className="search-section">
          <label className="search-label" htmlFor="search">
            Найдите своё идеальное блюдо
          </label>
          <input
            id="search"
            type="text"
            className="search-input"
            placeholder="Поиск по названию: пицца, паста, суп..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        <section id="catalog" className="catalog">
          <div className="catalog-header">
            <h2>Меню PapaMia</h2>
            <p className="catalog-count">
              Найдено блюд: <span>{filteredProducts.length}</span>
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="empty-state">Ничего не найдено. Попробуйте другой запрос.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                    <span className={`product-tag product-tag-${product.category}`}>
                      {product.category === 'pizza' && 'Пицца'}
                      {product.category === 'pasta' && 'Паста'}
                      {product.category === 'soup' && 'Суп'}
                    </span>
                  </div>
                  <div className="product-body">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{product.price} MDL</span>
                    <button type="button" className="product-button">
                      В корзину
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="favorites" className="info-section">
          <h2>Избранное</h2>
          <p>Функционал избранного будет добавлен на следующем этапе лабораторной.</p>
        </section>

        <section id="about" className="info-section">
          <h2>О ресторане PapaMia</h2>
          <p>
            PapaMia — это уютный итальянский ресторан с доставкой по городу.
            Мы готовим по традиционным рецептам, используем только свежие
            ингредиенты и заботимся о том, чтобы каждое блюдо приносило
            удовольствие.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PapaMia. Все права защищены.</p>
        <p>Сделано в рамках лабораторной работы по React.</p>
      </footer>
    </div>
  )
}

export default App

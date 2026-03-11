import './App.css'
import { useMemo, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Counter } from './components/Counter'
import { FilterButtons, type FilterValue } from './components/FilterButtons'
import { ProductList } from './components/ProductList'
import { SearchBar } from './components/SearchBar'
import { products } from './data/products'

function App() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    let result = products

    if (filter !== 'all') {
      result = result.filter((product) => product.category === filter)
    }

    if (!query) {
      return result
    }

    return result.filter((product) =>
      product.name.toLowerCase().includes(query),
    )
  }, [filter, search])

  return (
    <div className="app">
      <Header />

      <main>
        <Hero />

        <SearchBar value={search} onChange={setSearch} />

        <section id="catalog" className="catalog">
          <div className="catalog-header">
            <h2>Меню PapaMia</h2>
            <Counter count={filteredProducts.length} />
          </div>

          <FilterButtons activeFilter={filter} onChange={setFilter} />

          <ProductList products={filteredProducts} />
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

      <Footer />
    </div>
  )
}

export default App

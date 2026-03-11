import './App.css'
import { useMemo, useState } from 'react'
import { CartModal } from './components/CartModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Counter } from './components/Counter'
import { FilterButtons, type FilterValue } from './components/FilterButtons'
import { ProductList } from './components/ProductList'
import { SearchBar } from './components/SearchBar'
import { products, type Product } from './data/products'
import type { CartItem } from './types/cart'

function App() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

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

  const handleAddToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (!existing) {
        return [...current, { product, quantity: 1 }]
      }
      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })
  }

  const handleToggleFavorite = (productId: number) => {
    setFavoriteIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds],
  )

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero />

        <SearchBar value={search} onChange={setSearch} />

        <section id="catalog" className="catalog">
          <div className="catalog-header">
            <h2>Меню PapaMia</h2>
            <Counter
              foundCount={filteredProducts.length}
              cartCount={cartCount}
            />
          </div>

          <FilterButtons activeFilter={filter} onChange={setFilter} />

          <ProductList
            products={filteredProducts}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        </section>

        <section id="favorites" className="info-section">
          <h2>Избранное</h2>
          {favoriteProducts.length === 0 ? (
            <p>У вас пока нет избранных блюд. Нажмите на сердечко на карточке, чтобы добавить.</p>
          ) : (
            <ProductList
              products={favoriteProducts}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
            />
          )}
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

      <CartModal
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
      />

      <Footer />
    </div>
  )
}

export default App

import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CartModal } from './components/CartModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Counter } from './components/Counter'
import { FilterButtons, type FilterValue } from './components/FilterButtons'
import { ProductList } from './components/ProductList'
import { SearchBar } from './components/SearchBar'
import { products as mockProducts, type Product } from './data/products'
import type { CartItem } from './types/cart'

function App() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const hasLoadedFromApi = useRef(false)

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    let result = allProducts

    if (filter !== 'all') {
      result = result.filter((product) => product.category === filter)
    }

    if (!query) {
      return result
    }

    return result.filter((product) =>
      product.name.toLowerCase().includes(query),
    )
  }, [allProducts, filter, search])

  useEffect(() => {
    if (hasLoadedFromApi.current) return
    hasLoadedFromApi.current = true

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://fakestoreapi.com/products')
        if (!response.ok) return
        const data: Array<{
          id: number
          title: string
          price: number
          image: string
          category: string
          description: string
        }> = await response.json()
        const mapped: Product[] = data.map((item) => ({
          id: 1000 + item.id,
          name: item.title,
          description: item.description,
          price: Math.round(item.price * 18),
          image: item.image,
          category: 'clothes',
        }))
        setAllProducts((current) => {
          const existingIds = new Set(current.map((product) => product.id))
          const unique = mapped.filter((product) => !existingIds.has(product.id))
          return [...current, ...unique]
        })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProducts()
  }, [])

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
    () => allProducts.filter((product) => favoriteIds.includes(product.id)),
    [allProducts, favoriteIds],
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

          {isLoading ? (
            <p className="empty-state">Загрузка...</p>
          ) : (
            <ProductList
              products={filteredProducts}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              getQuantityForProduct={(id) =>
                cartItems.find((item) => item.product.id === id)?.quantity ?? 0
              }
              onIncreaseQuantity={handleAddToCart}
              onDecreaseQuantity={(product) => {
                setCartItems((current) =>
                  current
                    .map((item) =>
                      item.product.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                    )
                    .filter((item) => item.quantity > 0),
                )
              }}
            />
          )}
        </section>

        <section id="favorites" className="info-section">
          <h2>Избранное</h2>
          {favoriteProducts.length === 0 ? (
            <p>У вас пока нет избранных блюд. Нажмите на сердечко на карточке, чтобы добавить.</p>
          ) : (
            <div className="favorites-grid-wrapper">
              <ProductList
                products={favoriteProducts}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                getQuantityForProduct={(id) =>
                  cartItems.find((item) => item.product.id === id)?.quantity ?? 0
                }
                onIncreaseQuantity={handleAddToCart}
                onDecreaseQuantity={(product) => {
                  setCartItems((current) =>
                    current
                      .map((item) =>
                        item.product.id === product.id
                          ? { ...item, quantity: item.quantity - 1 }
                          : item,
                      )
                      .filter((item) => item.quantity > 0),
                  )
                }}
              />
            </div>
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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { LocaleProvider } from './contexts/LocaleContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LocaleProvider>
  </StrictMode>,
)
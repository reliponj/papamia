import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { AboutPage } from './pages/AboutPage'
import { ContactsPage } from './pages/ContactsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contacts', element: <ContactsPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/users" replace /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'products', element: <AdminProductsPage /> },
    ],
  },
])

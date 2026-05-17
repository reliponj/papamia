import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAdmin } from './components/admin/RequireAdmin'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { AboutPage } from './pages/AboutPage'
import { ContactsPage } from './pages/ContactsPage'
import { PizzaBuilderPage } from './pages/PizzaBuilderPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/AccountPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminRolesPage } from './pages/admin/AdminRolesPage'
import { AdminGroupsPage } from './pages/admin/AdminGroupsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminAllergensPage } from './pages/admin/AdminAllergensPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'builder', element: <PizzaBuilderPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-success', element: <OrderSuccessPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/users" replace /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'allergens', element: <AdminAllergensPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'roles', element: <AdminRolesPage /> },
      { path: 'groups', element: <AdminGroupsPage /> },
    ],
  },
])

import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAdmin } from './components/admin/RequireAdmin'
import { RequireAuth } from './components/auth/RequireAuth'
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
import { AdminBannersPage } from './pages/admin/AdminBannersPage'
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage'
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage'
import { AdminPromocodesPage } from './pages/admin/AdminPromocodesPage'
import { AdminIngridientsPage } from './pages/admin/AdminIngridientsPage'
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'

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
      { path: 'blog/:id', element: <BlogPostPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'account',
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
      },
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
      { index: true, element: <AdminDashboardPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'allergens', element: <AdminAllergensPage /> },
      { path: 'banners', element: <AdminBannersPage /> },
      { path: 'articles', element: <AdminArticlesPage /> },
      { path: 'locations', element: <AdminLocationsPage /> },
      { path: 'promocodes', element: <AdminPromocodesPage /> },
      { path: 'ingredients', element: <AdminIngridientsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'roles', element: <AdminRolesPage /> },
      { path: 'groups', element: <AdminGroupsPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/new', element: <AdminOrderDetailPage /> },
      { path: 'orders/:id', element: <AdminOrderDetailPage /> },
    ],
  },
])

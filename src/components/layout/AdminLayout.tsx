import { NavLink, Outlet } from 'react-router-dom'
import { AdminDataProvider, useAdminData } from '../../contexts/AdminDataContext'

function AdminShell() {
  const { users, categories, products } = useAdminData()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Papa Mia CRM</div>
        <p className="admin-sidebar__hint">Restaurant back-office</p>
        <nav className="admin-sidebar__nav">
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}>
            Users
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
          >
            Products
          </NavLink>
        </nav>

        <div className="admin-sidebar__meta">
          <div>
            <span>Users</span>
            <strong>{users.length}</strong>
          </div>
          <div>
            <span>Categories</span>
            <strong>{categories.length}</strong>
          </div>
          <div>
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <h1>Admin CRM</h1>
          <p>Manage core entities and relationships.</p>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminShell />
    </AdminDataProvider>
  )
}

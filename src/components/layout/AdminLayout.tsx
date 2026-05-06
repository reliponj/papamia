import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ChevronLeft, LayoutGrid, Pizza, Settings, Tags, Users, ShieldAlert } from 'lucide-react'
import { AdminDataProvider } from '../../contexts/AdminDataContext'

function AdminShell() {
  const [isOpen, setIsOpen] = useState(true)

  const links = [
    { to: '/admin/users', label: 'Users', Icon: Users },
    { to: '/admin/categories', label: 'Categories', Icon: Tags },
    { to: '/admin/products', label: 'Products', Icon: Pizza },
    { to: '/admin/allergens', label: 'Allergens', Icon: ShieldAlert },
  ]

  return (
    <Tooltip.Provider delayDuration={200}>
      <Collapsible.Root
        className={`admin-shell${isOpen ? '' : ' is-collapsed'}`}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <aside className="admin-sidebar">
          <div className="admin-sidebar__panel">
            <div className="admin-sidebar__head">
              <div className="admin-sidebar__brand-wrap">
                <div className="admin-sidebar__logo">
                  <LayoutGrid size={14} />
                </div>
                {isOpen && <div className="admin-sidebar__brand">Papa Mia CRM</div>}
              </div>
              <Collapsible.Trigger asChild>
                <button
                  type="button"
                  className="admin-sidebar__toggle"
                  aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  <ChevronLeft size={16} />
                </button>
              </Collapsible.Trigger>
            </div>

            {isOpen && <p className="admin-sidebar__hint">Restaurant back-office</p>}
          </div>

          <div className="admin-sidebar__group">
            {isOpen && <div className="admin-sidebar__section-title">Core entities</div>}

            <nav className="admin-sidebar__nav">
              {links.map(({ to, label, Icon }) => (
                <Tooltip.Root key={to} disableHoverableContent>
                  <Tooltip.Trigger asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `admin-nav-link admin-nav-link--ghost${isActive ? ' is-active' : ''}`
                      }
                    >
                      <Icon size={16} />
                      {isOpen && <span>{label}</span>}
                    </NavLink>
                  </Tooltip.Trigger>
                  {!isOpen && (
                    <Tooltip.Portal>
                      <Tooltip.Content className="admin-tooltip" side="right" sideOffset={8}>
                        {label}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              ))}
            </nav>
          </div>

          <div className="admin-sidebar__footer">
            <Tooltip.Root disableHoverableContent>
              <Tooltip.Trigger asChild>
                <button type="button" className="admin-nav-link admin-nav-link--ghost">
                  <Settings size={16} />
                  {isOpen && <span>Settings</span>}
                </button>
              </Tooltip.Trigger>
              {!isOpen && (
                <Tooltip.Portal>
                  <Tooltip.Content className="admin-tooltip" side="right" sideOffset={8}>
                    Settings
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </div>
        </aside>

        <div className="admin-workspace">
          <header className="admin-topbar">
            <h1>Admin CRM</h1>
            <p>Manage core entities and relationships.</p>
          </header>
          <main className="admin-content">
            <div className="admin-content__surface">
              <Outlet />
            </div>
          </main>
        </div>
      </Collapsible.Root>
    </Tooltip.Provider>
  )
}

export function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminShell />
    </AdminDataProvider>
  )
}

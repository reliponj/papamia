import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  ChevronLeft, ChevronDown,
  LayoutGrid, Pizza, Users, Settings, Image, Ticket, LayoutDashboard,
} from 'lucide-react'
import { getAdminBreadcrumbs, getAdminPageTitle } from '../../pages/admin/adminNavMeta'

type NavChild = { to: string; label: string }
type NavGroup = {
  id: string
  label: string
  icon: React.ReactNode
  children: NavChild[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'catalog',
    label: 'Catalog',
    icon: <Pizza size={16} strokeWidth={1.75} />,
    children: [
      { to: '/admin/categories', label: 'Categories' },
      { to: '/admin/products',   label: 'Products'   },
      { to: '/admin/allergens',   label: 'Allergens'   },
      { to: '/admin/ingredients', label: 'Ingredients' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: <Image size={16} strokeWidth={1.75} />,
    children: [
      { to: '/admin/banners', label: 'Banners' },
      { to: '/admin/articles', label: 'Articles' },
      { to: '/admin/locations', label: 'Locations' },
      { to: '/admin/reviews', label: 'Reviews' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: <Ticket size={16} strokeWidth={1.75} />,
    children: [
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/promocodes', label: 'Promo codes' },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    icon: <Users size={16} strokeWidth={1.75} />,
    children: [
      { to: '/admin/users',  label: 'User list' },
      { to: '/admin/roles',  label: 'Roles'     },
      { to: '/admin/groups', label: 'Groups'    },
    ],
  },
]

function useActiveGroup(groups: NavGroup[], pathname: string): string | null {
  if (pathname === '/admin' || pathname === '/admin/') return null
  for (const g of groups) {
    if (g.children.some((c) => pathname === c.to || pathname.startsWith(`${c.to}/`))) {
      return g.id
    }
  }
  return null
}

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { pathname } = useLocation()
  const activeGroup = useActiveGroup(NAV_GROUPS, pathname)
  const breadcrumbs = getAdminBreadcrumbs(pathname)
  const pageTitle = getAdminPageTitle(pathname)
  const isDashboard = pathname === '/admin' || pathname === '/admin/'
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NAV_GROUPS.map((g) => [g.id, g.id === activeGroup]))
  )

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <Collapsible.Root
        className={`admin-shell${sidebarOpen ? '' : ' is-collapsed'}`}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        <aside className="admin-sidebar">
          {/* ── Panel (brand + hint) ─────────────────── */}
          <div className="admin-sidebar__panel">
            <div className="admin-sidebar__head">
              <div className="admin-sidebar__brand-wrap">
                <div className="admin-sidebar__logo">
                  <LayoutGrid size={14} />
                </div>
                {sidebarOpen && (
                  <span className="admin-sidebar__brand">Papa Mia CRM</span>
                )}
              </div>
              <Collapsible.Trigger asChild>
                <button
                  type="button"
                  className="admin-sidebar__toggle"
                  aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  <ChevronLeft size={15} />
                </button>
              </Collapsible.Trigger>
            </div>
            {sidebarOpen && (
              <p className="admin-sidebar__hint">Restaurant back-office</p>
            )}
          </div>

          {/* ── Nav ─────────────────────────────────── */}
          <nav className="admin-sidebar__nav" aria-label="Main navigation">
            <Tooltip.Root disableHoverableContent>
              <Tooltip.Trigger asChild>
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `admin-nav-dashboard${isActive ? ' is-active' : ''}`
                  }
                  aria-label="Dashboard"
                >
                  <span className="admin-nav-link__icon">
                    <LayoutDashboard size={16} strokeWidth={1.75} />
                  </span>
                  {sidebarOpen && <span className="admin-nav-link__label">Dashboard</span>}
                </NavLink>
              </Tooltip.Trigger>
              {!sidebarOpen && (
                <Tooltip.Portal>
                  <Tooltip.Content className="admin-tooltip" side="right" sideOffset={10}>
                    Dashboard
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>

            {NAV_GROUPS.map((group) => {
              const isGroupActive = group.id === activeGroup
              const isExpanded = openGroups[group.id] ?? false

              if (!sidebarOpen) {
                return (
                  <Tooltip.Root key={group.id} disableHoverableContent>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className={`admin-nav-group__trigger${isGroupActive ? ' is-active' : ''}`}
                        onClick={() => toggleGroup(group.id)}
                        aria-label={group.label}
                      >
                        <span className="admin-nav-link__icon">{group.icon}</span>
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className="admin-tooltip" side="right" sideOffset={10}>
                        {group.label}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )
              }

              return (
                <Collapsible.Root
                  key={group.id}
                  open={isExpanded}
                  onOpenChange={() => toggleGroup(group.id)}
                  className="admin-nav-group"
                >
                  <Collapsible.Trigger asChild>
                    <button
                      type="button"
                      className={`admin-nav-group__trigger${isGroupActive ? ' is-active' : ''}`}
                    >
                      <span className="admin-nav-link__icon">{group.icon}</span>
                      <span className="admin-nav-link__label">{group.label}</span>
                      <ChevronDown
                        size={14}
                        className={`admin-nav-group__chevron${isExpanded ? ' is-open' : ''}`}
                      />
                    </button>
                  </Collapsible.Trigger>

                  <Collapsible.Content className="admin-nav-group__content">
                    <ul className="admin-nav-group__list">
                      {group.children.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `admin-nav-child${isActive ? ' is-active' : ''}`
                            }
                          >
                            <span className="admin-nav-child__dot" />
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </Collapsible.Content>
                </Collapsible.Root>
              )
            })}
          </nav>

          {/* ── Footer (Settings) ────────────────────── */}
          <div className="admin-sidebar__footer">
            <Tooltip.Root disableHoverableContent>
              <Tooltip.Trigger asChild>
                <button type="button" className="admin-nav-group__trigger" aria-label="Settings">
                  <span className="admin-nav-link__icon">
                    <Settings size={16} strokeWidth={1.75} />
                  </span>
                  {sidebarOpen && (
                    <span className="admin-nav-link__label">Settings</span>
                  )}
                </button>
              </Tooltip.Trigger>
              {!sidebarOpen && (
                <Tooltip.Portal>
                  <Tooltip.Content className="admin-tooltip" side="right" sideOffset={10}>
                    Settings
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </div>
        </aside>

        <div className="admin-workspace">
          <header className="admin-topbar">
            <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <span key={`${crumb.label}-${i}`} className="admin-breadcrumbs__item">
                    {i > 0 && <span className="admin-breadcrumbs__sep">/</span>}
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                    )}
                  </span>
                )
              })}
            </nav>
            <h1>{pageTitle}</h1>
            <p>
              {isDashboard
                ? 'Overview and shortcuts for the back-office.'
                : 'Manage core entities and relationships.'}
            </p>
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
  return <AdminShell />
}

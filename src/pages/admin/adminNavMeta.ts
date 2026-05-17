export type AdminBreadcrumb = { label: string; to?: string }

const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/categories': 'Categories',
  '/admin/products': 'Products',
  '/admin/allergens': 'Allergens',
  '/admin/ingredients': 'Ingredients',
  '/admin/banners': 'Banners',
  '/admin/articles': 'Articles',
  '/admin/locations': 'Locations',
  '/admin/reviews': 'Reviews',
  '/admin/orders': 'Orders',
  '/admin/promocodes': 'Promo codes',
  '/admin/users': 'User list',
  '/admin/roles': 'Roles',
  '/admin/groups': 'Groups',
}

const GROUP_BY_PREFIX: { prefix: string; label: string }[] = [
  { prefix: '/admin/categories', label: 'Catalog' },
  { prefix: '/admin/products', label: 'Catalog' },
  { prefix: '/admin/allergens', label: 'Catalog' },
  { prefix: '/admin/ingredients', label: 'Catalog' },
  { prefix: '/admin/banners', label: 'Content' },
  { prefix: '/admin/articles', label: 'Content' },
  { prefix: '/admin/locations', label: 'Content' },
  { prefix: '/admin/reviews', label: 'Content' },
  { prefix: '/admin/orders', label: 'Sales' },
  { prefix: '/admin/promocodes', label: 'Sales' },
  { prefix: '/admin/users', label: 'Access' },
  { prefix: '/admin/roles', label: 'Access' },
  { prefix: '/admin/groups', label: 'Access' },
]

function groupForPath(pathname: string): string | null {
  for (const { prefix, label } of GROUP_BY_PREFIX) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return label
  }
  return null
}

export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumb[] {
  if (pathname === '/admin' || pathname === '/admin/') {
    return [{ label: 'Dashboard' }]
  }

  const crumbs: AdminBreadcrumb[] = [{ label: 'Dashboard', to: '/admin' }]
  const group = groupForPath(pathname)
  if (group) crumbs.push({ label: group })

  if (pathname.startsWith('/admin/orders/')) {
    const tail = pathname.slice('/admin/orders/'.length)
    crumbs.push({ label: 'Orders', to: '/admin/orders' })
    if (tail === 'new') {
      crumbs.push({ label: 'New order' })
    } else {
      crumbs.push({ label: `#${tail}` })
    }
    return crumbs
  }

  const label = ROUTE_LABELS[pathname]
  if (label) crumbs.push({ label })
  else crumbs.push({ label: pathname.replace('/admin/', '') })

  return crumbs
}

export function getAdminPageTitle(pathname: string): string {
  const crumbs = getAdminBreadcrumbs(pathname)
  return crumbs[crumbs.length - 1]?.label ?? 'Admin'
}

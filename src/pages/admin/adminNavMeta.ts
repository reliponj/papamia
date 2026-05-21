export type AdminBreadcrumb = { label: string; to?: string }

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

/** Navigation trail only — current page title lives in the section header above the table. */
export function getAdminBreadcrumbs(pathname: string): AdminBreadcrumb[] {
  if (pathname === '/admin' || pathname === '/admin/') {
    return [{ label: 'Admin' }]
  }

  const crumbs: AdminBreadcrumb[] = [{ label: 'Dashboard', to: '/admin' }]
  const group = groupForPath(pathname)
  if (group) crumbs.push({ label: group })

  if (pathname.startsWith('/admin/orders/')) {
    crumbs.push({ label: 'Orders', to: '/admin/orders' })
    return crumbs
  }

  return crumbs
}

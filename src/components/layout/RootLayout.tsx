import { Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { CartDrawer } from '../cart/CartDrawer'
import { PageTransition } from './PageTransition'

export function RootLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
      <CartDrawer />
    </div>
  )
}

import type { MainLayoutProps } from '../types/components'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page-shell container-fluid">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

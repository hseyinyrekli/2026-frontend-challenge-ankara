import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page-shell container-fluid">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import jotformLogo from '../assets/images/jotformlogo.png'

export function Navbar() {
  return (
    <header className="site-nav navbar navbar-expand-lg">
      <a className="brand navbar-brand" href="/">
        <img src={jotformLogo} alt="Jotform" />
      </a>

      <nav className="navbar-nav flex-row gap-2 mx-lg-auto" aria-label="Ana navigasyon">
        <Link to="/" className="nav-link" activeProps={{ className: 'active' }}>
          Ana Sayfa
        </Link>
        <Link to="/find-podo" className="nav-link" activeProps={{ className: 'active' }}>
          Find Podo
        </Link>
      </nav>

      <div className="nav-meta">
        <span>Missing Podo</span>
        <strong>Ankara Case</strong>
      </div>
    </header>
  )
}

import jotformLogo from '../assets/images/jotformlogo.png'

export function Navbar() {
  return (
    <header className="site-nav navbar navbar-expand-lg">
      <a className="brand navbar-brand" href="/">
        <img src={jotformLogo} alt="Jotform" />
      </a>

      <div className="nav-meta">
        <span>Missing Podo</span>
        <strong>Ankara Case</strong>
      </div>
    </header>
  )
}

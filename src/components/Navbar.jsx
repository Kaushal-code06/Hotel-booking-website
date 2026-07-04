import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__mark">W</span>
          Wayfare
        </Link>
        <nav className="navbar__links">
          <a href="#stays">Stays</a>
          <a href="#about">About</a>
          <a href="#help">Help</a>
        </nav>
        <button className="navbar__cta">Sign in</button>
      </div>
    </header>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Sidenav.css';
const Sidenav = (props) => {
  console.log(props)
  return (
    <nav>
      <h1 className="nav-logo"><span className="fa-brands fa-spotify spotify-nav"></span> Song Palate</h1>
      <ul className="links-container">
        <li className="link-list"><Link className="nav-link" to="/"><i class="fa-solid fa-music nav-icon"></i> Songs</Link></li>
        <li className="link-list"><Link className="nav-link" to="/"><i class="fa-solid fa-layer-group nav-icon"></i> Playlists</Link></li>
        <li className="link-list"><Link className="nav-link" to="/">Search</Link></li>
        <li className="link-list"><Link className="nav-link" to="/">Logout</Link></li>
      </ul>
    </nav>
  )
}

export default Sidenav
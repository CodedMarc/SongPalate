import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Sidenav.css';


const Sidenav = (props) => {
  console.log(props)
  // const [user, setUser] = useState(props.user.then(result => { console.log(result); return result }));
  return (
    <nav>
      <h1 className="nav-logo"><span className="fa-brands fa-spotify spotify-nav"></span> Song Palate</h1>
      <ul className="links-container">
        <h2 className="nav-greeting">Hello, {props.user.hasOwnProperty('spotify') ? props.user.spotify.displayName : 'User'}</h2>
        <li className="link-list"><i className="fa-solid fa-music nav-icon"></i><Link className="nav-link" to="top">Songs</Link></li>
        <li className="link-list"><i className="fa-solid fa-layer-group nav-icon"></i><Link className="nav-link" to="playlists">Playlists</Link></li>
        <li className="link-list"><Link className="nav-link" to="/">Search</Link></li>
        <li className="link-list"><Link className="nav-link" to="/">Logout</Link></li>
      </ul>
    </nav>
  )
}

export default Sidenav
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Sidenav.css';


const Sidenav = (props) => {
  const [toggle, setToggle] = useState(false);

  const toggleHandler = () => {
    return toggle ? setToggle(false) : setToggle(true);
  }
  const closeNav = () => {
    return toggle ? setToggle(false) : null;
  }
  // const [user, setUser] = useState(props.user.then(result => { console.log(result); return result }));
  return (
    <nav id="nav" className={toggle ? `slide-in` : null}>
      <div onClick={toggleHandler} className="mobile-burger">
        <div className={`line1 burger-icon ${toggle ? `burger-exit1` : null}`}></div>
        <div className={`line2 burger-icon ${toggle ? `burger-exit2` : null}`}></div>
        <div className={`line3 burger-icon ${toggle ? `burger-exit3` : null}`}></div>
      </div>
      <h1 className="nav-logo"><span className="fa-brands fa-spotify spotify-nav"></span> Song Palate</h1>
      <ul className="links-container">
        <h2 className="nav-greeting">Hello, {props.user.hasOwnProperty('name') ? props.user.name : 'User'}</h2>
        <li onClick={closeNav} className="link-list"><i className="fa-solid fa-music nav-icon"></i><Link className="nav-link" to="top">Top Songs</Link></li>
        <li onClick={closeNav} className="link-list"><i className="fa-solid fa-layer-group nav-icon"></i><Link className="nav-link" to="library">Library</Link></li>
        <li onClick={closeNav} className="link-list"><i className="fa-solid fa-headphones nav-icon"></i><Link className="nav-link" to="playlists">Playlists</Link></li>
        <li onClick={closeNav} className="link-list"><i className="fa-solid fa-magnifying-glass nav-icon"></i><Link className="nav-link" to="search">Search</Link></li>
        <li onClick={closeNav} className="link-list"><i className="fa-solid fa-door-open nav-icon"></i><a className="nav-link" href="/">Logout</a></li>
      </ul>
    </nav>
  )
}

export default Sidenav
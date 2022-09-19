import '../styles/Landing.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
function Landing() {
  // const spotifyLogin = () => {
  //   axios.get('http://localhost:3001/auth/spotify');
  // }
  return (
    <main className="Landing">
      <h1 className="title">Song Palate</h1>
      <p className='subtext center'>A Better Way to Find New Music</p>
      <a href="http://localhost:3001/auth/spotify" className="spotify-btn"><span className="fa-brands fa-spotify"></span> Login With Spotify</a>
    </main>
  );
}

export default Landing;

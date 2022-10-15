import '../styles/Landing.css';

function Landing() {

  return (
    <main className="Landing">
      <h1 className="title">Song Palate</h1>
      <p className='subtext center'>A (soon to be) Better Listening Experience</p>
      <a href="/auth/spotify" className="spotify-btn"><span className="fa-brands fa-spotify"></span> Login With Spotify</a>
    </main>
  );
}

export default Landing;

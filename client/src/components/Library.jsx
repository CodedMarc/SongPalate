import React from 'react'
import '../styles/Library.css';
import { useOutletContext } from 'react-router-dom';
const Library = () => {
  const { library, pushToQueue, play } = useOutletContext();
  console.log('library: ', library);

  const cards = [];
  const setQ = (e) => {
    pushToQueue(e.target.id);
    play(true);
  }
  const createCard = (arg, i) => {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      return (
        <li key={i} className={'library-list'}>
          <img id={arg.track.uri} className={'library-image'} alt={'Cover Art'} src={arg.track.album.images[0].url} />
          <h1 className={'library-song-name library-text'}>{arg.track.name || arg.track.album.name}</h1>
          <h3 className={'library-artist-name library-text'}>{arg.track.artists[0].name}</h3>
          <i id={arg.track.uri} onClick={setQ} className="fa-solid fa-play play-library"></i>
          <p className="library-time">{`${Math.floor(arg.track.duration_ms / 60000)}:${((arg.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : ''} ${((arg.track.duration_ms % 60000) / 1000).toFixed(0)}`}</p>
        </li>
      )
    }

  };

  if (Array.isArray(library)) {
    for (let i = 0; i < library.length; i++) {
      cards.push(createCard(library[i], i))
    }

  }
  return (
    <div id="Library-Section">
      <h1 className="you-are-here">Your Music Library</h1>
      <div className="library-container">
        <ol>
          {cards}
        </ol>
      </div>

    </div>
  )
}

export default Library
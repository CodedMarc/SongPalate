import React from 'react'
import '../styles/Songs.css';
import { useOutletContext } from "react-router-dom";

const Songs = (props) => {
  const { top, pushToQueue, play } = useOutletContext();
  const setQ = (e) => {
    // console.log(e.currentTarget)
    // console.log(e.currentTarget.id)
    pushToQueue([`${e.currentTarget.id}`]);
    play(true);
  }
  const cards = [];

  const createCard = (arg) => {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      return (
        <div onClick={setQ} id={arg.uri} key={arg.id} className={'song-card'}>
          <div className="img-container">
            <i className="fa-solid fa-play play-icon"></i>
            <img className={'album-image'} alt={'Album'} src={arg.album.images[0].url} />
          </div>
          <h1 className={'song-name'}>{arg.name || arg.album.name}</h1>
          <h3 className={'artist-name'}>{arg.artists[0].name}</h3>
        </div>
      )
    }

  };

  if (Array.isArray(top)) {
    for (let i = 0; i < top.length; i++) {
      cards.push(createCard(top[i]))
    }

  }


  return (
    <div id="top-songs-section">
      <h1 className="you-are-here">Your Top Songs</h1>
      <div className="songs-container">
        {cards}
      </div>
    </div>
  )
}

export default Songs
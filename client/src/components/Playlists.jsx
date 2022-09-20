import React, { useState, } from 'react';
import axios from 'axios';
import '../styles/Playlists.css';
import { useOutletContext } from 'react-router-dom';
const Playlists = () => {
  const cards = [];
  const { playlists, pushToQueue, token } = useOutletContext();
  const playPlaylist = async (e) => {
    const result = await axios.get(`https://api.spotify.com/v1/playlists/${e.target.id.replace('spotify:playlist:', '')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log('playPlaylist: ', result.data);
    const Queue = result.data.tracks.items.map(el =>
      el.track.uri
    );

    return pushToQueue(Queue);
  }
  const createCard = (arg) => {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      return (
        <div onClick={playPlaylist} id={arg.id} key={arg.id} className={'song-card'}>
          <img id={arg.uri} className={'album-image'} alt={'Album Image'} src={arg.images.length > 0 ? `${arg.images[0].url}` : 'https://images.squarespace-cdn.com/content/v1/57392608b6aa607768e72055/1477265014203-CDUS7TTWL7BJNIB5DYVG/artwork_1.jpg'} />
          <h1 className={'song-name'}>{arg.name}</h1>
          <h3 className={'artist-name'}>{arg.owner.displayName}</h3>
        </div>
      )
    }
  };
  if (Array.isArray(playlists.items)) {
    for (let i = 0; i < 20; i++) {
      cards.push(createCard(playlists.items[i]))
    }

  }
  return (
    <div id="playlists-section">
      {cards}
    </div>
  )
}

export default Playlists
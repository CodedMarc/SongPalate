import React from 'react';
import axios from 'axios';
import '../styles/Playlists.css';
import { Link, useOutletContext } from 'react-router-dom';
const Playlists = () => {
  const cards = [];
  const { playlists, pushToQueue, token, play } = useOutletContext();
  const playPlaylist = async (e) => {
    const result = await axios.get(`https://api.spotify.com/v1/playlists/${e.currentTarget.id.replace('spotify:playlist:', '')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log('playPlaylist: ', result.data);
    const Queue = result.data.tracks.items.map(el =>
      el.track.uri
    );

    pushToQueue(Queue);
    return play();
  }
  const createCard = (arg) => {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      return (
        <Link className={'playlist-card'} key={arg.id} to={`/timeline/${arg.id}`}>
          <div id={arg.id}>
            <img id={arg.uri} className={'album-image'} alt={'Playlist'} src={arg.images.length > 0 ? `${arg.images[0].url}` : 'https://images.squarespace-cdn.com/content/v1/57392608b6aa607768e72055/1477265014203-CDUS7TTWL7BJNIB5DYVG/artwork_1.jpg'} />
            <h1 className={'song-name'}>{arg.name}</h1>
            <h3 className={'artist-name'}>{arg.owner.displayName}</h3>
          </div>
        </Link>
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
      <h1 className="you-are-here">Your Playlists</h1>
      <div className="playlist-container">
        {cards}
      </div>
    </div>
  )
}

export default Playlists
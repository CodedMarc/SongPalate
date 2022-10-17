import React, { useEffect, useState } from 'react'
import '../styles/ViewPlaylist.css';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const ViewPlaylist = () => {
  const { playlists, pushToQueue, token, play } = useOutletContext();
  const [ gotItems, setGotItems ] = useState(false);
  const [ items, setItems ] = useState([]);
  const [location] = useState(useLocation())
  const selectedPlaylist = location.pathname.replace('/timeline/', '');
  const getPlaylistItems = async () => {
    // console.log('FIRING PLAYLIST ITEMS FUNC')
    const result = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    // console.log(result.data);
    setGotItems(true);
    return setItems(result.data.items);
  }
  useEffect(() => {
    if (!gotItems) getPlaylistItems();
  }, [items]);
  const navigate = useNavigate();
  const goBack = () => {
    return navigate(-1);
  }
  const playEntirePlaylist = () => {
    pushToQueue(items.map(song => song.track.uri));
    return play(true)
  }
  const playTrack = (e) => {
    pushToQueue([`${e.currentTarget.id}`]);
    return play(true);
  }
  const playlistDetails = playlists.items?.find(el => el.id === selectedPlaylist);
  return (
    <div id="ViewPlaylist">
      <div className="go-back-container">
        <h1 className="go-back"onClick={goBack}>Go Back</h1>
      </div>
      <div className="playlist-desc">
        <img alt="Playlist Cover" className="playlist-image" src={playlistDetails?.images.length > 0 ? `${playlistDetails.images[0].url}` : 'https://images.squarespace-cdn.com/content/v1/57392608b6aa607768e72055/1477265014203-CDUS7TTWL7BJNIB5DYVG/artwork_1.jpg'} />
        <div onClick={playEntirePlaylist} className="play-album">
          <i className="fa-solid fa-play play-playlist"></i>
        </div>
        <div className="playlist-desc-text">
          <h1>{playlistDetails?.name}</h1>
          <p>{playlistDetails?.description}</p>
          <p className="owned-by">Owned By: {playlistDetails?.owner?.display_name}</p>
        </div>
      </div>
      <div className="playlist-items">
        <ul>
          {items?.map((song, i) => song.track.name ? (
                <li key={i} className={'library-list'}>
                  <img className={'library-image'} alt={'Cover Art'} src={song.track.album.images[0].url} />
                  <h1 className={'library-song-name library-text'}>{song.track.name || song.track.album.name}</h1>
                  <h3 className={'library-artist-name library-text'}>{song.track.artists[0].name}</h3>
                  <div id={song.track.uri} onClick={playTrack} className="play-button">
                    <i className="fa-solid fa-play play-playlist"></i>
                  </div>
                  <p className="library-time">{`${Math.floor(song.track.duration_ms / 60000)}:${((song.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : ''}${((song.track.duration_ms % 60000) / 1000).toFixed(0)}`}</p>
                </li>
          ) : <React.Fragment key={i}></React.Fragment>)}
        </ul>
      </div>
    </div>
  )
}

export default ViewPlaylist
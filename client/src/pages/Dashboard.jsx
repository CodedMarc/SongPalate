import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css';
import axios from 'axios';
import Sidenav from '../components/Sidenav';
import SpotifyPlayer from 'react-spotify-web-playback';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  // Spotify Player Styling
  const PlayerStyles = {
    activeColor: 'red',
    bgColor: 'white',
    color: 'black',
    loaderColor: 'white',
    sliderColor: 'black',
    trackArtistColor: 'black',
    trackNameColor: 'black'
  };
  const [library, setLibrary] = useState([]);
  const [playlists, setPlaylists] = useState({});
  const [gotLibrary, setGotLibrary] = useState(false);
  const [gotSongs, setGotSongs] = useState(false)
  const [gotUser, setGotUser] = useState(false)
  const [gotPlaylists, setGotPlaylists] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(false);
  const [topSongs, setTopSongs] = useState([]);
  const [playSong, setPlaySong] = useState(false);
  const [queue, setQueue] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  // get current user
  const getCurrentUser = async () => {
    if (gotUser) return;
    setGotUser(true);
    const result = await axios.get('https://songpalate.herokuapp.com/spotifylog')
    // console.log('User Object', result.data);
    setToken(result.data.token);
    return setUser(result.data);
  }
  // get top songs
  const getTopSongs = async () => {
    if (gotSongs || !token) return;
    setGotSongs(true);
    const result = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // console.log('Top Songs Object', result.data);
    return setTopSongs(result.data);
    
  }
  // get playlists
  const getPlaylists = async () => {
    if (gotPlaylists || !token) return;
    setGotPlaylists(true);
    const result = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // console.log('Playlists Object', result.data)
    return setPlaylists(result.data);
  }
  // get spotify library
  const getMusicLibrary = async (count = 50) => {
    if (gotLibrary || !token) return;
    setGotLibrary(true);
    const result = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${count}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setTotalSongs(result.data.total);
    // console.log('Library Object', result.data)
    return setLibrary(result.data.items);
  }
  // set loaded true
  const isLoaded = () => {
    if (gotUser && gotPlaylists && gotLibrary && gotSongs) return setLoaded(true);
    return;
  }
  // ON COMPONENT MOUNT, GET
  useEffect(() => {
    if (!gotUser) getCurrentUser();
    if (!gotSongs) getTopSongs();
    if (!gotPlaylists) getPlaylists();
    if (!gotLibrary) getMusicLibrary();
    isLoaded();
  }, [user, gotSongs, gotPlaylists, gotLibrary])

  return loaded ? (
    <div className="Dashboard-Container">
      <Sidenav user={user} />
      <Outlet context={{ top: topSongs.items, pushToQueue: setQueue, play: setPlaySong, playlists: playlists, token: token, library: library, setLibrary: setLibrary, totalSongs: totalSongs }} />
      {/* <Outlet top={topSongs.items} pushToQueue={setQueue} play={setPlaySong} /> */}
      <SpotifyPlayer play={playSong} showSaveIcon={true} magnifySliderOnHover={true} token={token} uris={queue} styles={PlayerStyles} />

    </div>
  )
    :
    (
      <div className="Dashboard-Container">
        <h1 className="loading">loading...</h1>
      </div>
    )
}

export default Dashboard
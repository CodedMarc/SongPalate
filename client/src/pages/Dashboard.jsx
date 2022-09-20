import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css';
import axios from 'axios';
import Sidenav from '../components/Sidenav';
import Songs from '../components/Songs';
import SpotifyPlayer from 'react-spotify-web-playback';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Playlists from '../components/Playlists';
const Dashboard = () => {
  const PlayerStyles = {
    activeColor: 'red',
    bgColor: 'white',
    color: 'black',
    loaderColor: 'white',
    sliderColor: 'black',
    trackArtistColor: 'black',
    trackNameColor: 'black'
  };
  const [playlists, setPlaylists] = useState({});
  const [gotSongs, setGotSongs] = useState(false)
  const [gotPlaylists, setGotPlaylists] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [topSongs, setTopSongs] = useState([]);

  const [playSong, setPlaySong] = useState(false);
  const [queue, setQueue] = useState([]);
  // ON COMPONENT MOUNT, GET
  useEffect(() => {
    axios.get('http://localhost:3001/spuser')
      .then(response => {
        setUser(response.data)
        console.log(response.data)
        return response.data;
        // ACCESS TOKEN HERE
      }).then(result => {
        // GET TOP SONGS
        if (!gotSongs) {
          axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
              'Authorization': `Bearer ${result.token}`
            }
          })
            .then(result2 => {
              console.log('FIRED')
              setGotSongs(true);
              return setTopSongs(result2.data)
            })
        }
        if (!gotPlaylists) {
          // GET PLAYLISTS
          axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              'Authorization': `Bearer ${result.token}`
            }
          }).then(data => {
            console.log('PLAYLISTS', data.data)
            setGotPlaylists(true);
            return setPlaylists(data.data);
          })

        }
      })
      .then(result3 => {
        return setLoaded(true);
      })

  }, [])

  return loaded ? (
    <div className="Dashboard-Container">
      <Sidenav user={user} />
      <Outlet context={{ top: topSongs.items, pushToQueue: setQueue, play: setPlaySong, playlists: playlists, token: user.token }} />
      {/* <Outlet top={topSongs.items} pushToQueue={setQueue} play={setPlaySong} /> */}
      <SpotifyPlayer play={playSong} showSaveIcon={true} magnifySliderOnHover={true} autoPlay={true} token={user.token} uris={queue} styles={PlayerStyles} />

    </div>
  )
    :
    (
      <h1>loading...</h1>
    )
}

export default Dashboard
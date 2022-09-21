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
  const [library, setLibrary] = useState({});
  const [playlists, setPlaylists] = useState({});
  const [gotLibrary, setGotLibrary] = useState(false);
  const [gotSongs, setGotSongs] = useState(false)
  const [gotPlaylists, setGotPlaylists] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [topSongs, setTopSongs] = useState([]);

  const [playSong, setPlaySong] = useState(false);
  const [queue, setQueue] = useState([]);

  // recursively call to get spotify library
  const getMusicLibrary = async (token, count = 50, current = 0, total = 1, items = [], page = 0) => {
    // base case: if current is equal to total, setLibrary
    if (current >= total) {
      setLibrary(items)
      return setGotLibrary(true);
    }
    // recursive case:
    // check if total is less than count
    // if less, set count equal to total
    // else, call api and push result.data.items into items array
    // if total is more than current count, call function again
    const result = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${count}&offset=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const newTotal = result.data.total - 1;
    items.push(...result.data.items);
    const newCurrent = current + result.data.items.length;
    const newPage = page + count - 1;
    console.log(`recurse ${page}`, items)
    return getMusicLibrary(token, count, newCurrent, newTotal, items, newPage)
  }
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
        // GET SPOTIFY LIBRARY
        if (!gotLibrary) {
          return getMusicLibrary(result.token)
        }

      })
      .then(result3 => {
        return setLoaded(true);
      })

  }, [])

  return loaded ? (
    <div className="Dashboard-Container">
      <Sidenav user={user} />
      <Outlet context={{ top: topSongs.items, pushToQueue: setQueue, play: setPlaySong, playlists: playlists, token: user.token, library: library }} />
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
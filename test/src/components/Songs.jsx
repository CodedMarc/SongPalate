import React, { useState, useEffect } from 'react'
import axios from 'axios'
const Songs = (props) => {
  const [topSongs, setTopSongs] = useState([]);
  
  const getTopTracks = async () => {
    const token = props.user.token;
    const result = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return setTopSongs(result.data.items);
  }
  useEffect(() => {
    getTopTracks();
    
  }, [])
  return (
    <div>Songs</div>
  )
}

export default Songs
import React, { useState } from 'react'
import '../styles/Search.css';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
/* 
  curl --request GET \
  --url 'https://api.spotify.com/v1/search?type=album&include_external=audio' \
  --header 'Authorization: ' \
  --header 'Content-Type: application/json'
*/

const Search = () => {
    // Getting Props from Router Context/Component
    const { play, token, pushToQueue } = useOutletContext();
  // Search Input State
  const [searchValue, setSearchValue] = useState('');
  // Search Results
  const [searchResults, setSearchResults] = useState({});
  // Search Input Handler
  const handleChange = (e) => {
    return setSearchValue(e.target.value);
  }
  // Get Spotify Search Results
  const searchSpotify = async () => {
    const result = await axios.get(`https://api.spotify.com/v1/search?type=track,artist,album&q=${searchValue}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    setSearchValue('');
    return setSearchResults(result.data.tracks);
  }
  // Play Song
  const setQ = (e) => {
    // console.log(e.currentTarget.id)
    pushToQueue([`${e.currentTarget.id}`]);
    play(false);
    play(true);
  }
  return (
    <div id="SearchPage">
      <div className="filter-container">
        <label name="search-filter" className="search-filter">
          <input value={searchValue} onChange={handleChange} className="search-input" name="search-filter" type="text" placeholder={`Search Spotify`} />
          <i onClick={searchSpotify} className="fa-solid fa-magnifying-glass search-icon"></i>
        </label>
      </div>
      <div className="searchResults">
        {searchResults.items ? searchResults.items.map((track, i) => (
          <div onClick={setQ} id={track.uri} key={track.id} className={'song-card'}>
            <div className="img-container">
            <i className="fa-solid fa-play play-icon"></i>
            <img className={'album-image'} alt={'Album'} src={track.album.images[0].url} />
          </div>
            <h1 className={'song-name'}>{track.name || track.album.name}</h1>
            <h3 className={'artist-name'}>{track.artists[0].name}</h3>
          </div>
        )) : <></>}
      </div>
    </div>
  )
}

export default Search


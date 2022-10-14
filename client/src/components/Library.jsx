import React, {useState, useEffect} from 'react'
import axios from 'axios';
import '../styles/Library.css';
import { useOutletContext } from 'react-router-dom';
const Library = () => {
  /****************** STATE / VARIABLES *****************/
  
  // Getting Props from Router Context/Component
  const { library, setLibrary, pushToQueue, play, totalSongs, token } = useOutletContext();
  // Scroll to load state to prevent multiple get requests at once
  const [isFetching, setIsFetching] = useState(false);
  // Next Page to fetch songs
  const [page, setPage] = useState(50);
  // Search value for a song in library
  const [search, setSearch] = useState('');
  
  // Filtered library to display/render
  const [selectedFilter, setSelectedFilter] = useState('recent');
  
  // Filtered from search
  const filteredSongs = library.filter(song => {
    return song.track.name.toLowerCase().includes(search.toLowerCase()) || song.track.artists[0].name.toLowerCase().includes(search.toLowerCase())
  })


  /**************** FUNCTIONS ****************/

  // Function to get more songs - runs on bottom scroll
  const getMoreSongs = async (page) => {
    console.log(library.length);
    // If we already have the total available songs we can get, turn fetch boolean false and do nothing
    if (library.length >= totalSongs) {
      // Since we're doing nothing, but the function is still being triggered, we tell the trigger to relax
      setIsFetching(false);
      // the do nothing function
      return
    }
    // Request to spotify with next page (starts at 50 because first 50 is already grabbed on initial load)
    const result = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Get ready to grab next 50
    setPage(page + 50);
    // Update library array with results from fetching
    setLibrary(oldArr => [...oldArr, ...result.data.items]);
    // Let our scrollToBottom Loader know we're done
    return setIsFetching(false);
  }

  // Handle Input Change
  const handleInput = (e) => {
    setSearch(e.target.value);
  }

  // Handle alphabetical sort button
  const sortAlphabetically = () => {
    return setSelectedFilter('alphabetical')
    // return filteredSongs = filteredSongs.slice().sort((a, b) => a.track.name.toLowerCase().localeCompare(b.track.name.toLowerCase())).filter(song => {
    //   return song.track.name.toLowerCase().includes(search.toLowerCase()) || song.track.artists[0].name.toLowerCase().includes(search.toLowerCase())
    // });

  }

  // Handle Recently Added
  const sortRecent = () => {
    return setSelectedFilter('recent');
  }

  // Handle Artist Sorting
  const sortByArtist = () => {
    return setSelectedFilter('artist');
  }

  /**************** USE EFFECTS *****************/
  // Detect Scroll on Window
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom detected, triggers function to get more songs
  useEffect(() => {
    if (!isFetching) return;
    getMoreSongs(page);
  }, [isFetching]);

  // FUNCTION TO DETECT SCROLL TO BOTTOM
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    setIsFetching(true);
  }

  /*********************** RENDER SELECTED FILTER *************************************/
  const renderFilters = () => {
    if (selectedFilter === 'recent') {
      return filteredSongs.map((arg, i) => (
      <li key={i} className={'library-list'}>
        <img id={arg.track.uri} className={'library-image'} alt={'Cover Art'} src={arg.track.album.images[0].url} />
        <h1 className={'library-song-name library-text'}>{arg.track.name || arg.track.album.name}</h1>
        <h3 className={'library-artist-name library-text'}>{arg.track.artists[0].name}</h3>
        <i id={arg.track.uri} onClick={setQ} className="fa-solid fa-play play-library"></i>
        <p className="library-time">{`${Math.floor(arg.track.duration_ms / 60000)}:${((arg.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : ''}${((arg.track.duration_ms % 60000) / 1000).toFixed(0)}`}</p>
      </li>
    ))}
    else if (selectedFilter === 'alphabetical') {
      return filteredSongs.slice().sort((a, b) => a.track.name.localeCompare(b.track.name)).map((arg, i) => (
        <li key={i} className={'library-list'}>
          <img id={arg.track.uri} className={'library-image'} alt={'Cover Art'} src={arg.track.album.images[0].url} />
          <h1 className={'library-song-name library-text'}>{arg.track.name || arg.track.album.name}</h1>
          <h3 className={'library-artist-name library-text'}>{arg.track.artists[0].name}</h3>
          <i id={arg.track.uri} onClick={setQ} className="fa-solid fa-play play-library"></i>
          <p className="library-time">{`${Math.floor(arg.track.duration_ms / 60000)}:${((arg.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : ''}${((arg.track.duration_ms % 60000) / 1000).toFixed(0)}`}</p>
        </li>
      ))  
    }
    else {
      return filteredSongs.slice().sort((a, b) => a.track.artists[0].name.localeCompare(b.track.artists[0].name)).map((arg, i) => (
        <li key={i} className={'library-list'}>
          <img id={arg.track.uri} className={'library-image'} alt={'Cover Art'} src={arg.track.album.images[0].url} />
          <h1 className={'library-song-name library-text'}>{arg.track.name || arg.track.album.name}</h1>
          <h3 className={'library-artist-name library-text'}>{arg.track.artists[0].name}</h3>
          <i id={arg.track.uri} onClick={setQ} className="fa-solid fa-play play-library"></i>
          <p className="library-time">{`${Math.floor(arg.track.duration_ms / 60000)}:${((arg.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : ''}${((arg.track.duration_ms % 60000) / 1000).toFixed(0)}`}</p>
        </li>
      ))  
    }
  }
    /*********************** END OF RENDER OF FILTERS  *************************************/


  // Pushes to Queue
  const setQ = (e) => {
    pushToQueue(e.target.id);
    play(true);
  }

  // JSX:
  return (
    <div id="Library-Section">
      <h1 className="you-are-here">Your Music Library</h1>
      <div className="filter-container">
        <label name="search-filter" className="search-filter">
          <input className="search-input" name="search-filter" type="text" placeholder="Search Song or Artist" value={search} onChange={handleInput}/>
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </label>
        <div className="buttons-container">
          <button className={`filter-button ${selectedFilter ===  'recent' ? 'active-filter' : null}`} onClick={sortRecent}>Recently Added</button>
          <button className={`filter-button middle-filter-button ${selectedFilter ===  'alphabetical' ? 'active-filter' : null}`} onClick={sortAlphabetically}>Alphabetical</button>
          <button className={`filter-button ${selectedFilter ===  'artist' ? 'active-filter' : null}`} onClick={sortByArtist}>By Artist</button>
        </div>
      </div>
      <p style={{textAlign: 'left'}}>Total Songs: {totalSongs}</p>
      <div className="library-container">
        <ol>
          {renderFilters()}
          {library.length < totalSongs ? (isFetching && <h1>LOADING...</h1>) : <></>}
        </ol>
      </div>

    </div>
  )
}

export default Library
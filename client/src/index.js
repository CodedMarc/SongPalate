import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Landing from './pages/Landing';
import Playlists from './components/Playlists';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Songs from './components/Songs';
import Library from './components/Library';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/timeline" element={<Dashboard />} >
        <Route path="top" element={<Songs />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="library" element={<Library />} />
      </Route>
    </Routes>
  </BrowserRouter>
);



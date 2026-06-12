import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Welcome from './pages/Welcome';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import JoinRoom from './pages/JoinRoom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game/:roomCode" element={<Game />} />
      <Route path="/room/:roomCode" element={<JoinRoom />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);

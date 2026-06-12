import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import socket from '../utils/socket';
import { getRoom } from '../utils/api';
import Scoreboard from '../components/Scoreboard';
import GameBoard from '../components/GameBoard';
import VictoryOverlay from '../components/VictoryOverlay';
import ConnectionBanner from '../components/ConnectionBanner';

export default function Game() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [playerSlot, setPlayerSlot] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [person1Connected, setPerson1Connected] = useState(false);
  const [person2Connected, setPerson2Connected] = useState(false);
  const [gameOver, setGameOver] = useState(null); // { winner, winningCells, isDraw }
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState('');

  // Determine player slot from session
  useEffect(() => {
    const savedRoom = sessionStorage.getItem('roomCode');
    const savedSlot = sessionStorage.getItem('playerSlot');

    if (!savedRoom || savedRoom !== roomCode) {
      // Treat as person2 joining from link
      sessionStorage.setItem('roomCode', roomCode);
      sessionStorage.setItem('playerSlot', 'person2');
      setPlayerSlot('person2');
    } else {
      setPlayerSlot(savedSlot || 'person2');
    }
  }, [roomCode]);

  // Connect socket and load room
  useEffect(() => {
    if (!playerSlot) return;

    async function init() {
      try {
        const room = await getRoom(roomCode);
        setGameState(room);
        setPerson1Connected(room.players?.person1?.connected || false);
        setPerson2Connected(room.players?.person2?.connected || false);
      } catch {
        navigate('/lobby');
        return;
      }

      socket.connect();
      socket.emit('join_room', { roomCode, playerSlot });
      setLoading(false);
    }

    init();

    return () => {
      socket.disconnect();
    };
  }, [playerSlot, roomCode]);

  // Socket event listeners
  useEffect(() => {
    function onRoomState(room) {
      setGameState(room);
      setPerson1Connected(room.players?.person1?.connected || false);
      setPerson2Connected(room.players?.person2?.connected || false);
    }

    function onGameUpdate(room) {
      setGameState(room);
    }

    function onPlayerStatus({ person1Connected: p1, person2Connected: p2, status }) {
      setPerson1Connected(p1);
      setPerson2Connected(p2);
    }

    function onGameOver({ winner, winningCells, isDraw }) {
      setGameOver({ winner, winningCells, isDraw });
      // Auto clear after display duration
      setTimeout(() => setGameOver(null), isDraw ? 2500 : 4000);
    }

    function onRoundReset({ round }) {
      setGameOver(null);
    }

    function onPlayerDisconnected({ player }) {
      if (player === 'person1') setPerson1Connected(false);
      if (player === 'person2') setPerson2Connected(false);
    }

    function onError({ message }) {
      setSocketError(message);
    }

    socket.on('room_state', onRoomState);
    socket.on('game_update', onGameUpdate);
    socket.on('player_status', onPlayerStatus);
    socket.on('game_over', onGameOver);
    socket.on('round_reset', onRoundReset);
    socket.on('player_disconnected', onPlayerDisconnected);
    socket.on('error', onError);

    return () => {
      socket.off('room_state', onRoomState);
      socket.off('game_update', onGameUpdate);
      socket.off('player_status', onPlayerStatus);
      socket.off('game_over', onGameOver);
      socket.off('round_reset', onRoundReset);
      socket.off('player_disconnected', onPlayerDisconnected);
      socket.off('error', onError);
    };
  }, []);

  const handleCellClick = useCallback((cellIndex) => {
    if (!gameState || !playerSlot) return;
    const mySymbol = playerSlot === 'person1' ? 'X' : 'O';
    socket.emit('make_move', { roomCode, cellIndex, player: mySymbol });
  }, [gameState, playerSlot, roomCode]);

  if (loading || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-3 h-3 rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </motion.div>
      </div>
    );
  }

  const bothConnected = person1Connected && person2Connected;
  const board = gameState.board || Array(9).fill('');
  const currentTurn = gameState.currentTurn || 'X';
  const scores = gameState.scores || { X: 0, O: 0 };
  const round = gameState.round || 1;
  const winningCells = gameOver?.winningCells || gameState.winningCells || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-sm flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>✕</div>
            <span className="font-display text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tic Tac Toe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-xs font-body">Room:</span>
            <span className="font-display text-sm text-purple-400">{roomCode}</span>
          </div>
        </div>

        {/* You are label */}
        <motion.div
          className="text-center py-2 rounded-xl"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          <span className="text-slate-500 text-xs font-body">You are </span>
          <span className="font-semibold font-body" style={{ color: playerSlot === 'person1' ? '#f472b6' : '#60a5fa' }}>
            {playerSlot === 'person1' ? 'Person 1 (✕)' : 'Person 2 (○)'}
          </span>
        </motion.div>

        {/* Connection banner */}
        {bothConnected ? null : (
          <ConnectionBanner
            person1Connected={person1Connected}
            person2Connected={person2Connected}
            playerSlot={playerSlot}
          />
        )}

        {/* Scoreboard */}
        <Scoreboard
          scores={scores}
          round={round}
          currentTurn={currentTurn}
          playerSlot={playerSlot}
          bothConnected={bothConnected}
        />

        {/* Board */}
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          currentTurn={currentTurn}
          playerSlot={playerSlot}
          winningCells={winningCells}
          gameOver={!!gameOver}
          bothConnected={bothConnected}
        />

        {/* Error */}
        {socketError && (
          <motion.p className="text-red-400 text-center text-sm font-body"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>⚠ {socketError}</motion.p>
        )}
      </motion.div>

      {/* Victory overlay */}
      {gameOver && (
        <VictoryOverlay
          winner={gameOver.winner}
          isDraw={gameOver.isDraw}
          playerSlot={playerSlot}
        />
      )}
    </div>
  );
}

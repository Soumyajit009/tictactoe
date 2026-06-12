import socket from '../utils/socket';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createRoom, getRoom } from '../utils/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function Lobby() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we already have a room in session
    const savedRoom = sessionStorage.getItem('roomCode');
    const savedSlot = sessionStorage.getItem('playerSlot');
    if (savedRoom && savedSlot) {
      navigate(`/game/${savedRoom}`);
      return;
    }
    initRoom();
  }, []);

  useEffect(() => {
  if (!roomCode) return;

  socket.connect();
  socket.emit('join_room', { roomCode, playerSlot: 'person1' });

  function onPlayerStatus({ person2Connected }) {
    if (person2Connected) {
      navigate(`/game/${roomCode}`);
    }
  }

  socket.on('player_status', onPlayerStatus);

  return () => {
    socket.off('player_status', onPlayerStatus);
    socket.disconnect();
  };
}, [roomCode, navigate]);

  async function initRoom() {
    try {
      const data = await createRoom();
      setRoomCode(data.roomCode);
      sessionStorage.setItem('roomCode', data.roomCode);
      sessionStorage.setItem('playerSlot', 'person1');
    } catch (err) {
      setError('Failed to create room. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  const inviteLink = `${window.location.origin}/room/${roomCode}`;

  function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    setError('');
    try {
      await getRoom(joinCode.trim().toUpperCase());
      sessionStorage.setItem('roomCode', joinCode.trim().toUpperCase());
      sessionStorage.setItem('playerSlot', 'person2');
      navigate(`/game/${joinCode.trim().toUpperCase()}`);
    } catch (err) {
      setError('Room not found. Check the code and try again.');
      setJoining(false);
    }
  }

  function handleGoToMyRoom() {
    navigate(`/game/${roomCode}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div className="w-full max-w-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>✕</div>
            <h1 className="font-display text-3xl font-bold glow-text"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tic Tac Toe
            </h1>
          </motion.div>
          <p className="text-slate-500 text-sm font-body">Real-time multiplayer</p>
        </div>

        {/* Create Room Card */}
        <motion.div className="glass-card p-6 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>1</div>
            <div>
              <p className="text-slate-400 text-xs font-body uppercase tracking-wider">You are</p>
              <p className="text-white font-semibold font-body">Person 1 (X)</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-4 font-body">Share your room code or invite link with a friend:</p>

          {/* Team Code */}
          <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs mb-1 font-body uppercase tracking-wider">Team Code</p>
                <p className="font-display text-2xl font-bold tracking-widest text-white">{roomCode}</p>
              </div>
              <motion.button
                onClick={() => copyToClipboard(roomCode, 'code')}
                className="px-4 py-2 rounded-lg text-sm font-medium font-body transition-all"
                style={{ background: copied === 'code' ? 'rgba(34,197,94,0.2)' : 'rgba(124,58,237,0.2)', border: '1px solid', borderColor: copied === 'code' ? 'rgba(34,197,94,0.5)' : 'rgba(124,58,237,0.4)', color: copied === 'code' ? '#86efac' : '#a78bfa' }}
                whileTap={{ scale: 0.95 }}
              >
                {copied === 'code' ? '✓ Copied!' : 'Copy Code'}
              </motion.button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-slate-500 text-xs mb-1 font-body uppercase tracking-wider">Invite Link</p>
                <p className="text-blue-400 text-sm font-body truncate">{inviteLink}</p>
              </div>
              <motion.button
                onClick={() => copyToClipboard(inviteLink, 'link')}
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium font-body"
                style={{ background: copied === 'link' ? 'rgba(34,197,94,0.2)' : 'rgba(37,99,235,0.2)', border: '1px solid', borderColor: copied === 'link' ? 'rgba(34,197,94,0.5)' : 'rgba(37,99,235,0.4)', color: copied === 'link' ? '#86efac' : '#60a5fa' }}
                whileTap={{ scale: 0.95 }}
              >
                {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={handleGoToMyRoom}
            className="w-full py-3 rounded-xl font-semibold font-body btn-primary"
            whileTap={{ scale: 0.98 }}
          >
            Enter Game Room →
          </motion.button>
        </motion.div>

        {/* Join Room Card */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>2</div>
            <p className="text-white font-semibold font-body">Already have a Team Code?</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter code (e.g. ABC123)"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              className="flex-1 px-4 py-3 rounded-xl font-display text-lg tracking-widest text-white outline-none font-body uppercase"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.3)', caretColor: '#a78bfa' }}
            />
            <motion.button
              onClick={handleJoin}
              disabled={joining || joinCode.length !== 6}
              className="px-6 py-3 rounded-xl font-semibold font-body btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {joining ? '...' : 'Join'}
            </motion.button>
          </div>

          {error && (
            <motion.p className="mt-3 text-red-400 text-sm font-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ⚠ {error}
            </motion.p>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}

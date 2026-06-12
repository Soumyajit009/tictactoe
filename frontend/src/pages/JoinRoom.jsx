import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRoom } from '../utils/api';

export default function JoinRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function tryJoin() {
      try {
        await getRoom(roomCode.toUpperCase());
        sessionStorage.setItem('roomCode', roomCode.toUpperCase());
        sessionStorage.setItem('playerSlot', 'person2');
        navigate(`/game/${roomCode.toUpperCase()}`);
      } catch {
        navigate('/lobby');
      }
    }
    tryJoin();
  }, [roomCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex gap-2 justify-center mb-4">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-3 h-3 rounded-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </div>
        <p className="text-slate-400 font-body">Joining room <span className="text-white font-display">{roomCode}</span>...</p>
      </motion.div>
    </div>
  );
}

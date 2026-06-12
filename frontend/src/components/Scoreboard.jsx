import React from 'react';
import { motion } from 'framer-motion';

export default function Scoreboard({ scores, round, currentTurn, playerSlot, bothConnected }) {
  const myTurn = (currentTurn === 'X' && playerSlot === 'person1') || (currentTurn === 'O' && playerSlot === 'person2');

  return (
    <motion.div
      className="glass-card p-5 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Round */}
      <div className="text-center mb-4">
        <span className="text-slate-500 text-xs font-body uppercase tracking-widest">Round</span>
        <div className="font-display text-2xl font-bold text-white">{round}</div>
      </div>

      {/* Scores */}
      <div className="flex items-center justify-center gap-4 mb-5">
        {/* Person 1 */}
        <div className={`flex-1 rounded-xl p-3 text-center transition-all duration-300 ${currentTurn === 'X' && bothConnected ? 'ring-2 ring-pink-500/50' : ''}`}
          style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)' }}>
          <p className="text-slate-400 text-xs font-body mb-1">Person 1</p>
          <p className="font-display text-xl font-bold" style={{ color: '#f472b6' }}>✕</p>
          <p className="font-display text-3xl font-black text-white">{scores?.X ?? 0}</p>
          <p className="text-slate-600 text-xs font-body">wins</p>
        </div>

        {/* VS */}
        <div className="text-slate-600 font-display font-bold text-lg">VS</div>

        {/* Person 2 */}
        <div className={`flex-1 rounded-xl p-3 text-center transition-all duration-300 ${currentTurn === 'O' && bothConnected ? 'ring-2 ring-blue-500/50' : ''}`}
          style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <p className="text-slate-400 text-xs font-body mb-1">Person 2</p>
          <p className="font-display text-xl font-bold" style={{ color: '#60a5fa' }}>○</p>
          <p className="font-display text-3xl font-black text-white">{scores?.O ?? 0}</p>
          <p className="text-slate-600 text-xs font-body">wins</p>
        </div>
      </div>

      {/* Turn indicator */}
      {bothConnected && (
        <motion.div
          className="rounded-xl py-2.5 px-4 text-center"
          style={{
            background: myTurn ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
            border: '1px solid',
            borderColor: myTurn ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)',
          }}
          animate={myTurn ? { boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 15px rgba(124,58,237,0.3)', '0 0 0px rgba(124,58,237,0)'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {myTurn ? (
            <p className="text-purple-300 font-semibold text-sm font-body">⚡ Your Turn</p>
          ) : (
            <p className="text-slate-500 text-sm font-body">Waiting for opponent...</p>
          )}
        </motion.div>
      )}

      {!bothConnected && (
        <div className="rounded-xl py-2.5 px-4 text-center"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <motion.p className="text-yellow-400 text-sm font-body"
            animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            ⏳ Waiting for another player...
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}

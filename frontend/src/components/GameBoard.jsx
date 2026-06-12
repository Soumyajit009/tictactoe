import React from 'react';
import { motion } from 'framer-motion';

export default function GameBoard({ board, onCellClick, currentTurn, playerSlot, winningCells, gameOver, bothConnected }) {
  const canPlay = bothConnected &&
    !gameOver &&
    ((currentTurn === 'X' && playerSlot === 'person1') || (currentTurn === 'O' && playerSlot === 'person2'));

  function getCellContent(value) {
    if (value === 'X') {
      return (
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, duration: 0.2 }}
        >
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <line x1="10" y1="10" x2="38" y2="38" stroke="url(#xg)" strokeWidth="6" strokeLinecap="round"/>
            <line x1="38" y1="10" x2="10" y2="38" stroke="url(#xg)" strokeWidth="6" strokeLinecap="round"/>
            <defs>
              <linearGradient id="xg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      );
    }
    if (value === 'O') {
      return (
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, duration: 0.2 }}
        >
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle cx="24" cy="24" r="15" fill="none" stroke="url(#og)" strokeWidth="6" strokeLinecap="round"/>
            <defs>
              <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      );
    }
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-sm mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: gameOver ? 0.95 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,58,237,0.15)' }}>
        {board.map((cell, idx) => {
          const isWin = winningCells.includes(idx);
          const isEmpty = cell === '';
          const clickable = canPlay && isEmpty;

          return (
            <motion.button
              key={idx}
              onClick={() => clickable && onCellClick(idx)}
              className={`
                aspect-square rounded-xl flex items-center justify-center
                transition-all duration-200 select-none
                ${isWin ? 'win-cell' : ''}
                ${clickable ? 'cell-hover cursor-pointer' : 'cursor-default'}
              `}
              style={{
                background: isWin
                  ? undefined
                  : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(124,58,237,0.2)',
                minHeight: '90px',
              }}
              whileTap={clickable ? { scale: 0.92 } : {}}
            >
              {getCellContent(cell)}
              {isWin && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

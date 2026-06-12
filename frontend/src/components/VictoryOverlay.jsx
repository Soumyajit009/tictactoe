import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;
  const colors = ['#7c3aed', '#2563eb', '#a78bfa', '#60a5fa', '#f472b6', '#818cf8'];

  function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  }
  frame();

  // Center burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.5 },
    colors,
    startVelocity: 35,
  });
}

export default function VictoryOverlay({ winner, isDraw, playerSlot }) {
  const show = winner !== null || isDraw;

  useEffect(() => {
    if (show && !isDraw) fireConfetti();
  }, [show, isDraw]);

  if (!show) return null;

  const isMyWin = (winner === 'X' && playerSlot === 'person1') || (winner === 'O' && playerSlot === 'person2');
  const winnerName = winner === 'X' ? 'Person 1' : 'Person 2';

  return (
    <AnimatePresence>
      <motion.div
        className="victory-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isDraw
              ? 'radial-gradient(ellipse at center, rgba(100,116,139,0.3) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 60%)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div
          className="relative glass-card px-12 py-10 text-center max-w-md mx-4"
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {isDraw ? (
            <>
              <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: 2 }}>
                🤝
              </motion.div>
              <h2 className="font-display text-4xl font-black text-slate-300 mb-2">DRAW!</h2>
              <p className="text-slate-500 font-body">Well played by both sides</p>
            </>
          ) : (
            <>
              <motion.div className="text-6xl mb-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.8, repeat: 3 }}>
                🏆
              </motion.div>
              <motion.h2
                className="font-display text-4xl font-black mb-2 glow-text"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {winnerName.toUpperCase()} WINS!
              </motion.h2>
              <p className="text-slate-400 font-body mb-2">
                {isMyWin ? '🎉 That\'s you! Amazing!' : '💪 Better luck next round!'}
              </p>
            </>
          )}

          <motion.div
            className="mt-4 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-slate-600 text-sm font-body">Next round starting...</p>
          </motion.div>

          {/* Sparkle particles */}
          {!isDraw && [0, 1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? '#a78bfa' : '#60a5fa',
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

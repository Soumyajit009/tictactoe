import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TITLE = 'Welcome to Tic Tac Toe';
const SUBTITLE = "Let's invite your friend and enjoy your free time.";

export default function Welcome() {
  const navigate = useNavigate();
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Type title
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTitleText(TITLE.slice(0, i + 1));
      i++;
      if (i === TITLE.length) {
        clearInterval(interval);
        setTitleDone(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Type subtitle after title
  useEffect(() => {
    if (!titleDone) return;
    let i = 0;
    const interval = setInterval(() => {
      setSubtitleText(SUBTITLE.slice(0, i + 1));
      i++;
      if (i === SUBTITLE.length) {
        clearInterval(interval);
        setSubtitleDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [titleDone]);

  // Fade out and navigate after subtitle done
  useEffect(() => {
    if (!subtitleDone) return;
    const timer = setTimeout(() => setFadeOut(true), 1500);
    return () => clearTimeout(timer);
  }, [subtitleDone]);

  useEffect(() => {
    if (!fadeOut) return;
    const timer = setTimeout(() => navigate('/lobby'), 900);
    return () => clearTimeout(timer);
  }, [fadeOut, navigate]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Ambient glow orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', top: '20%', left: '20%' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', bottom: '20%', right: '20%' }}
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Game logo icon */}
          <motion.div
            className="mb-12 relative"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <div className="w-28 h-28 rounded-2xl glass-card flex items-center justify-center" style={{ border: '1px solid rgba(124,58,237,0.5)' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                {/* X */}
                <line x1="8" y1="8" x2="24" y2="24" stroke="url(#xGrad)" strokeWidth="4" strokeLinecap="round"/>
                <line x1="24" y1="8" x2="8" y2="24" stroke="url(#xGrad)" strokeWidth="4" strokeLinecap="round"/>
                {/* O */}
                <circle cx="48" cy="16" r="9" stroke="url(#oGrad)" strokeWidth="4" fill="none"/>
                {/* Grid lines */}
                <line x1="0" y1="36" x2="64" y2="36" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
                <line x1="32" y1="36" x2="32" y2="64" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5"/>
                {/* Bottom cells */}
                <rect x="4" y="40" width="22" height="20" rx="4" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
                <rect x="36" y="40" width="22" height="20" rx="4" fill="rgba(37,99,235,0.15)" stroke="rgba(37,99,235,0.3)" strokeWidth="1"/>
                <defs>
                  <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                  <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))' }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title with typewriter */}
          <div className="text-center max-w-2xl">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 glow-text"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {titleText}
              {!titleDone && (
                <motion.span
                  className="inline-block w-1 ml-1 bg-purple-400"
                  style={{ height: '1em', verticalAlign: 'text-bottom' }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </h1>

            {titleDone && (
              <motion.p
                className="text-lg md:text-xl text-slate-400 font-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {subtitleText}
                {!subtitleDone && (
                  <motion.span
                    className="inline-block w-0.5 ml-0.5 bg-blue-400"
                    style={{ height: '1.2em', verticalAlign: 'text-bottom' }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.p>
            )}
          </div>

          {/* Loading dots */}
          {subtitleDone && (
            <motion.div
              className="mt-16 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

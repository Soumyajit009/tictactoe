import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectionBanner({ person1Connected, person2Connected, playerSlot }) {
  const otherPlayer = playerSlot === 'person1' ? 'Person 2' : 'Person 1';
  const otherConnected = playerSlot === 'person1' ? person2Connected : person1Connected;

  return (
    <AnimatePresence>
      {!otherConnected && (
        <motion.div
          className="w-full rounded-xl py-2.5 px-4 text-center mb-3"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <motion.p
            className="text-yellow-400 text-sm font-body"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⚡ {otherPlayer} disconnected — Waiting for reconnection...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

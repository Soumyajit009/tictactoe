# 🎮 Tic Tac Toe — Real-time Multiplayer

A premium, cosmic-themed real-time multiplayer Tic Tac Toe game built with React, Node.js, Socket.io, and MongoDB.

## Features
- ⚡ Real-time moves via Socket.io
- 🏆 Win detection with confetti & trophy animation
- 🌌 Cosmic glassmorphism UI
- ♾️ Infinite rounds, persistent scores
- 🔄 Refresh recovery (state saved in MongoDB)
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔗 Shareable invite links
- 🔌 Disconnect/reconnect handling

## Quick Start

👉 Read **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for full step-by-step instructions.

### Local development (short version):

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env   # fill in MONGODB_URI
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
cp .env.example .env
npm install
npm start
```

## Tech Stack
- **Frontend:** React 18, Tailwind CSS, Framer Motion, canvas-confetti
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB Atlas
- **Deploy:** Vercel (frontend) + Render (backend)

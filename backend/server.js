require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const Room = require('./models/Room');
const { checkWinner, checkDraw, generateRoomCode } = require('./utils/gameLogic');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// REST: Create Room
app.post('/api/room/create', async (req, res) => {
  try {
    let roomCode;
    let exists = true;
    while (exists) {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    }
    const room = await Room.create({ roomCode });
    res.json({ roomCode: room.roomCode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// REST: Get Room State
app.get('/api/room/:roomCode', async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode.toUpperCase() });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/', (req, res) => res.json({ status: 'Tic Tac Toe backend running 🎮' }));

// Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join Room
  socket.on('join_room', async ({ roomCode, playerSlot }) => {
    try {
      const code = roomCode.toUpperCase();
      let room = await Room.findOne({ roomCode: code });
      if (!room) {
        socket.emit('error', { message: 'Room not found. Check your code.' });
        return;
      }

      socket.join(code);

      // Assign player slot
      if (playerSlot === 'person1') {
        room.players.person1.socketId = socket.id;
        room.players.person1.connected = true;
      } else if (playerSlot === 'person2') {
        room.players.person2.socketId = socket.id;
        room.players.person2.connected = true;
        if (room.status === 'waiting') room.status = 'playing';
      }

      await room.save();

      // Send full state to the joining player
      socket.emit('room_state', room);

      // Notify everyone in room of player status
      io.to(code).emit('player_status', {
        person1Connected: room.players.person1.connected,
        person2Connected: room.players.person2.connected,
        status: room.status,
      });

      console.log(`👤 ${playerSlot} joined room ${code}`);
    } catch (err) {
      socket.emit('error', { message: 'Failed to join room.' });
    }
  });

  // Make Move
  socket.on('make_move', async ({ roomCode, cellIndex, player }) => {
    try {
      const code = roomCode.toUpperCase();
      const room = await Room.findOne({ roomCode: code });
      if (!room) return;

      // Validate turn
      if (room.currentTurn !== player) return;
      if (room.board[cellIndex] !== '') return;
      if (room.status !== 'playing') return;

      // Apply move
      room.board[cellIndex] = player;

      // Check winner
      const result = checkWinner(room.board);
      if (result) {
        room.winner = result.winner;
        room.winningCells = result.cells;
        room.status = 'finished';
        if (result.winner === 'X') room.scores.X += 1;
        else room.scores.O += 1;

        await room.save();
        io.to(code).emit('game_update', room);
        io.to(code).emit('game_over', { winner: result.winner, winningCells: result.cells, isDraw: false });

        // Auto restart after 4 seconds
        setTimeout(async () => {
          await resetBoard(code);
        }, 4000);
        return;
      }

      // Check draw
      if (checkDraw(room.board)) {
        room.winner = 'draw';
        room.status = 'finished';
        await room.save();
        io.to(code).emit('game_update', room);
        io.to(code).emit('game_over', { winner: null, winningCells: [], isDraw: true });

        setTimeout(async () => {
          await resetBoard(code);
        }, 3000);
        return;
      }

      // Switch turn
      room.currentTurn = player === 'X' ? 'O' : 'X';
      await room.save();
      io.to(code).emit('game_update', room);
    } catch (err) {
      console.error('make_move error:', err);
    }
  });

  // Disconnect handling
  socket.on('disconnect', async () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    try {
      // Find which room this socket was in
      const room = await Room.findOne({
        $or: [
          { 'players.person1.socketId': socket.id },
          { 'players.person2.socketId': socket.id },
        ],
      });

      if (!room) return;

      let disconnectedPlayer = null;
      if (room.players.person1.socketId === socket.id) {
        room.players.person1.connected = false;
        disconnectedPlayer = 'person1';
      } else if (room.players.person2.socketId === socket.id) {
        room.players.person2.connected = false;
        disconnectedPlayer = 'person2';
      }

      await room.save();
      io.to(room.roomCode).emit('player_disconnected', { player: disconnectedPlayer });
    } catch (err) {
      console.error('disconnect error:', err);
    }
  });
});

async function resetBoard(roomCode) {
  const room = await Room.findOne({ roomCode });
  if (!room) return;

  room.board = Array(9).fill('');
  room.currentTurn = 'X';
  room.winner = null;
  room.winningCells = [];
  room.status = 'playing';
  room.round += 1;
  await room.save();

  io.to(roomCode).emit('game_update', room);
  io.to(roomCode).emit('round_reset', { round: room.round });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

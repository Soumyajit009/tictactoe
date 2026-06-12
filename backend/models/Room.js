const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  board: {
    type: [String],
    default: Array(9).fill(''),
  },
  currentTurn: {
    type: String,
    enum: ['X', 'O'],
    default: 'X',
  },
  scores: {
    X: { type: Number, default: 0 },
    O: { type: Number, default: 0 },
  },
  round: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting',
  },
  players: {
    person1: { socketId: String, connected: { type: Boolean, default: false } },
    person2: { socketId: String, connected: { type: Boolean, default: false } },
  },
  winner: {
    type: String,
    default: null,
  },
  winningCells: {
    type: [Number],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Room', RoomSchema);

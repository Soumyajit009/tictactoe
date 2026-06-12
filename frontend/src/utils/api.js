const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export async function createRoom() {
  const res = await fetch(`${BACKEND_URL}/api/room/create`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create room');
  return res.json();
}

export async function getRoom(roomCode) {
  const res = await fetch(`${BACKEND_URL}/api/room/${roomCode}`);
  if (!res.ok) throw new Error('Room not found');
  return res.json();
}

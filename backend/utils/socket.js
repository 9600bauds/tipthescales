const socketIo = require('socket.io');
const { FRONTEND_URL } = require('./config');

let io;

function initialize(server) {
  io = socketIo(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (roomName) => {
      // Leave previous room
      for (const room of Array.from(socket.rooms)) {
        if (room !== socket.id) {
          socket.leave(room);
        }
      }
      socket.join(roomName);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Please call initialize first.');
  }
  return io;
}

module.exports = { initialize, getIo };

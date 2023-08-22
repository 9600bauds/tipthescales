const socketIo = require('socket.io');
const { FRONTEND_URL } = require('./config');

const { state } = require('./serverState');

const index = require('../index');

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
    state.activeConnections++;

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
      state.activeConnections--;
      // Check for graceful shutdown
      if (state.shuttingDown && state.activeConnections === 0) {
        console.log('Socket.io integration reached 0 connections. Exiting process...');
        process.exit(0);
      }
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

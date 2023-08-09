const socketIo = require('socket.io');

let io;

function initialize(server) {
  io = socketIo(server);
  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Please call initialize first.');
  }
  return io;
}

module.exports = { initialize, getIo };

const app = require('./app'); // the actual Express application
const config = require('./utils/config');
const http = require('http');
const socket = require('./utils/socket');

const server = http.createServer(app);
socket.initialize(server);

const io = socket.getIo();
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

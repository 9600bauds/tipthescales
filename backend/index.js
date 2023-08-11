const app = require('./app'); // the actual Express application
const config = require('./utils/config');
const http = require('http');
const socketUtil = require('./utils/socket');

const server = http.createServer(app);
socketUtil.initialize(server);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

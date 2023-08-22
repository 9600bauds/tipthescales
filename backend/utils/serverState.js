let state = {
    shuttingDown: false,
    activeConnections: 0
};
  
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received! Current active connections: ', state.activeConnections);

    state.shuttingDown = true;
  
    if (state.activeConnections === 0) {
        process.exit(0);
    }
});

module.exports = { state };
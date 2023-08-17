const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const path = require('path');
const cookieParser = require('cookie-parser');

const roomRouter = require('./controllers/room');
const loginRouter = require('./controllers/login');

const mongoose = require('mongoose');
mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100 // limit each IP to 100 requests per windowMs
});

app.set('trust proxy', 1); //Is this actually necessary? I added it while trying to make fly.io work
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));
app.use(express.static('build'));
app.use(express.json());

app.use(limiter);
app.use(cookieParser());

app.use('/api/login', loginRouter);
app.use('/api/room', roomRouter);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });
 
app.use(middleware.errorHandler);

module.exports = app;
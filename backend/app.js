const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const cookieParser = require('cookie-parser');

const roomRouter = require('./controllers/room');
const loginRouter = require('./controllers/login');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
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

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
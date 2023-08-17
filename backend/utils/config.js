require('dotenv').config();

const PORT = process.env.PORT;

const FRONTEND_URL = process.env.FRONTEND_URL;

const MAX_ROLLS = process.env.MAX_ROLLS;

const DB_URI =
    process.env.NODE_ENV === 'development'
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;

module.exports = {
    DB_URI,
    PORT,
    FRONTEND_URL,
    MAX_ROLLS
};
const mongoose = require('mongoose');
const { transformIdAndV } = require('../utils/transformIdAndV');

const rollSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 64,
    },
    value: {
        type: Number,
        required: true,
    },
    modifier: {
        type: Number,
    },
    sides: {
        type: Number,
        required: true,
        min: 2,
    },
    timestamp: { type: Date, default: Date.now }
});

rollSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        return transformIdAndV(returnedObject);
    },
});

module.exports = rollSchema;

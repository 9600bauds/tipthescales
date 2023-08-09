const mongoose = require('mongoose');

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
    tip: {
        type: Number,
    },
    timestamp: { type: Date, default: Date.now }
});

rollSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = rollSchema;

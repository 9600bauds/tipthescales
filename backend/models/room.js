const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const rollSchema = require('./rollSchema');
const { transformIdAndV } = require('../utils/transformIdAndV');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64,
    },
    hasPassword: { type: Boolean, default: false },
    passwordHash: { type: String },
    rolls: [
        rollSchema
    ]
});

roomSchema.plugin(uniqueValidator);

roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject = transformIdAndV(returnedObject);
        // Never reveal the passwordhash!
        delete returnedObject.passwordHash;
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

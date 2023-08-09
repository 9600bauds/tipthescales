const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const rollSchema = require('./rollSchema');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 64,
    },
    passwordHash: { type: String },
    rolls: [
        rollSchema
    ]
});

roomSchema.plugin(uniqueValidator);

roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // Never reveal the passwordhash!
        delete returnedObject.passwordHash;
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

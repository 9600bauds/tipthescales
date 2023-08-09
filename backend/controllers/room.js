const mongoose = require('mongoose');
const roomRouter = require('express').Router();
const middleware = require('../utils/middleware');
const socket = require('../utils/socket');
const Room = require('../models/room');

roomRouter.get('/:name', async (request, response) => {
    let room = await Room.findOne({ name: request.params.name });
    if (!room) {
        room = new Room({ name: request.params.name });
        await room.save();
    }
    response.json(room);
});

roomRouter.post('/:name/roll', async (request, response) => {
    let room = await Room.findOne({ name: request.params.name });
    if (!room) {
        return response.status(404).json({ error: 'Room not found' });
    }

    const rollValue = Math.floor(Math.random() * 20) + 1; //todo max number should depend on request.body
    const username = request.body.username;
    const newRoll = {
        _id: new mongoose.Types.ObjectId(),
        username,
        value: rollValue
    };

    //We need to use atomic operations to avoid concurrency issues.
    const updateResult = await Room.findOneAndUpdate(
        { name: request.params.name },
        {
            $push: {
                rolls: {
                    $each: [newRoll],
                    $slice: -20
                }
            }
        },
        { new: true }  // Return the updated document
    );

    //const io = socket.getIo();
    //io.to(request.params.roomID).emit('newRoll', newRoll);

    response.json(newRoll);
});

module.exports = roomRouter;
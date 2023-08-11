const mongoose = require('mongoose');
const roomRouter = require('express').Router();
const middleware = require('../utils/middleware');

const sanitizeInput = require('../utils/sanitization');

const socket = require('../utils/socket');

const Room = require('../models/room');
const { transformIdAndV } = require('../utils/transformIdAndV');
const { saveRollToDatabase, createRoll } = require('../utils/rollGenerator');

roomRouter.get('/:name', async (request, response) => {
    let room = await Room.findOne({ name: request.params.name });
    if (!room) {
        room = new Room({ name: request.params.name });
        await room.save();
    }
    response.json(room);
});

roomRouter.post('/:name/roll', async (request, response) => {
    const room = await Room.findOne({ name: request.params.name });
    if (!room) {
        return response.status(404).json({ error: 'Room not found' });
    }

    const sanitizedUsername = sanitizeInput(request.body.username);
    if(!sanitizedUsername){
        return response.status(400).json({ error: 'Username is required' });
    }

    const rollData = {
        ...createRoll(20),
        username: sanitizedUsername
    };

    await saveRollToDatabase(room.name, rollData);

    const rollObj = transformIdAndV(rollData);

    const io = socket.getIo();
    io.to(room.name).emit('newRoll', rollObj);

    response.json(rollObj);
});

module.exports = roomRouter;
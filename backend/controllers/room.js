const roomRouter = require('express').Router();

const sanitizeInput = require('../utils/sanitization');

const socket = require('../utils/socket');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Room = require('../models/room');
const { transformIdAndV } = require('../utils/transformIdAndV');
const { saveRollToDatabase, createRoll } = require('../utils/rollGenerator');

roomRouter.get('/:roomName', async (request, response) => {
    let room = await Room.findOne({ name: request.params.roomName });
    if (!room) {
        room = new Room({ name: request.params.roomName });
        await room.save();
    }
    response.json(room);
});

roomRouter.post('/:roomName/roll', async (request, response) => {
    let room = await Room.findOne({ name: request.params.roomName });
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

    //Rig the result only if the room already has a password set, and the user has a cookie for that
    if(request.body.rollResult && room.passwordHash) {
        const token = request.cookies['auth_' + request.params.roomName];
        if (!token) {
            return response.status(401).json({ error: 'Authorization token not found!' });
        }
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            if (decodedToken.roomName !== request.params.roomName) {
                return response.status(403).json({ error: 'Authorization failed!' });
            }
            rollData.value = request.body.rollResult;
    
        } catch (err) {
            return response.status(403).json({ error: 'Authorization failed!' });
        }
    }

    try {
        await saveRollToDatabase(room.name, rollData);
    } catch (err) {
        console.error('Error saving roll to database:', err.message);
        return response.status(500).json({ error: 'Internal server error while saving roll' });
    }
    
    const rollObj = transformIdAndV(rollData);

    const io = socket.getIo();
    io.to(room.name).emit('newRoll', rollObj);

    response.json(rollObj);
});

module.exports = roomRouter;
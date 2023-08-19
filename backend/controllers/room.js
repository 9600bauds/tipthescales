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
        return response.status(404).json({ error: 'Room not found' });
    }
    response.json(room);
});

roomRouter.put('/:roomName', async (request, response) => {
    const password = sanitizeInput(request.body.password);
    let room = await Room.findOne({ name: request.params.roomName });
    
    if (room) { //Room already exists!
        if(password){
            return response.status(400).json({ error: 'Room already exists' });
        }
        return response.status(200).json(room);
    }

    room = new Room({ name: request.params.roomName });
    if(password){
        const saltRounds = 10;
        room.passwordHash = await bcrypt.hash(password, saltRounds);
        room.hasPassword = true;
    }
    await room.save();
    return response.status(201).json(room);
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
        ...createRoll(request.body.sides),
        modifier: Number(request.body.modifier),
        sides: request.body.sides,
        username: sanitizedUsername,
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
                return response.status(403)
                .cookie('auth_' + request.params.roomName, '', {
                    httpOnly: true,
                    expires: new Date(0),  // Set the expiration date to the past
                }).json({ error: 'Authorization failed! Please refresh.' });
            }
            rollData.value = request.body.rollResult;
    
        } catch (err) {
            return response.status(403)
            .cookie('auth_' + request.params.roomName, '', {
                httpOnly: true,
                expires: new Date(0),  // Set the expiration date to the past
            }).json({ error: 'Authorization failed! Please refresh.' });
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
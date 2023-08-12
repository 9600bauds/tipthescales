const loginRouter = require('express').Router();
const Room = require('../models/room');

const sanitizeInput = require('../utils/sanitization');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/:roomName/verifyCookie', async (request, response) => {
    const token = request.cookies['auth_' + request.params.roomName];
    let isVerified = false;

    if(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            if (decodedToken.roomName === request.params.roomName) {
                isVerified = true;
            }
        } catch (err) {
            console.error('Token verification failed:', err.message);
        }
    }

    // Return a generic response regardless of verification result
    return response.json({ isAuthenticated: isVerified });
});


loginRouter.post('/:roomName', async (request, response) => {
    const saltRounds = 10
    
    const roomName = request.params.roomName;

    let room = await Room.findOne({ name: roomName });
    if (!room) {
        return response.status(404).json({ error: 'Room not found' });
    }

    const inputPw = sanitizeInput(request.body.password);
    if(!inputPw){
        return response.status(401).json({ error: 'Password is required!' });
    }

    if (!room.passwordHash) {
        //Set the room's password here
        room.passwordHash = await bcrypt.hash(inputPw, saltRounds);
        await room.save();
    }
    else {
        const match = await bcrypt.compare(inputPw, room.passwordHash);
        if(!match){
            return response.status(401).json({ error: 'Password incorrect!' });
        }
    }    

    const verificationData = { roomName: roomName };
    const token = jwt.sign(verificationData, process.env.SECRET)

    response.cookie('auth_' + roomName, token, {
        httpOnly: true,
        secure: true,   // requires HTTPS
        sameSite: 'strict',  // Helps to prevent CSRF attacks.
        maxAge: 7  * 24 * 60 * 60 * 1000 // 1 week?
    });

    response.json({ message: 'Logged in!' });
});

module.exports = loginRouter;
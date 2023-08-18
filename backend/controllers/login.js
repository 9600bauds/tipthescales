const loginRouter = require('express').Router();
const Room = require('../models/room');

const sanitizeInput = require('../utils/sanitization');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Endpoint to verify if the user's authentication cookie for the room is valid.
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

// Endpoint to authenticate a user into a room. If the room doesn't have a password, sets one.
loginRouter.post('/:roomName', async (request, response) => {
    const saltRounds = 10
    
    const roomName = request.params.roomName;

    let room = await Room.findOne({ name: roomName });
    if (!room) {
        return response.status(404).json({ error: 'Room not found' });
    }

    if(!room.hasPassword){
        return response.status(401).json({ error: 'Room does not require a password!' });
    }

    const inputPw = sanitizeInput(request.body.password);
    if(!inputPw){
        return response.status(401).json({ error: 'Password is required!' });
    }

    const match = await bcrypt.compare(inputPw, room.passwordHash);
    if(!match){
        return response.status(401).json({ error: 'Password incorrect!' });
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
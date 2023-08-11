const mongoose = require('mongoose');
const roomRouter = require('express').Router();
const middleware = require('../utils/middleware');

const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const socket = require('../utils/socket');

const Room = require('../models/room');
const { transformIdAndV } = require('../utils/transformIdAndV');

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

    const sanitizedUsername = DOMPurify.sanitize(request.body.username);
    if(!sanitizedUsername){
        return response.status(401).json({ error: 'Username is required' });
    }

    const rollValue = Math.floor(Math.random() * 20) + 1; //todo max number should depend on request.body
    
    const rollData = {
        _id: new mongoose.Types.ObjectId(),
        timestamp: new Date(),
        username: sanitizedUsername,
        value: rollValue
    };

    //We need to use atomic operations to avoid concurrency issues.
    const updateResult = await Room.findOneAndUpdate(
        { name: request.params.name },
        {
            $push: {
                rolls: {
                    $each: [rollData],
                    $slice: -20
                }
            }
        },
        { new: true }  // Return the updated document
    );

    const rollObj = transformIdAndV(rollData);

    const io = socket.getIo();
    io.to(room.name).emit('newRoll', rollObj);

    response.json(rollObj);
});

module.exports = roomRouter;
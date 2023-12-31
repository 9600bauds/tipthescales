const mongoose = require('mongoose');
const Room = require('../models/room');
const { MAX_ROLLS } = require("./config");

function getRandomResult(maxValue) {
    return Math.floor(Math.random() * maxValue) + 1;
}

function createRoll(maxValue) {
    return {
        _id: new mongoose.Types.ObjectId(),
        timestamp: new Date(),
        value: getRandomResult(maxValue)
    };
}

async function saveRollToDatabase(roomName, rollData) {
    try {
        // We need to use atomic operations to avoid concurrency issues.
        const updateResult = await Room.findOneAndUpdate(
            { name: roomName },
            {
                $push: {
                    rolls: {
                        $each: [rollData],
                        $slice: -MAX_ROLLS,
                    }
                }
            },
            { new: true }  // Return the updated document
        );
        
        if (!updateResult) {
            throw new Error('Failed to update the room with the new roll!');
        }
        return updateResult;
    } catch (err) {
        console.error('Error saving roll to database:', err.message);
        throw err;
    }
}


module.exports = { getRandomResult, createRoll, saveRollToDatabase };

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import io from 'socket.io-client';

import RollButton from '../components/RollButton';
import NameInput from '../components/NameInput';
import RollList from '../components/RollList';

function Room() {
    const { roomName } = useParams();

    const [rolls, setRolls] = useState([]); // State to store the list of rolls
    const [username, setUsername] = useState(''); // State to store the current username input

    useEffect(() => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        console.log(BACKEND_URL);

        const socket = io.connect(BACKEND_URL);
        socket.emit('joinRoom', roomName);

        // Listen for new rolls
        socket.on('newRoll', (rollData) => {
            addRoll(rollData);
        });

        socket.on('connect_error', (error) => {
            toast.error('Connection error:', error);
        });
        
        socket.on('reconnect', (attemptNumber) => {
            toast.error('Reconnected after', attemptNumber, 'attempts!');
        });

        socket.on('error', (errorData) => {
            toast.error('Socket Error:', errorData.error);
        });

        getInitialRolls();

        return () => {
            socket.disconnect();
        };
    }, [roomName]);

    const addRoll = (newRoll) => {
        const maxRolls = process.env.REACT_APP_MAX_ROLLS;
        setRolls(prevRolls => [...prevRolls, newRoll].slice(-maxRolls));
    };

    const getInitialRolls = async () => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        try {
            const response = await axios.get(`${BACKEND_URL}/api/room/${roomName}`);
            setRolls(response.data.rolls);
        } catch (error) {
            toast.error(`Error fetching rolls: ${error}`);
        }
        
    };

    const handleRollClick = async () => {
        const rollData = {
            username: username,
        };

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        try {
            await axios.post(`${BACKEND_URL}/api/room/${roomName}/roll`, rollData);
        } catch (error) {
            toast.error(`Error making roll: ${error}`);
        }
    };

    return (
        <div>
            <RollList rolls={rolls} />
            <RollButton handleRollClick={handleRollClick} />
            <NameInput username={username} setUsername={setUsername} />
        </div>
    );
}

export default Room;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

        socket.on('error', (errorData) => {
            console.error('Socket Error:', errorData.error);
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

    const getInitialRolls = () => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        fetch(`${BACKEND_URL}/api/room/${roomName}`)
            .then(response => response.json())
            .then(data => setRolls(data.rolls))
            .catch(error => console.error('Error fetching rolls:', error));
    };

    const handleRollClick = () => {
        const rollData = {
            username: username,
        };

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        fetch(`${BACKEND_URL}/api/room/${roomName}/roll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rollData)
        }).catch(error => console.error('Error making roll:', error));
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

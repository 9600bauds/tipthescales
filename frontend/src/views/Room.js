import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import RollButton from '../components/RollButton';
import NameInput from '../components/NameInput';
import RollList from '../components/RollList';

function Room() {
    const { roomName } = useParams();
  
    const [rolls, setRolls] = useState([]); // State to store the list of rolls
    const [username, setUsername] = useState(''); // State to store the current username input
    
    useEffect(() => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        fetch(`${BACKEND_URL}/api/room/${roomName}`)
            .then(response => response.json())
            .then(data => setRolls(data.rolls))
            .catch(error => console.error('Error fetching rolls:', error));
    }, [roomName]);
    
    const addRoll = (newRoll) => {
        console.log(newRoll);
        setRolls(prevRolls => [newRoll, ...prevRolls].slice(0, 20));
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
        })
            .then(response => response.json())
            .then(data => addRoll(data))
            .catch(error => console.error('Error making roll:', error));
    };

    return (
        <div>
            <h1>Welcome to room {roomName}!</h1>
            <RollList rolls={rolls} />
            <RollButton handleRollClick={handleRollClick} />
            <NameInput username={username} setUsername={setUsername} />
        </div>
    );
}

export default Room;

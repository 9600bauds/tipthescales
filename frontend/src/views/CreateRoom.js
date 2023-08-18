import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'react-toastify';

import { getErrorMessage } from '../utils/getErrorMessage';

import './CreateRoom.css';

function CreateRoom() {
    const [password, setPassword] = useState('');
    const { roomName } = useParams();
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            await axios.put(`/api/room/${roomName}`, { password });
    
            try {
                await axios.post(`/api/login/${roomName}`, { password }, { withCredentials: true });
                navigate(`/${roomName}`);
            } catch (error) {
                toast.error(`Could not log in: ${getErrorMessage(error)}`);
            }
            
        } catch (error) {
            toast.error(`Could not create room: ${getErrorMessage(error)}`);
        }
    };
    

    return (
        <div className="create-room-container">
            <h2>Create Room {roomName}:</h2>
            <div>
                <div className="explanation-text">
                    <p>Optional: Add a password for this room.</p>
                    <p>If the room has a password, then anyone who knows the password will be able to cheat rolls.</p>
                    <p>The password may not be changed or recovered after the room has been created.</p>
                    <p>Leave blank for a completely fair room.</p>
                    <input
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password... (optional)"
                    />
                </div>
            </div>
            <button onClick={handleCreate}>Create Room</button>
        </div>
    );
}

export default CreateRoom;

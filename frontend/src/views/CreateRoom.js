import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

import { getErrorMessage } from '../utils/getErrorMessage';

import './CreateRoom.css';

function CreateRoom(props) {
    const roomName = props.roomName;

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            const response = await axios.put(`/api/room/${encodeURIComponent(roomName)}`, { password });
            const newRoom = response.data;
            props.setRoomData(newRoom);
            props.setRoomExists(true);
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
            <div className="explanation-text">
                <p className='mt-3'>After creating the room, invite people by giving them this URL ({window.location.host}/{roomName}).</p>
            </div>
            
        </div>
    );
}

CreateRoom.propTypes = {
    roomName: PropTypes.string.isRequired,
    setRoomData: PropTypes.func.isRequired,
    setRoomExists: PropTypes.func.isRequired
};

export default CreateRoom;

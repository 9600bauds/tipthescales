import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getErrorMessage } from '../utils/getErrorMessage';

import Room from './Room';
import CreateRoom from './CreateRoom';

function RoomResolver() {
    const { roomName } = useParams();
    const [ roomExists, setRoomExists ] = useState(null);
    const [ roomData, setRoomData ] = useState(null);
  
    useEffect(() => {
        // Check if the room exists using an API call or other logic
        axios.get(`/api/room/${encodeURIComponent(roomName)}`)
            .then((response) => {
                setRoomExists(true);
                setRoomData(response.data);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setRoomExists(false);
                }
                else{
                    toast.error(`Error fetching data: ${getErrorMessage(error)}`);
                }
            });
    }, [roomName]);
  
    if (roomExists === null) return (<div>Loading...</div>);
    if (roomExists) return <Room room={roomData} />;
    return <CreateRoom roomName={roomName} setRoomData={setRoomData} setRoomExists={setRoomExists} />;
}
export default RoomResolver;
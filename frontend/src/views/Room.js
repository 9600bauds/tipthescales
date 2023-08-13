import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import io from 'socket.io-client';

import NameInput from '../components/NameInput';
import RollList from '../components/RollList';

import RollPanelFair from '../components/RollPanelFair';
import RollPanelRigged from '../components/RollPanelRigged';

function Room() {
    const { roomName } = useParams();

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const [rolls, setRolls] = useState([]); // State to store the list of rolls
    const [username, setUsername] = useState(''); // State to store the current username input

    const getErrorMessage = (error) => {
        //evil .data witchery
        return error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message;
    };

    useEffect(() => {
        const socket = io.connect('/');
        socket.emit('joinRoom', roomName);

        // Listen for new rolls
        socket.on('newRoll', (rollData) => {
            addRoll(rollData);
        });

        socket.on('connect_error', (error) => {
            toast.error('Connection error:', getErrorMessage(error));
        });

        socket.on('reconnect', (attemptNumber) => {
            toast.error('Reconnected after', attemptNumber, 'attempts!');
        });

        socket.on('error', (error) => {
            toast.error('Socket Error:', getErrorMessage(error));
        });

        getInitialRolls();
        initialAuthentication();

        return () => {
            socket.disconnect();
        };
    }, [roomName]);

    const addRoll = (newRoll) => {
        const maxRolls = process.env.REACT_APP_MAX_ROLLS;
        setRolls(prevRolls => [...prevRolls, newRoll].slice(-maxRolls));
    };

    const getInitialRolls = async () => {
        try {
            const response = await axios.get(`/api/room/${roomName}`);
            setRolls(response.data.rolls);
        } catch (error) {
            toast.error(`Error fetching rolls: ${getErrorMessage(error)}`);
        }
    };

    const initialAuthentication = async () => {
        axios.post(`/api/login/${roomName}/verifyCookie`, { roomName }, { withCredentials: true })
            .then(response => {
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(error => {
                toast.error(`An unexpected error occurred: ${getErrorMessage(error)}`);
            });
    };


    const authenticateFunc = async (password) => {
        axios.post(`/api/login/${roomName}`, { password }, { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
            })
            .catch(error => {
                setIsAuthenticated(false);
                toast.error(`Could not log in: ${getErrorMessage(error)}`);
            });
    };

    return (
        <div>
            Welcome to {process.env.FRONTEND_URL}!
            <RollList rolls={rolls} />

            <NameInput username={username} setUsername={setUsername} />
            {
                isAuthenticated
                    ? <RollPanelRigged username={username} roomName={roomName} />
                    : <RollPanelFair username={username} roomName={roomName} authenticateFunc={authenticateFunc} />
            }
        </div>
    );
}

export default Room;

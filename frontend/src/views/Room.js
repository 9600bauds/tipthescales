import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import io from 'socket.io-client';

import LoginPanel from '../components/LoginPanel';
import NameInput from '../components/NameInput';
import ModifierInput from '../components/ModifierInput';
import DiceSidesInput from '../components/DiceSidesInput';

import RollList from '../components/RollList';

import RollPanelFair from '../components/RollPanelFair';
import RollPanelRigged from '../components/RollPanelRigged';

import './Room.css';

function Room() {
    const { roomName } = useParams();

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const [rolls, setRolls] = useState([]); // State to store the list of rolls
    const [username, setUsername] = useState(''); // State to store the current username input

    const [modifier, setModifier] = useState(0); // Rolls will be modified by this amount
    const [sides, setSides] = useState(20); // How many sides does the dice have?

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
        setRolls(prevRolls => [newRoll, ...prevRolls].slice(0, maxRolls));
    };

    const getInitialRolls = async () => {
        try {
            const response = await axios.get(`/api/room/${roomName}`);
            setRolls(response.data.rolls.reverse());
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
        <div className="container mt-5">
            {/* Username and login panel */}
            <div className="row">
                <div className="col-md-6">
                    Username:
                    <NameInput username={username} setUsername={setUsername} />
                </div>
                <div className="col-md-6">
                    {
                        isAuthenticated
                            ? null  // No authentication panel if already authenticated
                            : <LoginPanel authenticateFunc={authenticateFunc} />
                    }
                </div>
            </div>

            {/* Dice setting panel  */}
            <div className="row mt-3">
                <div className="col-md-6">
                    Dice sides:
                    <DiceSidesInput sides={sides} setSides={setSides} />
                </div>
                <div className="col-md-6">
                    Modifier:
                    <ModifierInput modifier={Number(modifier)} setModifier={setModifier} />
                </div>
            </div>

            {/* Roll button and 'rigging' mechanism */}
            <div className="row mt-3">
                <div className="col-md-12">
                    {
                        isAuthenticated
                            ? <RollPanelRigged username={username} roomName={roomName} sides={sides} modifier={Number(modifier)} />
                            : <RollPanelFair username={username} roomName={roomName} sides={sides} modifier={Number(modifier)} />
                    }
                </div>
            </div>

            {/* Recent rolls */}
            <div className="row mt-3">
                <div className="col-md-12">
                    <h2>Recent Rolls</h2>
                    <RollList rolls={rolls} />
                </div>
            </div>
        </div>
    );
}

export default Room;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import io from 'socket.io-client';

import PasswordInput from '../components/PasswordInput';
import NameInput from '../components/NameInput';
import ModifierInput from '../components/ModifierInput';
import DiceSidesInput from '../components/DiceSidesInput';

import RollList from '../components/RollList';

import RollPanelFair from '../components/RollPanelFair';
import RollPanelRigged from '../components/RollPanelRigged';

import { getErrorMessage } from '../utils/getErrorMessage';

import Modal from 'bootstrap/js/dist/modal';

import './Room.css';

function Room() {
    const { roomName } = useParams();
    const navigate = useNavigate();

    const passwordModalRef = useRef(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roomHasPassword, setRoomHasPassword] = useState(false);

    const [rolls, setRolls] = useState([]); // State to store the list of rolls

    const [username, setUsername] = useState(''); // State to store the current username input
    const [modifier, setModifier] = useState(0); // Rolls will be modified by this amount
    const [sides, setSides] = useState(20); // How many sides does the dice have?

    useEffect(() => {
        passwordModalRef.current = new Modal(document.getElementById('passwordModal'), {});

        getInitialData();

        const socket = io.connect('/', { transports: ['websocket'] });
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

        return () => {
            socket.disconnect();
        };
    }, [roomName]);

    const getInitialData = async () => {
        try {
            const roomResponse = await axios.get(`/api/room/${roomName}`);
            const room = roomResponse.data;

            setRolls(room.rolls.reverse());

            if(room.hasPassword){
                setRoomHasPassword(true);
                const verificationResponse = await axios.post(`/api/login/${roomName}/verifyCookie`, { roomName }, { withCredentials: true });
                if(verificationResponse.data.isAuthenticated){
                    setIsAuthenticated(true);
                }
                else{
                    passwordModalRef.current.show();
                }
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                navigate(`/${roomName}/create`); //Send the user straight to the "create" page
                return;
            }
            toast.error(`Error fetching data: ${getErrorMessage(error)}`);
        }
    };

    const addRoll = (newRoll) => {
        const maxRolls = process.env.REACT_APP_MAX_ROLLS;
        setRolls(prevRolls => [newRoll, ...prevRolls].slice(0, maxRolls));
    };

    const authenticateFunc = async (password) => {
        axios.post(`/api/login/${roomName}`, { password }, { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
                passwordModalRef.current.hide();
            })
            .catch(error => {
                setIsAuthenticated(false);
                toast.error(`Could not log in: ${getErrorMessage(error)}`);
            });
    };

    return (
        <div className="container mt-5">
            <div className="modal fade" id="passwordModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p>This is a passworded room.</p>
                            <p>Any user that knows the password may <b>cheat</b> and alter their own rolls.</p>
                            <p>If you don&apos;t agree to this, please make a new room and use that instead.</p>
                            <p>You may continue without the password, but your rolls will be fair.</p>
                        </div>
                        <div className="modal-footer">
                            <PasswordInput authenticateFunc={authenticateFunc} />
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md">
                    Username:
                    <NameInput username={username} setUsername={setUsername} />
                </div>
                <div className="col-md">
                    Dice sides:
                    <DiceSidesInput sides={sides} setSides={setSides} />
                </div>
                <div className="col-md">
                    Modifier:
                    <ModifierInput modifier={Number(modifier)} setModifier={setModifier} />
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-12">
                    {
                        isAuthenticated
                            ? <RollPanelRigged username={username} roomName={roomName} sides={sides} modifier={Number(modifier)} />
                            : <RollPanelFair username={username} roomName={roomName} sides={sides} modifier={Number(modifier)} />
                    }
                </div>
            </div>

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

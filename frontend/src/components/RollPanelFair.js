import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

import LoginPanel from '../components/LoginPanel';

function RollPanelFair(props) {

    const handleRollClick = async () => {
        if(!props.username){
            return toast.error('Username is required!');
        }

        const rollData = {
            username: props.username,
        };

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        try {
            await axios.post(`${BACKEND_URL}/api/room/${props.roomName}/roll`, rollData, { withCredentials: true });
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.error 
                ? error.response.data.error 
                : error.message;
            toast.error(`Error making roll: ${errorMessage}`);
        }
    };

    return (
        <div>
            <button onClick={handleRollClick}>
                Roll D20
            </button>
            <LoginPanel authenticateFunc={props.authenticateFunc} />
        </div>
    );
}

RollPanelFair.propTypes = {
    username: PropTypes.string,
    roomName: PropTypes.string.isRequired,
    authenticateFunc: PropTypes.func.isRequired,
};

export default RollPanelFair;

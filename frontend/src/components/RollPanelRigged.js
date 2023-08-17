import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

import RollButton from './RollButton';

function RollPanelRigged(props) {
    const [rollResult, setRollResult] = useState(null);
    
    const handleRollClick = async () => {
        if (!props.username) {
            return toast.error('Username is required!');
        }

        const simulatedRoll = Math.floor(Math.random() * 20) + 1;  
        setRollResult(simulatedRoll);
    };

    const handleIncrement = () => {
        setRollResult(rollResult + 1);
    };

    const handleDecrement = () => {
        setRollResult(rollResult - 1);
    };

    const handleConfirmClick = async () => {
        const rollData = {
            username: props.username,
            rollResult: rollResult,
            sides: props.sides,
            modifier: props.modifier,
        };

        try {
            await axios.post(`/api/room/${props.roomName}/roll`, rollData, { withCredentials: true });
            setRollResult(null);  // Reset the roll result after confirmation
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.error 
                ? error.response.data.error 
                : error.message;
            toast.error(`Error making roll: ${errorMessage}`);
        }
    };

    return (
        <span id='rollPanelRigged'>
            {rollResult === null ? (
                <RollButton sides={props.sides} modifier={props.modifier} onClick={handleRollClick} />
            ) : (
                <span>
                    <button onClick={handleDecrement}>-</button>
                    {rollResult}
                    <button onClick={handleIncrement}>+</button>
                    <button onClick={handleConfirmClick}>Confirm</button>
                </span>
            )}
        </span>
    );
}

RollPanelRigged.propTypes = {
    username: PropTypes.string,
    roomName: PropTypes.string.isRequired,
    sides: PropTypes.number.isRequired,
    modifier: PropTypes.number,
};

export default RollPanelRigged;
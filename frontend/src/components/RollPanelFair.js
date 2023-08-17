import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

import RollButton from './RollButton';

function RollPanelFair(props) {

    const handleRollClick = async () => {
        if(!props.username){
            return toast.error('Username is required!');
        }

        const rollData = {
            username: props.username,
            sides: props.sides,
            modifier: props.modifier,
        };

        try {
            await axios.post(`/api/room/${props.roomName}/roll`, rollData, { withCredentials: true });
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.error 
                ? error.response.data.error 
                : error.message;
            toast.error(`Error making roll: ${errorMessage}`);
        }
    };

    return (
        <span>
            <RollButton sides={props.sides} modifier={props.modifier} onClick={handleRollClick} />
        </span>
    );
}

RollPanelFair.propTypes = {
    username: PropTypes.string,
    roomName: PropTypes.string.isRequired,
    sides: PropTypes.number.isRequired,
    modifier: PropTypes.number,
};

export default RollPanelFair;

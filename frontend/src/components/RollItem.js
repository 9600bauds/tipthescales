import React from 'react';
import PropTypes from 'prop-types';

import { formatModifier } from '../utils/formatting';

function RollItem(props) {
    const roll = props.roll; 
    if(roll.modifier && roll.modifier != 0){
        return (
            <div className='roll'>
                <span className='username'>{roll.username}</span>: <span className='total'>{roll.value+roll.modifier}</span> <span className='info'>(1d{roll.sides}, {roll.value}{formatModifier(props.roll.modifier)})</span>
            </div>
        );
    }
    else{
        return (
            <div className='roll'>
                <span className='username'>{roll.username}</span>: <span className='total'>{roll.value}</span> <span className='info'>(1d{roll.sides})</span>
            </div>
        );
    }
}

RollItem.propTypes = {
    roll: PropTypes.shape({
        username: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        sides: PropTypes.number.isRequired,
        modifier: PropTypes.number,
    }).isRequired
};

export default RollItem;

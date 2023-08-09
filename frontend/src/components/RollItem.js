import React from 'react';
import PropTypes from 'prop-types';

function RollItem(props) {
    return (
        <div>
            <strong>{props.roll.username}</strong>: {props.roll.value}
        </div>
    );
}

RollItem.propTypes = {
    roll: PropTypes.shape({
        username: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
    }).isRequired
};

export default RollItem;

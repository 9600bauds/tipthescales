import React from 'react';
import PropTypes from 'prop-types';

function RollButton(props) {

    return (
        <button onClick={props.handleRollClick}>
            Roll D20
        </button>
    );
}

RollButton.propTypes = {
    handleRollClick: PropTypes.func
};

export default RollButton;

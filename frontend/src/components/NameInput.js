import React from 'react';
import PropTypes from 'prop-types';

function NameInput(props) {
    const handleChange = (event) => {
        props.setUsername(event.target.value);
    };

    return (
        <span id='usernameInput'>
            <input
                type="text"
                value={props.username}
                onChange={handleChange}
                maxLength={64}
            />
        </span>
    );
}

NameInput.propTypes = {
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired
};

export default NameInput;

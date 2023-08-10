import React from 'react';
import PropTypes from 'prop-types';

function NameInput(props) {
    const handleChange = (event) => {
        props.setUsername(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={props.username}
                onChange={handleChange}
                maxLength={64}
            />
        </div>
    );
}

NameInput.propTypes = {
    username: PropTypes.string,
    setUsername: PropTypes.func
};

export default NameInput;

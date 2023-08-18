import React, { useState } from 'react';
import PropTypes from 'prop-types';

function PasswordInput(props) {
    const [password, setPassword] = useState('');


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const submitClicked = () => {
        props.authenticateFunc(password);
    };

    return (
        <span id='passwordInput'>
            <input 
                type="password" 
                placeholder="Enter password... (Optional)" 
                value={password}
                onChange={handlePasswordChange} 
            />
            <button onClick={submitClicked}>Submit</button>
        </span>
    );
}

PasswordInput.propTypes = {
    authenticateFunc: PropTypes.func,
};

export default PasswordInput;

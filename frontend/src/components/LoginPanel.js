import React, { useState } from 'react';
import PropTypes from 'prop-types';

function LoginPanel(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [password, setPassword] = useState('');

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const submitClicked = () => {
        props.authenticateFunc(password);
    };

    return (
        <div>
            {isExpanded ? (
                <div>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={handlePasswordChange} 
                    />
                    <button onClick={submitClicked}>Submit</button>
                </div>
            ) : (
                <span onClick={handleExpand}>Login</span>
            )}
        </div>
    );
}

LoginPanel.propTypes = {
    authenticateFunc: PropTypes.func,
};

export default LoginPanel;

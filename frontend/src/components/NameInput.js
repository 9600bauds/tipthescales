import React, { useState } from 'react';

function NameInput() {
    const [username, setUsername] = useState(''); // Local state to store the current input

    const handleChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={handleChange}
                placeholder="Enter your name..."
                maxLength={64}
            />
        </div>
    );
}

export default NameInput;

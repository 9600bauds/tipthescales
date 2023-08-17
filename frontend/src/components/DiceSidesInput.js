import React from 'react';
import PropTypes from 'prop-types';

function DiceSidesInput(props) {
    const handleChange = (event) => {
        props.setSides(event.target.value);
    };

    return (
        <span>
            <input
                type="number"
                value={props.sides}
                onChange={handleChange}
                min="2"
                max="1000"
            />
        </span>
    );
}

DiceSidesInput.propTypes = {
    sides: PropTypes.number.isRequired,
    setSides: PropTypes.func.isRequired
};

export default DiceSidesInput;

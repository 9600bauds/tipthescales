import React from 'react';
import PropTypes from 'prop-types';

function ModifierInput(props) {
    const handleChange = (event) => {
        props.setModifier(event.target.value);
    };

    return (
        <span>
            <input
                type="number"
                value={props.modifier}
                onChange={handleChange}
                min="-20"
                max="20"
            />
        </span>
    );
}

ModifierInput.propTypes = {
    modifier: PropTypes.number.isRequired,
    setModifier: PropTypes.func.isRequired
};

export default ModifierInput;

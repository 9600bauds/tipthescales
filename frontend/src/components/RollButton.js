import React from 'react';
import PropTypes from 'prop-types';

import { formatModifier } from '../utils/formatting';

function RollButton(props) {    
    return (
        <span>
            <button onClick={props.onClick}>
                {`Roll a D${props.sides}${formatModifier(props.modifier)}`}
            </button>
        </span>
    );
}

RollButton.propTypes = {
    sides: PropTypes.number.isRequired,
    modifier: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default RollButton;

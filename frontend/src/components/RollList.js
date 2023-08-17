import React from 'react';
import PropTypes from 'prop-types';
import RollItem from './RollItem';


function RollList(props) {
    return (
        <div id='rollList'>
            {props.rolls.map(roll =>
                <RollItem key={roll.id} roll={roll} />
            )}
        </div>
    );
}

RollList.propTypes = {
    rolls: PropTypes.arrayOf(
        PropTypes.shape({
            username: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            sides: PropTypes.number.isRequired,
            modifier: PropTypes.number,
        })
    ).isRequired
};

export default RollList;

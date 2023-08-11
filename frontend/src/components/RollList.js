import React from 'react';
import PropTypes from 'prop-types';
import RollItem from './RollItem';


function RollList(props) {
    return (
        <div>
            <h2>Recent Rolls</h2>
            {props.rolls.map(roll =>
                // Use RollItem once defined
                <RollItem key={roll.id} roll={roll} />
            )}
        </div>
    );
}

RollList.propTypes = {
    rolls: PropTypes.arrayOf(
        PropTypes.shape({
            username: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })
    ).isRequired
};

export default RollList;

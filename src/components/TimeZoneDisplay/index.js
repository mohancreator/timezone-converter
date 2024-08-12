import React from 'react';
import moment from 'moment-timezone';
import './index.css';

const TimeZoneDisplay = ({ timeZone, referenceTime, onDelete, timeFormat }) => {
    const formattedTime = referenceTime.tz(timeZone).format(timeFormat === '24' ? 'HH:mm' : 'hh:mm A');
    const formattedDate = referenceTime.tz(timeZone).format('YYYY-MM-DD'); // Add date formatting if needed

    return (
        <div className='time-zone-display'>
            <div>
                <h3>{timeZone}</h3>
                <p>{formattedTime}</p>
                <p>{formattedDate}</p> {/* Add date display */}
            </div>
            <button className='delete-button' onClick={onDelete}>Delete</button>
        </div>
    );
};

export default TimeZoneDisplay;

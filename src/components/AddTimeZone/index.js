import React, { useState } from 'react';
import './index.css';

const AddTimeZone = ({ onAdd }) => {
    const [newTimeZone, setNewTimeZone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTimeZone && onAdd) {
            onAdd(newTimeZone);
            setNewTimeZone(''); // Clear the input field
        }
    };

    return (
        <form className='add-timezone' onSubmit={handleSubmit}>
            <input
                className='add-timezone-input'
                type="text"
                value={newTimeZone}
                onChange={(e) => setNewTimeZone(e.target.value)}
                placeholder="Enter time zone like Asia/Kolkata)"
                required
            />
            <button className='add-timezone-button' type="submit">Add Time Zone</button>
        </form>
    );
};

export default AddTimeZone;

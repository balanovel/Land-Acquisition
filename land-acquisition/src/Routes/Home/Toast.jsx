import React from 'react';
import './Toast.css';

function Toast({ visible, data, style }) {
    if (!visible) return null;

    // Handle clicks on toast sections (optional)
    const handleClick = (section) => {
        console.log(`${section} section clicked`); // Replace with actual functionality
    };

    return (
        <div className="toast" style={style}>
            <div
                className="toast-section pending"
                onClick={() => handleClick('Pending')}
            >
                <strong>Pending:</strong> {data.pending}
            </div>
            <div
                className="toast-section completed"
                onClick={() => handleClick('Completed')}
            >
                <strong>Completed:</strong> {data.completed}
            </div>
            <div
                className="toast-section cancelled"
                onClick={() => handleClick('Cancelled')}
            >
                <strong>Cancelled:</strong> {data.cancelled}
            </div>
        </div>
    );
}

export default Toast;

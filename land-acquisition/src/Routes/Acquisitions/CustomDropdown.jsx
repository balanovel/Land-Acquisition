import React, { useState, useEffect } from 'react';
import './Acquisitions.css'; // Import the CSS file for styling

const CustomDropdown = ({ options, onSelect, taskName, initialValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);

    // Set the initial value once on mount
    useEffect(() => {
        if (initialValue) {
            setSelectedIcon(initialValue.icon);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        setSelectedIcon(option.icon);
        onSelect(option.value, taskName); // Notify the parent of the selected value and task name
        if (onChange) {
            onChange(option.value, taskName); // Notify any additional change handler
        }
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown">
            <button type="button" className="dropdown-btn" onClick={handleToggle}>
                {selectedIcon ? <img src={selectedIcon} alt="Selected" /> : ''}
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => handleSelect(option)}
                            title={option.label} // Tooltip text
                        >
                            <img src={option.icon} alt={option.value} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;

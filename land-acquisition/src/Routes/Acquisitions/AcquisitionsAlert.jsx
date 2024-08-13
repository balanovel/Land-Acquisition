import React, { useState } from 'react';
import styled, { css } from 'styled-components';

// Styled container for the alert modal
const AlertContainer = styled.div`
  position: absolute;
  top: 10%;
  right: 30%;
  background-color: #06545c;
  height: 50vh;
  width: 40%;
  transform: translateX(100%); /* Hidden by default (off-screen) */
  opacity: 0; /* Hidden by default (invisible) */
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${(props) =>
        props.show &&
        css`
      transform: translateX(0); /* Slide in */
      opacity: 1; /* Fade in */
    `}
`;

function AcquisitionsAlert({
    showModal,
    color,
    setShowModal,
    updateColor,
    settinName,
    taskStatus
}) {
    // Handle color update action
    const handleUpdateColor = () => {
        updateColor(color, settinName); // Call updateColor function with the selected color and task name
        setShowModal(false);
    };

    return (
        <AlertContainer show={showModal}>
            <h1>{taskStatus}</h1>
            <h2>Are you sure you want to update the color?</h2>
            <button onClick={() => setShowModal(false)}>Close</button>
            <button onClick={handleUpdateColor}>Update</button>
        </AlertContainer>
    );
}

export default AcquisitionsAlert;
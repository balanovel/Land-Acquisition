import React from 'react'
import styled, { css } from 'styled-components';
import { logout } from '../Sourcing/SourcingAPI';
import { useNavigate } from 'react-router';

// Styled container for the chat
const ProfileUser = styled.div`
    position: absolute;
    top: 10%;
    right: 20%;
    border-radius: 1rem;
    background-color: #06545c;
    height: 10rem;
    width: 19%;
    transform: translateX(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;

`;

function Notifications({ showNotifications, setShowNotifications }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowNotifications(false)
        logout()
            .then((res) => {
                console.log(res);

                if (res === true) {
                    navigate('/')
                }
            })

    }

    const handleCancel = () => {
        setShowNotifications(false)
    }

    return (
        <ProfileUser show={showNotifications}>
            <h2>Are you Sure..?</h2>

        </ProfileUser>
    )
}

export default Notifications
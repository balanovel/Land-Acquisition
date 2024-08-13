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

function UserProfile({ showUser, setShowUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowUser(false)
        logout()
            .then((res) => {
                console.log(res);

                if (res === true) {
                    navigate('/')
                }
            })

    }

    const handleCancel = () => {
        setShowUser(false)
    }

    return (
        <ProfileUser show={showUser}>
            <h2>Are you Sure..?</h2>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </ProfileUser>
    )
}

export default UserProfile
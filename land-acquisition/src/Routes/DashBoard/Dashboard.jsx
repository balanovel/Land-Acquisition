import React, { useState } from 'react'
import GanttChart from './GanttChart'
import './Gantt.css'
import { IoMdHome } from 'react-icons/io'
import { HiBellAlert } from 'react-icons/hi2'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { Navigate, useNavigate } from 'react-router-dom'
import Notifications from '../UserProfile/Notifications'
import UserProfile from '../UserProfile/UserProfile'

function Dashboard() {
    const navigate = useNavigate()
    const [showUser, setShowUser] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const handleHomeClick = () => {
        navigate('../home')
    }
    // Logout component
    const handleUser = () => (
        setShowUser(!showUser)
    )
    const handleNotification = () => (
        setShowNotifications(!showNotifications)
    )
    return (
        <div style={{ background: '#c8e5e9', color: 'black', height: '100vh' }}>
            <IoMdHome className='icon icon-left' onClick={handleHomeClick} />
            <div style={{ padding: '1rem' }}>
                <h4 className='screen_head'>DashBoard</h4>
            </div>
            <HiBellAlert className='icon icon-right-notification' onClick={handleNotification} />
            <IoPersonCircleOutline className='icon icon-right-profile' onClick={handleUser} />
            <GanttChart />
            {showNotifications && <Notifications />}
            {showUser && <UserProfile showUser={showUser} setShowUser={setShowUser} />}
        </div>
    )
}

export default Dashboard
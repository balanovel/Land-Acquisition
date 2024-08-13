import React, { useEffect, useState } from 'react'
import { getData } from '../Acquisitions/AcquisitionsApi';
import ProjectCards from '../Acquisitions/AcquisitionsCards';
import { HiBellAlert } from 'react-icons/hi2';
import { IoMdHome } from 'react-icons/io';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Notifications from '../UserProfile/Notifications';
import UserProfile from '../UserProfile/UserProfile';

export default function Construction() {
  const [project, setProject] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleHomeClick = () => {
    navigate('/home');
  };
  const handleRedirect = () => {
    navigate('/home/analysis')
    console.log('hell');
  }

  // Logout component
  const handleUser = () => (
    setShowUser(!showUser)
  )

  const handleNotification = () => (
    setShowNotifications(!showNotifications)
  )

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let res = await getData();
    let data = res.data.message;
    setProject(data)
    console.log('API Response:', data);
  }

  return (
    <div>
      <div className='acquisitions'>
        <IoMdHome className='icon icon-left' onClick={handleHomeClick} />
        <div style={{ padding: '1rem' }}>
          <h4 className='screen_head'>Construction</h4>
        </div>
        <HiBellAlert className='icon icon-right-notification' onClick={handleNotification} />
        <IoPersonCircleOutline className='icon icon-right-profile' onClick={handleUser} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: '2rem'
      }}>
        <div className="card1" style={{
          background: "linear-gradient(90deg, #026d78ff, #359cabff, #026d78ff)",
          height: "5rem",
          width: "12rem",
          border: "2px solid #529fa9",
          borderRadius: "1rem",
          fontSize: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer"
        }} onClick={handleRedirect}>Analysis</div>
        <div className="card1" style={{
          backgroundColor: "white",
          height: "5rem",
          width: "12rem",
          border: "2px solid #529fa9",
          borderRadius: "1rem",
          fontSize: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#27c6db",
          cursor: "pointer"
        }}>Active</div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '3rem'
      }}>
      </div>
      <ProjectCards projects={project} />
      {showNotifications && <Notifications />}
      {showUser && <UserProfile showUser={showUser} setShowUser={setShowUser} />}
    </div>
  )
}

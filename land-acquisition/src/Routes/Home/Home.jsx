import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { TbWorldSearch } from 'react-icons/tb';
import { FaRegEdit, FaClipboardList, FaFileSignature, FaHandHoldingUsd, FaCalculator, FaMoneyCheckAlt, FaChartPie, FaSearch } from 'react-icons/fa';
import { IoBasket } from "react-icons/io5";
import { HiBellAlert } from "react-icons/hi2";
import { GiCargoCrane, GiPaintBrush } from 'react-icons/gi';
import { IoMdHome } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { fetchSourcingCount, fetchScreeningCount, fetchAnalysisCount, fetchActiveCount } from './HomeAPI';
import './Home.css';
import UserProfile from '../UserProfile/UserProfile';
import Notifications from '../UserProfile/Notifications';

const initialCardsData = [
    { name: 'Sourcing', count: 'Loading...', icon: TbWorldSearch, data: {}, active: true },
    { name: 'Screening', count: 'Loading...', icon: FaClipboardList, data: {}, active: true },
    { name: 'Analysis', count: 'Loading...', icon: FaRegEdit, data: {}, active: true },
    { name: 'Construction', count: 'Loading...', icon: GiCargoCrane, active: true },
    { name: 'Design', count: 'Loading...', icon: GiPaintBrush, active: true },
    { name: 'Legal', count: '0', icon: FaFileSignature, active: false, className: 'legal' },
    { name: 'Marketing', count: 'Loading...', icon: IoBasket, active: true },
    { name: 'Acquisition', count: 'Loading...', icon: FaHandHoldingUsd, active: true },
    { name: 'Lending', count: '0', icon: FaMoneyCheckAlt, active: false, className: 'lending' },
    { name: 'Account', count: '0', icon: FaCalculator, active: false, className: 'account' },
    { name: 'Dashboard', count: '120', icon: FaChartPie, active: true },
];

function Card({ name, count, icon: Icon, link, className, data }) {
    const isSourcing = name === 'Sourcing';
    const isScreening = name === 'Screening';
    const isLegal = name === 'Legal';
    const isLending = name === 'Lending';
    const isAccount = name === 'Account';


    const cardRef = useRef(null);

    return (
        <Link
            to={link}
            className={`${className} ${isSourcing ? 'sourcing' : ''} ${isScreening ? 'screening' : ''} ${isLegal ? 'legal' : ''} ${isLending ? 'lending' : ''} ${isAccount ? 'account' : ''}`}
            ref={cardRef}
            onClick={() => localStorage.setItem('team', name)}
        >
            <div className="card-inner">
                <div className="card-front">
                    <Icon className="logo" style={{ width: '100px', height: '100px', color: 'white' }} />
                    <p className="card-text">
                        <span className="card-name">{name}</span>
                        <span className="card-count" style={{ color: '#026d78ff', backgroundColor: 'white', padding: '5px', borderRadius: '5px 0px 0px 5px' }}>{count}</span>
                    </p>
                </div>
                {isSourcing && (
                    <div className="card-back">
                        <div className="status">
                            <span className="status-label" style={{ background: 'green' }}>Pending</span>
                            <span className="status-label" style={{ background: 'yellow' }}>Completed</span>
                            <span className="status-label" style={{ background: 'red' }}>Cancelled</span>
                        </div>
                        <div className="status">
                            <span className="status-value">{data.Pending || 0}</span>
                            <span className="status-value">{data.Completed || 0}</span>
                            <span className="status-value">{data.Cancelled || 0}</span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

function Home() {
    const [cardsData, setCardsData] = useState(initialCardsData);
    const [gobalSearch, setGobalSearch] = useState('');
    const [showUser, setShowUser] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sourcingData = await fetchSourcingCount();
                const yetToBeScreenedCount = await fetchScreeningCount();
                const analysisData = await fetchAnalysisCount();
                const activeCount = await fetchActiveCount();



                const updatedCardsData = cardsData.map(card => {
                    if (card.name === 'Sourcing') {
                        return { ...card, count: sourcingData.total, data: sourcingData };
                    } else if (card.name === 'Screening') {
                        return { ...card, count: yetToBeScreenedCount, data: {} };
                    } else if (card.name === 'Analysis') {
                        return { ...card, count: analysisData['Yet to be Analyzed'], data: analysisData };
                    } else if (card.name === 'Design' || card.name === 'Marketing' || card.name === 'Construction' || card.name === 'Acquisition') {
                        return { ...card, count: activeCount };
                    }
                    return card;
                });

                setCardsData(updatedCardsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = () => {
        console.log("searching", gobalSearch);
    }
    // Logout component
    const handleUser = () => (
        // console.log(showUser)
        setShowUser(!showUser)
    )
    const handleNotification = () => (
        setShowNotifications(!showNotifications)
    )

    return (
        <div className="App">
            <header className="header" style={{ background: 'linear-gradient(90deg, #026d78ff, #359cabff, #026d78ff)' }}>
                <IoMdHome style={{ width: '40px', height: '40px', color: 'white', position: 'absolute', left: '10px', top: '40px' }} />
                <h1 className="title">LAND ACQUISITION</h1>
                <HiBellAlert style={{ width: '40px', height: '40px', color: 'white', position: 'absolute', right: '80px', top: '40px', cursor: 'pointer' }} onClick={handleNotification} />
                <IoPersonCircleOutline style={{ width: '40px', height: '40px', color: 'white', position: 'absolute', right: '10px', cursor: 'pointer', top: '40px' }} onClick={handleUser} />
            </header>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', borderColor: '#026d78ff', gap: '10px', background: 'white', justifyContent: 'space-evenly', paddingRight: '8px' }}>
                    <input style={{
                        background: 'white',
                        color: 'black',
                        height: '2rem',
                        width: '10rem',
                        border: 'none',
                        padding: '8px'
                    }}
                        onChange={(e) => setGobalSearch(e.target.value)}
                    />
                    <FaSearch
                        style={{
                            width: '30px',
                            height: '30px',
                            color: 'black',
                        }}
                        onClick={handleSearch}
                    />
                </div>
            </div>
            <div className="cards-grid">
                {cardsData.map((card, index) => (
                    <Card
                        key={index}
                        name={card.name}
                        count={card.count}
                        icon={card.icon}
                        link={card.name}
                        data={card.data}
                        className={card.active ? 'card' : 'card inactive-card'}
                    />
                ))}
            </div>
            {showUser && <UserProfile showUser={showUser} setShowUser={setShowUser} />}
            {showNotifications && <Notifications />}
        </div>
    );
}

export default Home;

import React, { useState, useEffect } from 'react';
import { IoMdHome } from "react-icons/io";
import { HiBellAlert } from "react-icons/hi2";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import './Screening.css';
import BottomDrawer from '../../Components/bottomdraw';
import ScreeningAPI from './ScreeningAPI.jsx';
import { FaSearch } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner'; // Import progress bar
import UserProfile from '../UserProfile/UserProfile.jsx'; // logout option
import axios from 'axios';
import Notifications from '../UserProfile/Notifications.jsx';

// ScreenCard component
const ScreenCard = ({ mainText, subText, onClick, isHighlighted }) => (
    <div className={`screen-card ${isHighlighted ? 'highlighted' : ''}`} onClick={onClick}>
        <div className={`main-text${isHighlighted ? '-highlighted' : ''}`}>{mainText}</div>
        <div className={`sub-text${isHighlighted ? '-highlighted' : ''}`}>{subText}</div>
    </div>
);

// GridCard component
const GridCard = ({ text, onClick, data }) => (
    <div className="grid-card" style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => onClick(data)}>
        {text}
    </div>
);

const SearchBar = ({ query, onQueryChange }) => (
    <div className="search-container">
        <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search..."
            className="search-bar"
        />
        <FaSearch className="search-icon" />
    </div>
);

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25, 30];

function Screening() {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [highlightedCard, setHighlightedCard] = useState('yetToBeScreened');
    const [highlightedAdditionalCard, setHighlightedAdditionalCard] = useState(null); // New state for additional cards
    const [totalLots, setTotalLots] = useState(0);
    const [yetToBeScreened, setYetToBeScreened] = useState(0);
    const [qualified, setQualified] = useState(0);
    const [rejected, setRejected] = useState(0);
    const [onHold, setOnHold] = useState(0);
    const [gridData, setGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [qohData, setQohData] = useState({ total: 'Loading...' });
    const [qualifiedData, setQualifiedData] = useState('Loading...');
    const [rejectedData, setRejectedData] = useState('Loading...');
    const [openData, setOpenData] = useState('Loading...');
    const [searchQueryAddress, setSearchQueryAddress] = useState('');
    const [searchQueryLotSize, setSearchQueryLotSize] = useState('');
    const [searchQueryPrice, setSearchQueryPrice] = useState('');
    const [searchQueryAssignedTo, setSearchQueryAssignedTo] = useState('');
    const [recordsPerPage, setRecordsPerPage] = useState(5); // Initialize with a default value
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [totalRecords, setTotalRecords] = useState(0); // New state for total records
    const [showUser, setShowUser] = useState(false);
    const [status, setStatus] = useState('Yet to be Screened');
    const [showNotifications, setShowNotifications] = useState(false);



    const toggleDrawer = (itemData) => {
        console.log(itemData.name)
        axios.put('http://10.10.0.33/api/method/sourcing_data', {
            ab: itemData.name,


        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true


        },
        ).then((response) => {
            console.log(response)
        }

        )

        if (itemData) {
            setDrawerData(itemData);
        }
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleCardClick = (cardType) => {
        setIsLoading(true); // Start loading right at the start of the function
        setHighlightedCard(cardType);
        setHighlightedAdditionalCard(null); // Reset additional card on main card click
        setExpandedCard(expandedCard === cardType ? null : cardType);
        setCurrentPage(1); // Reset to first page when changing card
        fetchGridData(1, cardType, null).finally(() => setIsLoading(false)); // Clear additional card when fetching data
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleAdditionalCardClick = (cardType) => {
        console.log('Card type clicked:', cardType); // Log the card type

        setIsLoading(true); // Start loading right at the start of the function
        setHighlightedAdditionalCard(cardType);
        setCurrentPage(1); // Reset to first page when changing card
        fetchGridData(1, expandedCard, cardType).finally(() => setIsLoading(false));
    };




    const fetchGridData = async (page, cardType, additionalCardType) => {
        console.log('Fetching grid data for', additionalCardType); // Log additionalCardType

        setIsLoading(true);

        try {
            const startIndex = (page - 1) * recordsPerPage;
            const endIndex = startIndex + recordsPerPage;

            let data = [];

            // Fetch data based on cardType and additionalCardType
            switch (additionalCardType) {
                case 'onHold':
                    data = await ScreeningAPI.fetchQohData();
                    break;
                case 'rejected':
                    data = await ScreeningAPI.fetchQRejectedData();
                    break;
                case 'qualified':
                    data = await ScreeningAPI.fetchQualifiedData();
                    break;
                case 'open':
                    data = await ScreeningAPI.fetchQualifiedPenData();
                    break;
                default:
                    data = await ScreeningAPI.fetchGridData();
                    break;
            }

            if (!Array.isArray(data)) {
                throw new Error('Expected an array but got ' + typeof data);
            }

            let filtered = data;
            if (cardType) {
                filtered = data.filter(item => {
                    switch (cardType) {
                        case 'yetToBeScreened':
                            return item.screening_status === 'Yet to be Screened';
                        case 'qualified':
                            return item.screening_status === 'Qualified';
                        case 'rejected':
                            return item.screening_status === 'Rejected';
                        case 'onHold':
                            return item.screening_status === 'On Hold';
                        case 'totalLots':
                        default:
                            return true;
                    }
                });
            }

            // Filter based on search queries
            filtered = filtered.filter(item =>
                item.address.toLowerCase().includes(searchQueryAddress.toLowerCase()) &&
                item.land_size_sf.toString().includes(searchQueryLotSize) &&
                item.asking_price.toString().includes(searchQueryPrice) &&
                item.assigned_bdm.toLowerCase().includes(searchQueryAssignedTo.toLowerCase())
            );

            setTotalRecords(filtered.length);
            const paginatedData = filtered.slice(startIndex, endIndex);

            setGridData(paginatedData);
            setFilteredData(filtered);
            setTotalPages(Math.ceil(filtered.length / recordsPerPage));

        } catch (error) {
            console.error('Error fetching grid data:', error);
        } finally {
            setIsLoading(false);
        }
    };



    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        setIsLoading(true); // Start loading

        fetchGridData(newPage, expandedCard, highlightedAdditionalCard).finally(() => setIsLoading(false));
    };


    useEffect(() => {
        console.log('Fetching data counts and grid data');
        const fetchDataCounts = async () => {
            setIsLoading(true); // Start loading
            console.log('Fetching data counts and grid data');


            try {
                const data = await ScreeningAPI.fetchScreeningData();
                console.log('Screening Data:', data);

                if (data) {
                    setTotalLots(data['Total Lots'] || 0);
                    setYetToBeScreened(data['Yet to be screened'] || 0);
                    setQualified(data['Qualified'] || 0);
                    setRejected(data['Rejected'] || 0);
                    setOnHold(data['On Hold'] || 0);
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error('Error fetching data counts:', error);
            }
            setIsLoading(false); // End loading
        };

        const fetchQohData = async () => {
            setIsLoading(true); // Start loading

            try {
                const data = await ScreeningAPI.fetchQohData();
                if (data && typeof data['Qualified On Hold'] !== 'undefined') {
                    setQohData({
                        total: data['Qualified On Hold'],
                    });
                } else {
                    setQohData({
                        total: '0'
                    });
                }
            } catch (error) {
                console.error('Error fetching QOH data:', error);
                setQohData({
                    total: 'Error'
                });
            }
            setIsLoading(false); // End loading
        };

        const fetchQualifiedData = async () => {
            setIsLoading(true); // Start loading

            try {
                const data = await ScreeningAPI.fetchQualifiedData();
                if (data) {
                    setQualifiedData(data);
                } else {
                    setQualifiedData('0');
                }
            } catch (error) {
                console.error('Failed to fetch qualified data:', error);
                setQualifiedData('Error');
            }
            setIsLoading(false); // End loading
        };

        const fetchQRejectedData = async () => {
            setIsLoading(true); // Start loading

            try {
                const data = await ScreeningAPI.fetchQRejectedData();
                console.log('Rejected Data:', data);
                if (data) {
                    setRejectedData(data);
                } else {
                    setRejectedData('0');
                }
            } catch (error) {
                console.error('Failed to fetch rejected data:', error);
                setRejectedData('Error');
            }
            setIsLoading(false); // End loading
        };

        const fetchQipData = async () => {
            setIsLoading(true); // Start loading

            try {
                const data = await ScreeningAPI.fetchQipData();
                console.log('Open Data:', data);
                if (data) {
                    setOpenData(data);
                } else {
                    setOpenData('0');
                }
            } catch (error) {
                console.error('Failed to fetch open data:', error);
                setOpenData('Error');
            }
            setIsLoading(false); // End loading
        };

        fetchDataCounts();
        fetchQohData();
        fetchQualifiedData();
        fetchQRejectedData();
        fetchQipData();
        setIsLoading(true); // Start loading
        fetchGridData(currentPage, expandedCard, highlightedAdditionalCard).finally(() => setIsLoading(false));
    }, [currentPage, recordsPerPage, searchQueryAddress, searchQueryLotSize, searchQueryPrice, searchQueryAssignedTo]);


    useEffect(() => {
        setTotalPages(Math.ceil(filteredData.length / recordsPerPage));
    }, [recordsPerPage, filteredData.length]);


    const handleRecordsPerPageChange = (event) => {
        const newRecordsPerPage = parseInt(event.target.value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setCurrentPage(1); // Reset to first page when records per page change
        setIsLoading(true); // Start loading
        fetchGridData(1, expandedCard, highlightedAdditionalCard).finally(() => setIsLoading(false));
    };

    // Logout component
    const handleUser = () => (
        // console.log("hello")
        setShowUser(!showUser)
    )
    const handleNotification = () => (
        setShowNotifications(!showNotifications)
    )

    return (
        <div>
            <div className='screening'>
                <IoMdHome className='icon icon-left' onClick={handleHomeClick} />
                <h1 className='screen_head'>Screening</h1>
                <HiBellAlert className='icon icon-right-notification' onClick={handleNotification} />
                <IoPersonCircleOutline className='icon icon-right-profile' onClick={handleUser} />
            </div>
            <div className='card-container'>
                <ScreenCard
                    mainText="TOTAL LOTS"
                    subText={totalLots}
                    onClick={() => handleCardClick('totalLots')}
                    isHighlighted={highlightedCard === 'totalLots'}
                />
                <ScreenCard
                    mainText="YET TO BE SCREENED"
                    subText={yetToBeScreened}
                    onClick={() => handleCardClick('yetToBeScreened')}
                    isHighlighted={highlightedCard === 'yetToBeScreened'}
                />
                <ScreenCard
                    mainText="QUALIFIED"
                    subText={qualified}
                    onClick={() => handleCardClick('qualified')}
                    isHighlighted={highlightedCard === 'qualified'}
                />
                <ScreenCard
                    mainText="REJECTED"
                    subText={rejected}
                    onClick={() => handleCardClick('rejected')}
                    isHighlighted={highlightedCard === 'rejected'}
                />
                <ScreenCard
                    mainText="ON HOLD"
                    subText={onHold}
                    onClick={() => handleCardClick('onHold')}
                    isHighlighted={highlightedCard === 'onHold'}
                />
            </div>
            {expandedCard === 'qualified' && (
                <div className="additional-cards">
                    <div className="card-row">
                        <ScreenCard
                            mainText="On Hold"
                            subText={qohData.total}
                            onClick={() => handleAdditionalCardClick('onHold')}
                            isHighlighted={highlightedAdditionalCard === 'onHold'}
                        />
                        <ScreenCard
                            mainText="Rejected"
                            subText={rejectedData}
                            onClick={() => handleAdditionalCardClick('rejected')}
                            isHighlighted={highlightedAdditionalCard === 'rejected'}
                        />
                    </div>
                    <div className="card-row">
                        <ScreenCard
                            mainText="Qualified"
                            subText={qualifiedData}
                            onClick={() => handleAdditionalCardClick('qualified')}
                            isHighlighted={highlightedAdditionalCard === 'qualified'}
                        />
                        <ScreenCard
                            mainText="In Progress"
                            subText={openData}
                            onClick={() => handleAdditionalCardClick('open')}
                            isHighlighted={highlightedAdditionalCard === 'open'}
                        />
                    </div>
                </div>
            )}



            <div className='Screening-grid-container'>

                <div className='records-per-page'>
                    <label htmlFor="recordsPerPage">Records per page:</label>
                    <select
                        id="recordsPerPage"
                        value={recordsPerPage}
                        onChange={handleRecordsPerPageChange}
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className='pagination'>
                    <div className="total-records">Total: {totalRecords}</div> {/* Display total records count */}

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ backgroundColor: currentPage === 1 ? 'gray' : '#005A61' }}

                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ backgroundColor: currentPage === totalPages ? 'gray' : '#005A61' }}

                    >
                        Next
                    </button>
                </div>
                {isLoading ? (
                    <div className="loading-overlay">
                        <Oval
                            height={100}
                            width={100}
                            color="#4fa94d"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#4fa94d"
                            strokeWidth={2}
                            strokeWidthSecondary={2}
                        />
                    </div>
                ) : (
                    <>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Address
                                <SearchBar query={searchQueryAddress} onQueryChange={setSearchQueryAddress} />
                            </div>
                            {gridData.map((item, index) => (
                                <GridCard key={index} text={item.address} onClick={toggleDrawer} data={item} />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Lot Sqft
                                <SearchBar query={searchQueryLotSize} onQueryChange={setSearchQueryLotSize} />
                            </div>
                            {gridData.map((item, index) => (
                                <GridCard key={index} text={item.land_size_sf} onClick={toggleDrawer} data={item} />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Asking Price
                                <SearchBar query={searchQueryPrice} onQueryChange={setSearchQueryPrice} />
                            </div>
                            {gridData.map((item, index) => (
                                <GridCard key={index} text={item.asking_price} onClick={toggleDrawer} data={item} />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Assigned To
                                <SearchBar query={searchQueryAssignedTo} onQueryChange={setSearchQueryAssignedTo} />
                            </div>
                            {gridData.map((item, index) => (
                                <GridCard key={index} text={item.assigned_bdm} onClick={toggleDrawer} data={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            {isDrawerOpen && <BottomDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} data={drawerData} />}
            {showUser && <UserProfile showUser={showUser} setShowUser={setShowUser} />}
            {showNotifications && <Notifications />}
        </div>
    );
}

export default Screening;

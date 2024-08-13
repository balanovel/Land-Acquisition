import React, { useState, useEffect } from 'react';
import { IoMdHome } from "react-icons/io";
import { HiBellAlert } from "react-icons/hi2";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import './Analysis.css';
import AnalysisAPI from './AnalysisAPI.jsx';
import BottomDraw2 from '../BottomDraw2/bottomdraw2.jsx';
import UserProfile from '../UserProfile/UserProfile.jsx';
import { FaSearch } from 'react-icons/fa'; // Import FaSearch for the search icon
import Notifications from '../UserProfile/Notifications.jsx';


const ScreenCard = ({ mainText, subText, onClick, isHighlighted }) => (
    <div className={`screen-card`} onClick={onClick}>
        <div className={`main-text${isHighlighted ? '-highlighted' : ''}`}>{mainText}</div>
        <div className={`sub-text${isHighlighted ? '-highlighted' : ''}`}>{subText}</div>
    </div>
);

const GridCard = ({ text, onClick, data }) => (
    <div
        className="grid-card"
        style={{ marginTop: '20px', cursor: 'pointer' }}
        onClick={() => onClick(data)}
    >
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

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const ProgressBar = ({ isLoading }) => (
    isLoading ? (
        <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: '100%' }}></div>
        </div>
    ) : null
);

function Analysis() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);
    const [highlightedCard, setHighlightedCard] = useState('yetToBeAnalysed');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default value

    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const [showUser, setShowUser] = useState(false);
    const [analysisData, setAnalysisData] = useState({
        "Total Lots": "Loading...",
        "Yet to be Analyzed": "Loading...",
        "On Hold": "Loading...",
        "Rejected": "Loading...",
        "Shortlisted": "Loading...",
        "Selected": "Loading...",
        "Need Input": "Loading..."
    });
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state


    // Search queries for each column
    const [searchQueries, setSearchQueries] = useState({
        address: '',
        name: '',
        land_size_sf: '',
        market: '',
        asking_price: '',
        assigned_bdm: ''
    });
    const [expandedCard, setExpandedCard] = useState(null);
    const [highlightedAdditionalCard, setHighlightedAdditionalCard] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataCounts = async () => {
            try {
                const data = await AnalysisAPI.fetchAnalysisData();
                console.log('Fetched analysis data:', data); // Log fetched data
                setAnalysisData(data);
            } catch (error) {
                console.error('Error fetching analysis data:', error);
            }
        };

        fetchDataCounts();
        handleCardClick('yetToBeAnalysed');

    }, []);

    useEffect(() => {
        // Recalculate total pages whenever itemsPerPage or data changes
        setTotalPages(Math.ceil(totalRecords / itemsPerPage));
        setCurrentPage(1); // Reset to first page when itemsPerPage changes
    }, [itemsPerPage, totalRecords]);

    const handleCardClick = async (cardType) => {
        setIsLoading(true); // Show progress bar

        try {
            let response;
            switch (cardType) {
                case 'totalLots':
                    response = await AnalysisAPI.fetchTotalLotsInfo();
                    break;
                case 'yetToBeAnalysed':
                    response = await AnalysisAPI.fetchYetToBeAnalysedInfo();
                    break;
                case 'shortlisted':
                    response = await AnalysisAPI.fetchShortlistedInfo();
                    break;
                case 'selected':
                    response = await AnalysisAPI.fetchSelectedInfo();
                    break;
                case 'needinput':
                    response = await AnalysisAPI.fetchNeedInputInfo();
                    break;
                case 'rejected':
                    response = await AnalysisAPI.fetchRejectedInfo();
                    break;
                case 'onHold':
                    response = await AnalysisAPI.fetchOnHoldInfo();
                    break;
                case 'onSite':
                    response = await AnalysisAPI.fetchOnSiteInfo();
                    break;
                case 'acquisitions':
                    response = await AnalysisAPI.fetchNeedInputOnsiteInfo();
                    break;

                default:
                    break;
            }
            const formattedData = response.message ? Object.keys(response.message).map(key => response.message[key]) : Object.values(response);
            setData(formattedData);
            setTotalRecords(formattedData.length);
            setTotalPages(Math.ceil(formattedData.length / itemsPerPage));

            setHighlightedCard(cardType);
            setExpandedCard(cardType); // Update expandedCard to match the clicked card

        } catch (error) {
            console.error(`Error fetching ${cardType} info:`, error);
        } finally {
            setIsLoading(false); // Hide progress bar
        }
    };

    const toggleDrawer = (itemData) => {
        console.log('Toggle Drawer:', itemData); // Log itemData
        if (itemData) {
            setDrawerData(itemData);
        }
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Reset to first page on items per page change
    };

    const handleSearchChange = (field) => (value) => {
        setSearchQueries(prev => ({ ...prev, [field]: value }));
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return data
            .filter(item =>
                (item.market ? item.market.toLowerCase().includes(searchQueries.market.toLowerCase()) : true) &&
                (item.name ? item.name.toLowerCase().includes(searchQueries.name.toLowerCase()) : true) &&
                (item.address ? item.address.toLowerCase().includes(searchQueries.address.toLowerCase()) : true) &&
                (item.land_size_sf ? item.land_size_sf.toString().toLowerCase().includes(searchQueries.land_size_sf.toLowerCase()) : true) &&
                (item.asking_price ? item.asking_price.toString().toLowerCase().includes(searchQueries.asking_price.toLowerCase()) : true) &&
                (item.assigned_bdm ? item.assigned_bdm.toLowerCase().includes(searchQueries.assigned_bdm.toLowerCase()) : true)
            )
            .slice(startIndex, endIndex);
    };

    const currentPageData = getCurrentPageData();

    //notification
    const handleNotification = () => (
        setShowNotifications(!showNotifications)
    )

    return (
        <div>
            <ProgressBar isLoading={isLoading} />

            <div className='screening'>
                <IoMdHome className='icon icon-left' onClick={handleHomeClick} />
                <h1 className='screen_head'>Analysis</h1>
                <HiBellAlert className='icon icon-right-notification' onClick={handleNotification} />
                <IoPersonCircleOutline className='icon icon-right-profile' onClick={() => setShowUser(!showUser)} />
            </div>
            <div className='card-container'>
                <ScreenCard
                    mainText="TOTAL LOTS"
                    subText={analysisData["Total Lots"]}
                    onClick={() => handleCardClick('totalLots')}
                    isHighlighted={highlightedCard === 'totalLots'}
                />
                <ScreenCard
                    mainText="YET TO BE ANALYSED"
                    subText={analysisData["Yet to be Analyzed"]}
                    onClick={() => handleCardClick('yetToBeAnalysed')}
                    isHighlighted={highlightedCard === 'yetToBeAnalysed'}
                />
                <ScreenCard
                    mainText="SHORTLISTED"
                    subText={analysisData["Shortlisted"]}
                    onClick={() => handleCardClick('shortlisted')}
                    isHighlighted={highlightedCard === 'shortlisted'}
                />
                <ScreenCard
                    mainText="SELECTED"
                    subText={analysisData["Selected"]}
                    onClick={() => handleCardClick('selected')}
                    isHighlighted={highlightedCard === 'selected'}
                />
                <ScreenCard
                    mainText="NEED INPUT"
                    subText={10}

                    // subText={analysisData["Need Input"]}
                    onClick={() => handleCardClick('needinput')}
                    isHighlighted={highlightedCard === 'needinput'}
                />
                <ScreenCard
                    mainText="REJECTED"
                    subText={analysisData["Rejected"]}
                    onClick={() => handleCardClick('rejected')}
                    isHighlighted={highlightedCard === 'rejected'}
                />
                <ScreenCard
                    mainText="ON HOLD"
                    subText={analysisData["On Hold"]}
                    onClick={() => handleCardClick('onHold')}
                    isHighlighted={highlightedCard === 'onHold'}
                />
            </div>
            {expandedCard === 'onHold' && (
                <div className="additional-cards">
                    <div className="card-row">
                        <ScreenCard
                            mainText="On site"
                            subText="1"
                            onClick={() => handleCardClick('onSite')}
                            isHighlighted={highlightedCard === 'onSite'}
                        />
                        <ScreenCard
                            mainText="Acquisitions"
                            subText="1"
                            onClick={() => handleCardClick('acquisitions')}
                            isHighlighted={highlightedCard === 'acquisitions'}
                        />
                    </div>
                </div>
            )}

            <div className="pagination2">
                <label>
                    Records per page:
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>
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
                <span>Total Records: {totalRecords}</span>
            </div>
            {highlightedCard && (
                <>
                    <div className='grid-container'>

                        <div className='grid-column'>
                            <div className='grid-header'>
                                Lot ID
                                <SearchBar
                                    query={searchQueries.name}
                                    onQueryChange={handleSearchChange('name')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.name}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>


                        <div className='grid-column'>
                            <div className='grid-header'>
                                Address
                                <SearchBar
                                    query={searchQueries.address}
                                    onQueryChange={handleSearchChange('address')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.address}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Market
                                <SearchBar
                                    query={searchQueries.market}
                                    onQueryChange={handleSearchChange('market')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.market}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>



                        <div className='grid-column'>
                            <div className='grid-header'>
                                Lot Sqft
                                <SearchBar
                                    query={searchQueries.land_size_sf}
                                    onQueryChange={handleSearchChange('land_size_sf')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.land_size_sf}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Asking Price
                                <SearchBar
                                    query={searchQueries.asking_price}
                                    onQueryChange={handleSearchChange('asking_price')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.asking_price}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>
                        <div className='grid-column'>
                            <div className='grid-header'>
                                Assigned To
                                <SearchBar
                                    query={searchQueries.assigned_bdm}
                                    onQueryChange={handleSearchChange('assigned_bdm')}
                                />
                            </div>
                            {currentPageData.map((item, index) => (
                                <GridCard
                                    key={index}
                                    text={item.assigned_bdm}
                                    data={item}
                                    onClick={toggleDrawer}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
            {isDrawerOpen && drawerData && (
                <BottomDraw2 data={drawerData} />
            )}
            {showUser && <UserProfile />}
            {showNotifications && <Notifications />}
        </div>
    );
}

export default Analysis;

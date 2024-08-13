import React, { useState, useEffect, useRef } from 'react';
import { ImAttachment } from 'react-icons/im';
import { BiSolidQuoteAltRight } from 'react-icons/bi';
import { HiBellAlert } from 'react-icons/hi2';
import { IoMdHome } from 'react-icons/io';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaRegClock } from 'react-icons/fa';
import './Sourcing.css';
import { fetchSourcingData, uploadFile, updateStatus } from './SourcingAPI';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile'; //logout option 
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Default import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { FaSearch } from 'react-icons/fa';


function ListItem({ item, toggleState, handleToggle, handleAttachmentClick, handleQuoteClick }) {
    return (
        <li className='list-item'>
            <div className='task-name'>{item.task}</div>
            <div className='toggle'>
                <div
                    className={`toggle-button ${toggleState[item.key]}`}
                    onClick={() => handleToggle(item.key)}
                >
                    <div className='toggle-button-inner'>
                        <FaCheck className='scrn_icon scrn_icon-close' />
                        <FaRegClock className='scrn_icon scrn_icon-pending' />
                        <IoMdClose className='scrn_icon scrn_icon-check' />
                    </div>
                </div>
            </div>
            <ImAttachment
                className={`attachment-icon ${item.attachment ? 'highlight' : ''}`}
                onClick={() => handleAttachmentClick(item.key)}
            />
            <BiSolidQuoteAltRight
                className={`remarks-icon ${item.remarks ? 'highlight' : ''}`}
                onClick={() => handleQuoteClick(item.key)}
            />
        </li>
    );
}

function Sourcing() {
    const [toggleState, setToggleState] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState({});
    const [listItems, setListItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [currentItemKey, setCurrentItemKey] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileUrl, setFileUrl] = useState(''); // Track file URL per task
    const [fileSelected, setFileSelected] = useState(false); // Track if a file is selected
    const [quoteComments, setQuoteComments] = useState({}); // Track comments for each task
    const [showUser, setShowUser] = useState(false); // setting logout option 
    const [showSubmitAnimation, setShowSubmitAnimation] = useState(false);
    const [showTickMark, setShowtickmark] = useState(false);
    const [sourcingsearch, setsourcingSearch] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [rows, setRows] = useState([]);
    // Track the submit animation
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Toast Notifications
    const handleSuccess = (message) => {
        toast.success(message, { toastId: "success" }); // Use default toast success method
    };

    const handleError = (message, details) => {
        const fullMessage = details ? `${message}: ${details}` : message;
        toast.error(
            <div dangerouslySetInnerHTML={{ __html: fullMessage }} />,
            { toastId: "error" }
        );
    };

    const handleNotification = () => (
        setShowNotifications(!showNotifications)
    )

    const addRow = () => {
        // Add a new empty row to the rows array
        setRows(prevRows => [...prevRows, {
            id: prevRows.length + 1,
            task_name: '',
            remarks: '',
            attach: '',
            task_status: 'Pending'
        }]);
    };



    const logged_user = async () => {
        const logged = 'http://10.10.0.33/api/method/frappe.auth.get_logged_user';
        try {
            console.log('Attempting to get logged user...');
            const response = await axios.get(logged, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            console.log('logged user response:', response.data.message);

            return true;
        } catch (error) {
            console.error('logged error:', error.response ? error.response.data : error.message);
            // throw new Error('logged failed: ' + (error.response ? error.response.data : error.message));
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchSourcingData();
                const updatedList = Object.keys(result).map((key, index) => {
                    const taskData = result[key];
                    const itemKey = `task${index + 1}`;
                    return {
                        key: itemKey,
                        name: taskData.name,
                        task: taskData.task_name,
                        sourcing_status: taskData.sourcing_status,
                        attachment: taskData.attach || false, // Ensure attachment is boolean
                        fileName: taskData.fileName || '',
                        fileUrl: taskData.attach || '', // Use attachment URL
                        remarks: taskData.remarks || '' // Load existing remarks
                    };
                });

                const updatedToggleState = updatedList.reduce((acc, item) => {
                    switch (item.sourcing_status) {
                        case 'Pending':
                            acc[item.key] = 'middle';
                            break;
                        case 'Completed':
                            acc[item.key] = 'right';
                            break;
                        case 'Cancelled':
                            acc[item.key] = 'left';
                            break;
                    }
                    return acc;
                }, {});
                setListItems(updatedList);
                setToggleState(updatedToggleState);
                setQuoteComments(updatedList.reduce((acc, item) => ({
                    ...acc,
                    [item.key]: item.remarks || ''
                }), {}));
            } catch (error) {
                setErrorMessage('Error fetching data: ' + error.message);
                handleError('Error fetching data: ' + error.message)
            }
        };

        logged_user()
        fetchData();
    }, []);

    const handleToggle = (itemKey) => {
        const currentState = toggleState[itemKey];
        let newToggleState;

        switch (currentState) {
            case 'left': // Completed
                newToggleState = 'middle'; // Change to Pending
                break;
            case 'middle': // Pending
                newToggleState = 'right'; // Change to Cancelled
                break;
            case 'right': // Cancelled
                newToggleState = 'left'; // Change to Completed
                break;
        }

        setToggleState(prevState => ({
            ...prevState,
            [itemKey]: newToggleState
        }));

        setPendingUpdates(prevUpdates => ({
            ...prevUpdates,
            [itemKey]: {
                ...prevUpdates[itemKey],
                status: newToggleState === 'left' ? 'Cancelled' :
                    newToggleState === 'middle' ? 'Pending' :
                        newToggleState === 'right' ? 'Completed' :
                            ''
            }
        }));
    };

    const handleAttachmentClick = (itemKey) => {
        const item = listItems.find(i => i.key === itemKey);
        setCurrentItemKey(itemKey);
        setSelectedFileName(item.fileName || ''); // Set file name if attachment exists
        setFileUrl(item.fileUrl || ''); // Set file URL if attachment exists
        setFileSelected(false); // Reset file selected state
        setShowAttachmentModal(true);
    };

    const handleQuoteClick = (itemKey) => {
        const item = listItems.find(i => i.key === itemKey);
        setCurrentItemKey(itemKey);
        setShowQuoteModal(true);
    };

    const handleCloseAttachmentModal = () => {
        setShowAttachmentModal(false);
        setCurrentItemKey(null);
    };

    const handleCloseQuoteModal = () => {
        setShowQuoteModal(false);
        setCurrentItemKey(null);
    };

    const handleFileSelection = () => {
        const file = fileInputRef.current.files[0];
        if (file) {
            setSelectedFileName(file.name);
            setFileSelected(true); // Set file selected state to true
        } else {
            setSelectedFileName('');
            setFileSelected(false); // Set file selected state to false
        }
    };

    const handleFileUpload = async () => {
        const file = fileInputRef.current.files[0];

        if (file) {
            setIsUploading(true);
            try {
                const uploadedFileUrl = await uploadFile(file);
                setFileUrl(uploadedFileUrl); // Set URL for the current task

                // Update listItems with the new attachment status, file URL, and file name
                setListItems(prevItems => prevItems.map(item =>
                    item.key === currentItemKey ? {
                        ...item,
                        attachment: true, // Update attachment status
                        fileName: file.name, // Update file name
                        fileUrl: uploadedFileUrl // Update file URL
                    } : item
                ));

                // Update pendingUpdates with the new file URL
                setPendingUpdates(prevUpdates => ({
                    ...prevUpdates,
                    [currentItemKey]: {
                        ...prevUpdates[currentItemKey],
                        fileUrl: uploadedFileUrl
                    }
                }));

                // Reset file selection and close modal
                handleSuccess("file added successfully..!")
                setSelectedFileName('');
                setFileSelected(false);
                setShowAttachmentModal(false);
            } catch (error) {
                setErrorMessage('Error uploading file: ' + error.message);
                handleError("failed to add, please try again", error.message)
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleQuoteSave = () => {
        setListItems(prevItems => prevItems.map(item =>
            item.key === currentItemKey ? {
                ...item,
                remarks: quoteComments[currentItemKey] || '' // Update remarks
            } : item
        ));

        setPendingUpdates(prevUpdates => ({
            ...prevUpdates,
            [currentItemKey]: {
                ...prevUpdates[currentItemKey],
                remarks: quoteComments[currentItemKey] || '' // Update remarks
            }
        }));
        handleSuccess('Sucessfully added comment')
        setTimeout(() => {
            setShowQuoteModal(false);
        }, 600);

    };

    const handleSubmit = async () => {
        setShowSubmitAnimation(true);
        setShowtickmark(false); // Hide tick mark initially

        console.log('Pending Updates:', pendingUpdates);

        try {
            // Simulate a delay to show the loading animation
            await new Promise(resolve => setTimeout(resolve, 600));

            await Promise.all(
                Object.keys(pendingUpdates).map(async (itemKey) => {
                    const update = pendingUpdates[itemKey];
                    const { status, fileUrl, remarks } = update;
                    const item = listItems.find(listItem => listItem.key === itemKey);

                    if (!item) {
                        console.error(`Missing item for itemKey: ${itemKey}`);
                        throw new Error(`Missing item for itemKey: ${itemKey}`);
                    }

                    console.log('Updating Status for:', {
                        name: item.name,
                        task: item.task,
                        status: status || item.sourcing_status,
                        fileUrl: fileUrl || item.fileUrl,
                        remarks: remarks || item.remarks
                    });

                    await updateStatus(item.name, item.task, status || item.sourcing_status, fileUrl || item.fileUrl, remarks || item.remarks);
                })
            );
            setPendingUpdates({});
        } catch (error) {
            setErrorMessage('Error submitting data: ' + error.message);
            handleError('Error submitting data', error.message)
        } finally {
            // Ensure the submit animation has time to display before showing the tick mark
            setTimeout(() => {
                setShowSubmitAnimation(false);
                // setShowtickmark(true);
                handleSuccess('Sucessfully Updated')
            }, 600); // Adjust this delay if needed
            // setTimeout(() => {
            //     setShowtickmark(false);
            // }, 2000)

        }
    };
    console.log('Show Tick Mark:', showTickMark);

    const handleHomeClick = () => {
        navigate('/home');// Redirect to the home page
    };
    // Logout component
    const handleUser = () => (
        // console.log("hello")
        setShowUser(!showUser)
    )

    return (
        <div className='source'>
            <div className='source-head'>
                <IoMdHome className='scrn_icon scrn_icon-left home-icon' onClick={handleHomeClick} />
                <h1 className='scrn_heading'>SOURCING</h1>
                <IoPersonCircleOutline className='scrn_icon scrn_icon-person profile-icon' onClick={handleUser} />
                <HiBellAlert style={{ width: '50px', height: '40px', color: 'white', position: 'absolute', right: '80px', top: '55px', cursor: 'pointer' }} onClick={handleNotification} />
            </div>
            <div style={{ position: 'absolute', right: '30px', width: '16%', borderRadius: "20px", display: 'flex', alignItems: 'center', borderColor: '#026d78ff', gap: '8px', background: 'white', justifyContent: 'space-around', paddingRight: '15px' }}>
                <input style={{
                    background: 'white',
                    color: 'black',
                    height: '2rem',
                    width: '9rem',
                    border: 'none',
                    padding: '5px',
                    borderRadius: "20px"
                }}
                    onChange={(e) => setsourcingSearch(e.target.value)}
                />
                <FaSearch
                    style={{
                        width: '30px',
                        height: '30px',
                        color: '#008080',
                    }}
                    onClick={sourcingsearch}
                />
            </div>
            <div className='source-content'>
                {errorMessage && <div className='error'>{errorMessage}</div>}
                <ul className='list'>
                    {listItems.map(item => (
                        <ListItem
                            key={item.key}
                            item={item}
                            toggleState={toggleState}
                            handleToggle={handleToggle}
                            handleAttachmentClick={handleAttachmentClick}
                            handleQuoteClick={handleQuoteClick}
                        />
                    ))}
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', top: '-30px' }}>
                            <button style={{ left: "415px", borderRadius: "10px" }} className="sourcing_add-row-button" onClick={addRow}>Add Task</button>
                        </div>
                        <div style={{ width: '44%', display: 'flex' }}>
                            <button className='submit-button' onClick={handleSubmit}>Submit</button>
                            {showSubmitAnimation && (
                                <div className='submit-animation'>
                                    <div className="loading-spinner"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </ul>



                {showTickMark && <div className='tick-mark show'><FaCheck /></div>}
            </div>
            {showAttachmentModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='attachment_close' onClick={handleCloseAttachmentModal}>X</span>
                        <input
                            type='file'
                            ref={fileInputRef}
                            onChange={handleFileSelection}
                        />
                        {selectedFileName && !isUploading && fileSelected && (
                            <>
                                <h5>{selectedFileName}</h5>
                                <button onClick={handleFileUpload}>Upload</button>
                            </>
                        )}
                        {isUploading && <div className='uploading-notification'>Uploading...</div>}
                        {fileUrl && (
                            <p class name='p_tag'>
                                <a class name='a_tag' href={`http://10.10.11.120${fileUrl}`} target="_blank" rel="noopener noreferrer">
                                    http://10.10.11.120{fileUrl}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            )}


            {showQuoteModal && (
                <div className='modal remarks'>
                    <div className='modal-content remarks'>
                        <span className='remarks_close' onClick={handleCloseQuoteModal}>X</span>
                        <div className='remarks-content' >
                            <textarea

                                className='remarks-textarea'
                                value={quoteComments[currentItemKey] || ''}
                                onChange={(e) => setQuoteComments(prev => ({
                                    ...prev,
                                    [currentItemKey]: e.target.value
                                }))}
                                placeholder='Enter your comments here...'
                            />
                            <button
                                className='remarks-button'
                                onClick={handleQuoteSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            {showUser && <UserProfile showUser={showUser} setShowUser={setShowUser} />}
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>

    );
}

export default Sourcing;

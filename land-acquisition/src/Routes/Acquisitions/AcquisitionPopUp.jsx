import React, { useEffect, useState } from 'react';
import { IconPaperclip, IconMessages } from '@tabler/icons-react';
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router';
import Modal from 'react-modal';
import AcquisitionsDetails from './AcquisitionsDetails';
import AcquisitionsChat from './AcquisitionsChat';
import CustomDropdown from './CustomDropdown';
import { getDataBasedOnTeam, updateTasks } from './AcquisitionsApi';
import './Acquisitions.css';

//toast
import { ToastContainer, toast } from 'react-toastify'; // Default import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

//icon
import { BiSearchAlt } from "react-icons/bi";
import { FaFilter } from "react-icons/fa6";



import styled from 'styled-components';
import { FaCheck, FaRegClock, FaWindowClose } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AcquisitionsAlert from './AcquisitionsAlert';
import AssingedTopop from './AssignedTopop';
import AddAttachments from './AddAttachments';

Modal.setAppElement('#root');

// Styled component for individual task items
const StyledDiv = styled.div`
  height: 4rem;
  margin-top: 1rem;
  border-radius: 99px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative
`;

const AttachementSubDiv = styled.div`
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

const Icon = styled.div`
  position: absolute;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const AssingedDiv = styled.div`
    min-width: 50px;
    left: 2rem;
    top: -10px;
    position: absolute;
    padding: 0px 5px 0px 5px;
    background: #00575d;
    border-radius: 99px;
`
// Styled container for the chat
const DivFilter = styled.div`
    position: absolute;
    right: 24%;
    padding:1rem;
    border-radius: 1rem;
    background-color: #00575d;
    border-top-right-radius: 0px;
    // height: 10rem;
    width: 19%;
    transform: translateX(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;

`;



function AcquisitionPopUp() {
    const location = useLocation();
    const { selectedTask, name } = location.state || {};
    const [selectedSection, setSelectedSection] = useState("Pre-Proposal");
    const [taskData, setTaskData] = useState([]);
    const [expandStates, setExpandStates] = useState({});
    const [showChat, setShowChat] = useState(false);
    const [activeChatName, setActiveChatName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [color, setColor] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [subTaskStatus, setSubTaskStatus] = useState('');
    const [asssinged, setAsssinged] = useState(false);
    const [settinName, setSettinName] = useState('');
    const [currentContent, setCurrentContent] = useState(null);
    const [backgroundColors, setBackgroundColors] = useState(() => {
        const savedColors = localStorage.getItem('backgroundColors');
        return savedColors ? JSON.parse(savedColors) : {};
    });
    const [taskNameForAttachment, setTaskNameForAttachment] = useState("");
    const [activeBtn, setActiveBtn] = useState('Pre Proposal');
    const [attachment, setAttachment] = useState(false);
    const [editableDates, setEditableDates] = useState({});
    const navigate = useNavigate();
    const team = localStorage.getItem('team');
    const projectId = name;
    const stages = "Pre Proposal";
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [toggleStates, setToggleStates] = useState('');
    const [subTaskListValue, setSubTaskListValue] = useState([]);
    const [filterDiv, setFilterDiv] = useState(false)
    let teamName = localStorage.getItem('team')
    localStorage.setItem('stage', "Pre Proposal");


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


    useEffect(() => {
        if (selectedTask) {
            setCurrentContent(selectedTask); // Initialize currentContent with selectedTask
        }
    }, [selectedTask]);

    useEffect(() => {
        fetchData(team, projectId, stages);
    }, [team, projectId, stages]);

    const fetchData = async (team, projectId, stages) => {
        try {
            let res = await getDataBasedOnTeam(team, projectId, stages);
            let data = res.data.message;
            setTaskData(data);
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddressClick = (task) => {
        if (task && Array.isArray(task.depends_on_tasks_data)) {
            const tasksData = task.depends_on_tasks_data;
            setPreProposals(tasksData);
            setCurrentContent(tasksData); // Replace selectedTask with preProposals
        } else {
            console.error("Invalid data format for depends_on_tasks_data", task);
            setPreProposals([]);
            setCurrentContent(selectedTask); // Reset to selectedTask if data is invalid
        }
    };

    // Get new toggle state based on status
    const getNewToggleState = (status) => {
        switch (status) {
            case 'Open':
                return 'middle';
            case 'Completed':
                return 'right';
            case 'Cancelled':
                return 'left';
            default:
                return 'middle';
        }
    };

    // Handle toggle action for tasks
    const handleToggle = (index, name) => {
        setTaskData((prevData) => {
            const updatedData = [...prevData];
            const task = updatedData[index];

            // Toggle between open, completed, and canceled statusesd
            const newStatus = task.status === 'Completed' ? 'Open' : task.status === 'Open' ? 'Cancelled' : 'Completed';
            task.status = newStatus;

            // Update the toggle state
            setToggleStates(newStatus);

            return updatedData;
        });
        setTaskNameForAttachment(name);
    };


    const handleExpandToggle = (name) => {
        setExpandStates((prevStates) => ({
            ...prevStates,
            [name]: !prevStates[name],
        }));
        setTaskNameForAttachment(name);
    };

    const openChat = (name) => {
        setActiveChatName(name);
        setShowChat(true);
    };

    const handleModal = (color, taskStatus, taskName) => {
        setColor(color);
        setSettinName(taskName);
        setTaskStatus(taskStatus);
        setShowModal(true);
    };

    const updateColor = (color, taskName) => {
        setBackgroundColors((prevColors) => {
            const newColors = { ...prevColors, [taskName]: color };
            // Persist colors to local storage
            localStorage.setItem('backgroundColors', JSON.stringify(newColors));
            return newColors;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let form = new FormData(e.target);
        let formObj = Object.fromEntries(form.entries());
        formObj.sub_task = subTaskStatus;
        formObj.name = taskNameForAttachment;
        if (toggleStates !== null) {
            formObj.toggleStates = toggleStates;
        }
        formObj.subTaskList = subTaskListValue;
        console.log("formObj = ", formObj);

        try {
            let result = await updateTasks(formObj);
            if (result.status === 200) {
                fetchData(team, projectId, stages);
            }
            handleSuccess('Task updated successfully!');
            console.log("Result = ", result);
        } catch (error) {
            handleError('Error updating Task', error.response.data.exception);
            console.error('Error updating Task:', error);
        }
    };

    const handleAttachment = (name) => {
        setAttachment(true);
        setTaskNameForAttachment(name);
    };

    const handleAttchementClose = () => {
        setAttachment(false);
    };

    // Handle date change
    const handleDateChange = (e, taskName, dateType) => {
        const value = e.target.value;

        // Update editableDates state
        setEditableDates((prevDates) => ({
            ...prevDates,
            [taskName]: {
                ...prevDates[taskName],
                [dateType]: value,
            },
        }));
    };

    //Assinged to popup
    const handleAssinged = (name) => {
        console.log('asssingsed');
        setActiveChatName(name);
        setAsssinged(true)
    }

    //Filter Div 
    const handlefilterDiv = () => {
        setFilterDiv(!filterDiv)
    }
    const mainBackground = {
        'Not yet started': '#f00',
        'In progress': '#f2ff00',
        'Awaiting response': '#047ff6',
        'Completed': '#00f900',
    };

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: '0rem',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >

                <div style={{ display: 'flex', height: '100%', opacity: showChat || showModal ? 0.5 : 1 }}>
                    <div style={{
                        width: '30%',
                        backgroundColor: '#016e79',
                        padding: '1rem',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                    >
                        <button className='btn'
                            style={{
                                backgroundColor: activeBtn === "Pre Proposal" ? "black" : '',
                                color: 'white',

                            }}
                            onClick={() => {
                                setSelectedSection("Pre Proposal");
                                localStorage.setItem('stage', "Pre Proposal")
                                setActiveBtn("Pre Proposal");
                                fetchData(team, projectId, "Pre Proposal");
                                if (selectedTask && selectedTask.depends_on_tasks_data) {
                                    handleAddressClick(selectedTask.depends_on_tasks_data[0]);
                                }
                            }}
                        >
                            Pre-Proposal
                        </button>
                        <div style={{ fontWeight: "bold" }}>Proposal</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className='btn'
                                style={{
                                    width: '48%',
                                    height: '4rem',
                                    backgroundColor: activeBtn === "Option" ? "black" : '',
                                    color: 'white',

                                }}
                                onClick={() => {
                                    setSelectedSection("Option");
                                    localStorage.setItem('stage', "Option")
                                    setActiveBtn("Option");
                                    fetchData(team, projectId, "Option");
                                    if (selectedTask && selectedTask.depends_on_tasks_data)
                                        handleAddressClick(selectedTask.depends_on_tasks_data[1].depends_on_tasks_data[0]);
                                }}
                            >
                                Option Period
                            </button>
                            <button className='btn'
                                style={{
                                    width: '48%',
                                    height: '4rem',
                                    backgroundColor: activeBtn === "Contract" ? "black" : '',
                                    color: 'white',
                                }}
                                onClick={() => {
                                    setSelectedSection("Contract");
                                    localStorage.setItem('stage', "Contract")
                                    setActiveBtn("Contract");
                                    fetchData(team, projectId, "Contract");
                                    if (selectedTask && selectedTask.depends_on_tasks_data)
                                        handleAddressClick(selectedTask.depends_on_tasks_data[1].depends_on_tasks_data[1]);
                                }}
                            >
                                Contract Period
                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            width: '75%',
                            padding: '0rem 1rem 2rem 1rem',
                            boxSizing: 'border-box',
                            backgroundColor: "#0d828e",
                            color: 'white',
                            overflow: 'auto'
                        }}
                    >
                        <div style={{ position: 'sticky', top: '0', zIndex: '99', background: '#0d828e', paddingTop: '1rem', paddingBottom: '1rem' }}>
                            <h4>{teamName}</h4>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1.5rem',
                                    borderRadius: '38px',
                                    padding: '0.3rem 1.2rem',
                                    backgroundColor: '#ff0000',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ gap: '10px', alignItems: 'center', justifyContent: 'left', display: 'flex', paddingBottom: '10px', width: '20%' }}>
                                    {/* <h4>Task Name : </h4> */}
                                    <input
                                        type="text"
                                        placeholder="Task Name..."
                                        // value={searchTerm}
                                        required
                                        // onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ background: "white", color: 'black', height: '1rem', width: '100%', borderRadius: '0.5rem', padding: '0.5rem' }}
                                    />
                                    <BiSearchAlt
                                        size={24}
                                        style={{
                                            color: 'black',
                                            cursor: 'pointer',
                                            position: "relative",
                                            right: '35px'
                                        }} />
                                </div>
                                <div style={{ paddingRight: '1rem' }}>
                                    <FaFilter
                                        onClick={handlefilterDiv} style={{ cursor: 'pointer' }} />
                                    {filterDiv && <DivFilter >
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                                            <input type="text" placeholder="Task Name..." style={{ width: '40%', backgroundColor: '#77c5d0', color: 'black' }}></input>
                                            <input type="text" placeholder="Status..." style={{ width: '40%', backgroundColor: '#77c5d0', color: 'black' }}></input>
                                            <input type="text" placeholder="Start Date..." style={{ width: '40%', backgroundColor: '#77c5d0', color: 'black' }}></input>
                                            <input type="text" placeholder="End Date..." style={{ width: '40%', backgroundColor: '#77c5d0', color: 'black' }}></input>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', paddingTop: '20px' }}>
                                            <button style={{ backgroundColor: '#77c5d0', color: '#0b575d' }}>Filter</button>
                                        </div>
                                    </DivFilter>}
                                </div>
                            </div>
                        </div>
                        {taskData?.length !== 0 ? (
                            taskData?.map((task, index) => (
                                <div key={index}>
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ height: '4.5rem', borderRadius: '3rem', backgroundColor: `${mainBackground[task.sub_status]}` }}>
                                            <StyledDiv
                                                style={{
                                                    background: '#06545c',
                                                }}
                                            >
                                                <AssingedDiv onClick={() => { handleAssinged(task.name) }}>{task.assigned_to_name ? task.assigned_to_name : "Unassigned"}</AssingedDiv>

                                                <div>
                                                    <span style={{
                                                        display: 'flex', width: '80px', textWrap: 'wrap'
                                                    }}>{task.subject}</span>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label htmlFor="startDate" style={{
                                                        position: 'absolute',
                                                        background: '#00575d',
                                                        padding: "2px",
                                                        width: '85px',
                                                        top: '9px',
                                                        borderRadius: '99px',
                                                        fontSize: '12px'
                                                    }}>Start Date</label>
                                                    <input
                                                        type="date"
                                                        name='startDate'
                                                        style={{
                                                            background: 'white', color: 'black', background: 'white',
                                                            color: 'black',
                                                            height: '2rem',
                                                            borderRadius: '99px',
                                                            width: '130px',
                                                            display: 'flex',
                                                            alignItems: 'flex-end',
                                                            justifyContent: 'center',
                                                        }}
                                                        value={editableDates[task.name]?.start_date || task.exp_start_date}
                                                        onChange={(e) => handleDateChange(e, task.name, 'start_date')}
                                                    />
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label htmlFor="endDate" style={{
                                                        position: 'absolute',
                                                        background: '#00575d',
                                                        padding: "2px",
                                                        width: '85px',
                                                        top: '9px',
                                                        borderRadius: '99px',
                                                        fontSize: '12px'
                                                    }}>End Date</label>
                                                    <input
                                                        type="date"
                                                        name='endDate'
                                                        style={{
                                                            background: 'white', color: 'black', background: 'white',
                                                            color: 'black',
                                                            height: '2rem',
                                                            borderRadius: '99px',
                                                            width: '130px',
                                                            display: 'flex',
                                                            alignItems: 'flex-end',
                                                            justifyContent: 'center',
                                                        }}
                                                        value={editableDates[task.name]?.end_date || task.exp_end_date}
                                                        onChange={(e) => handleDateChange(e, task.name, 'end_date')}
                                                    />
                                                </div>


                                                <div>
                                                    <div
                                                        className={`toggle-button ${getNewToggleState(task.status)}`}
                                                        onClick={() => handleToggle(index, task.name)}
                                                    >
                                                        <div className='toggle-button-inner'>
                                                            <IoMdClose className='scrn_icon scrn_icon-check' />
                                                            <FaRegClock className='scrn_icon scrn_icon-pending' />
                                                            <FaCheck className='scrn_icon scrn_icon-close' />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <IconPaperclip size={30} onClick={() => { handleAttachment(task.name) }} />
                                                </div>

                                                <div onClick={() => openChat(task.name)}>
                                                    <IconMessages size={30} />
                                                </div>
                                                {!expandStates[task.name] &&
                                                    <button style={{ marginTop: '1rem', marginBottom: '1rem', backgroundColor: '#0395af' }} type="submit">
                                                        Submit
                                                    </button>
                                                }
                                                {/* <div style={{ display: 'flex', position: 'relative' }} >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignContent: 'center',
                                                        gap: '1rem',
                                                        // position: 'absolute',
                                                        // bottom: '0px',
                                                        // left: '-50px',
                                                    }}
                                                >
                                                    <div className='tooltip'
                                                        style={{
                                                            height: '1rem',
                                                            width: '1rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'red',
                                                            borderColor: backgroundColors[task.name] === 'red' ? 'white' : '',
                                                            borderWidth: backgroundColors[task.name] === 'red' ? '4px' : '0',
                                                            borderStyle: backgroundColors[task.name] === 'red' ? 'solid' : 'none',
                                                        }}
                                                        onClick={() => {
                                                            handleModal('red', 'Open', task.name);
                                                        }}
                                                    ><span class="tooltiptext">A</span>
                                                    </div>
                                                    <div className='tooltip'
                                                        style={{
                                                            height: '1rem',
                                                            width: '1rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#dcff47',
                                                            borderColor: backgroundColors[task.name] === 'yellow' ? 'white' : '',
                                                            borderWidth: backgroundColors[task.name] === 'yellow' ? '4px' : '0',
                                                            borderStyle: backgroundColors[task.name] === 'yellow' ? 'solid' : 'none',
                                                        }}
                                                        onClick={() => {
                                                            handleModal('yellow', 'Working', task.name);
                                                        }}
                                                    ><span class="tooltiptext">B</span>
                                                    </div>
                                                    <div className='tooltip'
                                                        style={{
                                                            height: '1rem',
                                                            width: '1rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#45aafe',
                                                            borderColor: backgroundColors[task.name] === 'blue' ? 'white' : '',
                                                            borderWidth: backgroundColors[task.name] === 'blue' ? '4px' : '0',
                                                            borderStyle: backgroundColors[task.name] === 'blue' ? 'solid' : 'none',
                                                        }}
                                                        onClick={() => {
                                                            handleModal('blue', 'Pending Review', task.name);
                                                        }}
                                                    ><span class="tooltiptext">C</span>
                                                    </div>
                                                    <div className='tooltip'
                                                        style={{
                                                            height: '1rem',
                                                            width: '1rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#00f900',
                                                            borderColor: backgroundColors[task.name] === 'green' ? 'white' : '',
                                                            borderWidth: backgroundColors[task.name] === 'green' ? '4px' : '0',
                                                            borderStyle: backgroundColors[task.name] === 'green' ? 'solid' : 'none',
                                                        }}
                                                        onClick={() => {
                                                            handleModal('green', 'Completed', task.name);
                                                        }}
                                                    ><span class="tooltiptext">D</span>
                                                    </div>
                                                </div>
                                            </div> */}

                                                <div onClick={() => handleExpandToggle(task.name)}>
                                                    {expandStates[task.name] ? (
                                                        <IoIosArrowUp />
                                                    ) : (
                                                        <IoIosArrowDown />
                                                    )}
                                                </div>
                                            </StyledDiv>
                                        </div>
                                        {expandStates[task.name] && (
                                            <AcquisitionsDetails
                                                setSubTaskListValue={setSubTaskListValue}
                                                setSubTaskStatus={setSubTaskStatus}
                                                task={{ ...task, taskDescription: taskDescription, taskPriority: taskPriority }}
                                            />
                                        )}
                                    </form>
                                </div>
                            ))
                        ) : (
                            <div>
                                <h1>No Tasks............!</h1>
                            </div>
                        )}
                        <Link to='/home/addTask'>
                            <StyledDiv
                                style={{
                                    background: '#06545c5e',
                                }}
                            >
                                <h3>Add new</h3>
                            </StyledDiv>
                        </Link>
                    </div>
                </div>
                {showChat && (
                    <AcquisitionsChat
                        setShowChat={setShowChat}
                        activeChatName={activeChatName}
                        showChat={showChat}
                    />
                )}
                {attachment &&
                    <AddAttachments
                        taskName={taskNameForAttachment}
                        handleAttchementClose={handleAttchementClose}
                    />
                }

                {showModal &&
                    <AcquisitionsAlert
                        setShowModal={setShowModal}
                        color={color} showModal={showModal}
                        updateColor={updateColor}
                        settinName={settinName}
                    />
                }

                {asssinged &&
                    <AssingedTopop
                        setAsssinged={setAsssinged}
                        activeChatName={activeChatName}
                        fetchData={fetchData}
                        team={team}
                        projectId={projectId}
                        stages={stages}
                    />
                }

            </div>

            <ToastContainer /> {/* Add ToastContainer here */}
        </>
    );
}

export default AcquisitionPopUp;

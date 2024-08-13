import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { getUsers } from '../Acquisitions/AcquisitionsApi';
import { ToastContainer, toast } from 'react-toastify'; // Default import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

// Styled components
const StyledDiv = styled.div`
    position: absolute;
    top: 0rem;
    width: 100%;
    padding-bottom: 20px;
    box-sizing: border-box;
    background-color: rgb(13, 130, 142);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SubStyledDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const PopupOpacity = styled.div`
    display: flex;
    background: white;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    opacity: 0.8;
    justify-content: center;
    align-items: center;
`;

const PopupDiv = styled.div`
    position: relative;
    border-radius: 0.5rem;
    background-color: #06545c;
    height: 10rem;
    width: 19%;
    padding: 10px;
    padding-top: 20px;
`;

const DropdownContainer = styled.div`
    position: relative;
    top: 0;
    left: 0;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-height: 300px;
    overflow-y: auto;
    z-index: 2;
`;

const DropdownItem = styled.div`
    color: black;
    padding: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;

function AddNewTask({ setAddingTask }) {
    const [popUp, setPopup] = useState(false);
    const [subTask, setSubTask] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const navigate = useNavigate();

    let projectName = localStorage.getItem('projectName');
    let team = localStorage.getItem('team');
    let stage = localStorage.getItem('stage');

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

    const handleClose = () => navigate(-1);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = users.filter(user => user.toLowerCase().includes(lowercasedSearchTerm));
        setFilteredUsers(filtered);
        setDropdownVisible(lowercasedSearchTerm.length > 0 && filtered.length > 0);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            let res = await getUsers();
            let data = res.data.message;
            setUsers(data);
            setFilteredUsers(data); // Initialize filteredUsers with the full user list
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        let form = new FormData(e.target);
        let formObj = Object.fromEntries(form.entries());
        formObj.team = team;
        formObj.project = projectName;
        formObj.stages = stage;

        try {
            await axios.post("http://10.10.0.33/api/method/task_create", { data: formObj }, { withCredentials: true });
            handleSuccess('Task added successfully!');
            setTimeout(() => {
                navigate(-1)
            }, 2000)
        } catch (error) {
            handleError('Failed to add task. Please try again.', error.response.data.exception);
            console.error(error.response.data.exception);
        }

        console.log("formObj = ", formObj);
    };

    const handlePopUpClose = () => setPopup(false);

    const handlePopUpAdd = () => {
        alert("added");
        setAddingTask(false);
    };

    const handleSubTask = () => setSubTask(!subTask);

    const handleUserSelect = (user) => {
        setDropdownVisible(false);
        setSelectedUser(user);
        setSearchTerm(user);
    };

    return (
        <StyledDiv>
            <h1>Add Task Details here</h1>
            <SubStyledDiv>
                <form onSubmit={handleAdd}>
                    {/* Form Content */}
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 200px', gap: '25px', alignItems: 'center', justifyContent: 'center' }}>
                        <div>
                            <h4>Project Name</h4>
                            <p>{projectName}</p>
                        </div>
                        <div>
                            <h4>Team</h4>
                            <p>{team}</p>
                        </div>
                        <div>
                            <h4>Stage</h4>
                            <p>{stage}</p>
                        </div>
                    </div>
                    <div style={{ gap: '10px', alignItems: 'center' }}>
                        <h4>Task Name:</h4>
                        <input required name='task_name' style={{ background: 'white', height: '2rem', borderRadius: '0.5rem', color: 'black' }}></input>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 200px', gap: '25px', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ gap: '10px', alignItems: 'center' }}>
                            <h4>Start Date:</h4>
                            <input required name='start_date' type='date' style={{ background: 'white', height: '2rem', borderRadius: '0.5rem', color: 'black' }}></input>
                        </div>
                        <div style={{ gap: '10px', alignItems: 'center' }}>
                            <h4>End Date:</h4>
                            <input required name='end_date' type='date' style={{ background: 'white', height: '2rem', borderRadius: '0.5rem', color: 'black' }}></input>
                        </div>
                    </div>
                    <div>
                        <div style={{ gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                            <h4>Assign User</h4>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                required
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ background: "white", color: 'black', height: '1rem', width: '40%', borderRadius: '0.5rem', padding: '0.5rem' }}
                            />
                            {dropdownVisible && (
                                <DropdownContainer>
                                    {filteredUsers.map(user => (
                                        <DropdownItem key={user} onClick={() => handleUserSelect(user)}>
                                            {user}
                                        </DropdownItem>
                                    ))}
                                </DropdownContainer>
                            )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 200px', gap: '25px', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ gap: '10px', alignItems: 'center' }}>
                                <h4>Priority</h4>
                                <select required name='priority' style={{ height: '2rem', width: '8rem', backgroundColor: 'white', color: 'black', borderRadius: '0.5rem' }}>
                                    <option value='Low'>Low</option>
                                    <option value='Medium'>Medium</option>
                                    <option value='High'>High</option>
                                    <option value='Urgent'>Urgent</option>
                                </select>
                            </div>
                            <div style={{ gap: '10px', alignItems: 'center' }}>
                                <h4>Sub Status</h4>
                                <select required name='sub_status' style={{ height: '2rem', width: '8rem', backgroundColor: 'white', color: 'black', borderRadius: '0.5rem' }}>
                                    <option value='Not yet started'>Not yet started</option>
                                    <option value='In progress'>In progress</option>
                                    <option value='Awaiting response'>Awaiting response</option>
                                    <option value='Completed'>Completed</option>
                                </select>
                            </div>
                            <div style={{ gap: '10px', alignItems: 'center' }}>
                                <h4>Main Status:</h4>
                                <select required name='main_status' style={{ height: '2rem', width: '8rem', backgroundColor: 'white', color: 'black', borderRadius: '0.5rem' }}>
                                    <option value='Pending Review'>Pending Review</option>
                                    <option value='Completed'>Completed</option>
                                    <option value='Cancelled'>Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ gap: '10px', alignItems: 'center' }}>
                            <h4>Description</h4>
                            <textarea name='description' style={{ background: 'white', borderRadius: '0.5rem', color: 'black', width: '40%', height: '12rem' }}></textarea>
                        </div>
                        <div style={{ gap: '10px', alignItems: 'center' }}>
                            <h4>Attachment</h4>
                            <input name='attachment' type='file'></input>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <h4>Dependent Task</h4>
                            <input
                                name='dependent_task'
                                type="checkbox"
                                onClick={handleSubTask}
                                style={{ background: 'white' }}
                            ></input>
                        </div>
                        {subTask && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                                <h4>Parent Task Name</h4>
                                <input name='parent_task' style={{ background: 'white', height: '2rem', color: 'black', borderRadius: '0.5rem' }}></input>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '10px', gap: '20px', display: 'flex', justifyContent: 'center' }}>
                        <button type='button' onClick={handleClose}>Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </SubStyledDiv>
            {popUp && (
                <PopupOpacity>
                    <PopupDiv>
                        <h2>Are you sure you want to add..?</h2>
                        <button onClick={handlePopUpClose}>No</button>
                        <button onClick={handlePopUpAdd}>Yes</button>
                    </PopupDiv>
                </PopupOpacity>
            )}
            <ToastContainer /> {/* Add ToastContainer here */}
        </StyledDiv>
    );
}

export default AddNewTask;

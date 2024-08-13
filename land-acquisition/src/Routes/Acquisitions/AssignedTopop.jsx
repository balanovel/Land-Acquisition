import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { getUsers } from './AcquisitionsApi';
import axios from "axios";

const SubTaskDiv = styled.div`
    position: relative;
    border-radius: 1rem;
    background-color: #06545c;
    height: 12rem;
    width:35rem;
    padding: 10px;
    gap: 20px;
`;

const TaskOpacity = styled.div`
    display: flex;
    background: black;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    opacity: 1;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const DropdownContainer = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-height: 200px;
    overflow-y: auto;
    z-index: 2;
`;

const DropdownItem = styled.div`
    color:black;
    padding: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;

function AssingedTopop({ setAsssinged, activeChatName, fetchData, team, projectId, stages }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            let res = await getUsers();
            let data = res.data.message;
            setUsers(data); // Assuming data is an array of user objects with an 'email' property
            setFilteredUsers(data); // Initialize filteredUsers with the full user list
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = users.filter(user => user.toLowerCase().includes(lowercasedSearchTerm));
        setFilteredUsers(filtered);
        setDropdownVisible(lowercasedSearchTerm.length > 0 && filtered.length > 0);
    }, [searchTerm, users]);

    const handleAssingedUser = (e) => {
        e.preventDefault();
        let sendingObj = { data: { name: activeChatName, assign_to: selectedUser } };

        axios.put("http://10.10.0.33/api/method/set_assign_to", sendingObj, { withCredentials: true })
            .then((res) => {
                fetchData(team, projectId, stages);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        setAsssinged(false);
    }

    const handleCloseNewTask = () => {
        setAsssinged(false);
    }

    const handleUserSelect = (user) => {
        setDropdownVisible(false);
        setSelectedUser(user);
        setSearchTerm(user);
    }

    return (
        <TaskOpacity>
            <SubTaskDiv>
                <form onSubmit={handleAssingedUser}>
                    <div style={{ display: "flex", flexDirection: 'column' }}>
                        <AiTwotoneCloseSquare size={24}
                            onClick={handleCloseNewTask}
                            style={{
                                background: 'red',
                                cursor: 'pointer'
                            }} />
                        <div style={{ position: 'relative' }}>
                            <h4>Assign User</h4>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    background: "white",
                                    color: 'black',
                                    height: '2rem',
                                    width: '80%',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem',
                                    marginBottom: '0.5rem'
                                }}
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

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <button type="submit">Add</button>
                        </div>
                    </div>
                </form>
            </SubTaskDiv>
        </TaskOpacity>
    );
}

export default AssingedTopop;

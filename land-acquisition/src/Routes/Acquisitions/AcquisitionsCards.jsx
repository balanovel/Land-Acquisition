import React, { useState } from 'react';
import AcquisitionPopUp from './AcquisitionPopUp';
import Modal from 'react-modal';
import { useNavigate } from 'react-router';
import { getDataBasedOnTeam } from './AcquisitionsApi';

//
import styled from 'styled-components';

Modal.setAppElement('#root');

const ProjectCards = ({ projects, team }) => {

    const [modalContent, setModalContent] = useState(null);
    const navigate = useNavigate();

    //card styles
    const cardStyle = {
        marginTop: "9rem",
        fontWeight: "bold",
        width: '100%',
        height: '50%',
        backgroundColor: '#06060696',
        borderBottomLeftRadius: '1rem',
        borderBottomRightRadius: '1rem',
        color: 'white',
        cursor: 'pointer'
    };

    const ProjectCardsContainer = styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    `

    const handleAddressClick = (name) => {
        // Find the task with the matching name
        localStorage.setItem('projectName', name)
        const selectedTask = projects.find(task => task.name === name);
        if (selectedTask) {
            console.log(selectedTask);
            setModalContent(selectedTask);
            navigate('/home/details', { state: { selectedTask, name }, team })
        }
    };

    return (
        <ProjectCardsContainer >
            {projects.map((item) => (
                <div onClick={() => { handleAddressClick(item.name) }}
                    key={item.name} // Use a unique identifier, ideally something like item.id
                    className="card"
                    style={{
                        backgroundImage: item.property_image ? `url(http://10.10.0.33/${item.property_image})` : '',
                        height: "18rem",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        margin: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: '15rem'
                    }}
                >
                    <div style={cardStyle} >
                        {item.name} <br />
                        <progress value={25} max={100} />
                        <progress value={75} max={100} />
                        <progress value={50} max={100} /> <br />
                        ${item.lot_price}<br />
                        {item.lot_area} acres lot
                    </div>
                </div>
            ))}
        </ProjectCardsContainer>
    );
};

export default ProjectCards;

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { LuSendHorizonal, LuPaperclip } from "react-icons/lu";
import { getChat } from './AcquisitionsApi';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Styled container for the chat
const ChatContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background-color: #06545c;
    height: 100vh;
    width: 40%;
    transform: translateX(100%); /* Hidden by default (off-screen) */
    opacity: 0; /* Hidden by default (invisible) */
    transition: transform 0.3s ease, opacity 0.3s ease;

    ${props => props.show && css`
        transform: translateX(0); /* Slide in */
        opacity: 1; /* Fade in */
    `}
`;

// Container for messages
const MessageContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    margin-bottom: 4rem; /* Space for InputContainer */
`;

// Container for single message
const Messages = styled.div`
    color: ${props => props.issender ? '#000000' : '#ffffff'};
`;

// Styled chat bubble
const ChatBubble = styled.div`
    background-color: ${props => props.issender ? '#d1d1d1' : '#4a90e2'};
    color: ${props => props.issender ? '#000000' : '#ffffff'};
    padding: 0.5rem;
    border-radius: 1rem;
    margin: 0.5rem;
    max-width: 80%;
    align-self: ${props => props.issender ? 'flex-end' : 'flex-start'};
    text-align: left;
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
`;

// Sender's name and time styling
const Name = styled.span`
    font-weight: bold;
    margin-bottom: 0.25rem;
    color: ${props => props.issender ? '#000000' : '#ffffff'};
`;

const Time = styled.span`
    font-size: 0.75rem;
    color: ${props => props.issender ? '#000000' : '#ffffff'};
    margin-top: 0.25rem;
`;

// Textarea and send button container
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem;
    background-color: #1e3a3a;
    position: absolute;
    bottom: 0;
    width: 97%;
    box-shadow: 0 -1px 5px rgba(0,0,0,0.3);
`;

// Styled textarea
const Textarea = styled.textarea`
    width: 100%;
    padding: 0.4rem;
    background-color: #d1d1d1;
    color: black;
    border-radius: 0.6rem;
    margin-bottom: 0.5rem;
`;

// Attachment icon
const AttachmentIcon = styled.label`
    cursor: pointer;
    color: #ffffff;
    margin-right: 0.5rem;
    display: ${props => props.hide ? 'none' : 'block'};
`;

// Hidden file input
const FileInput = styled.input`
    display: none;
`;

// Send button icon
const SendIcon = styled(LuSendHorizonal)`
    cursor: pointer;
    color: #ffffff;
`;

// FileNameDisplay
const FileNameDisplay = styled.h4`
    color: #ffffff;
    margin: 0;
    margin-top: 0.5rem;
`;

// Cancel icon
const CancelIcon = styled(FaTimes)`
    cursor: pointer;
    color: #ffffff;
    margin-left: 0.5rem;
`;

// Adjusted AttachmentIcon to include flex layout for the icons
const AttachmentWrapper = styled.div`
    display: flex;
    align-items: center;
`;


export default function AcquisitionsChat({ setShowChat, activeChatName, showChat }) {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchChat(activeChatName);
    }, [activeChatName]);

    const fetchChat = async (activeChatName) => {
        try {
            let res = await getChat(activeChatName);
            let data = res.data.message;
            setMessages(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleClearFile = () => {
        setFile(null);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const formData = {};

            formData.message = newMessage;
            if (file) {
                formData.attachment = file;
            }
            formData.name = activeChatName;

            try {
                let result = await axios.post("http://10.10.0.33/api/method/add_chat", { data: formData }, { withCredentials: true });
                console.log("result = ", result);
                
            } catch (error) {
                
                console.error(error);
            }

            // Clear inputs
            setNewMessage('');
            setFile(null);

            // Fetch updated chat
            fetchChat(activeChatName);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <ChatContainer show={showChat}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <h4>{activeChatName}</h4>
                    <button onClick={() => { setShowChat(false) }}>Close</button>
                </div>

                <MessageContainer>
                    {
                        messages.length !== 0 ?
                            messages.map((m, index) => (
                                <ChatBubble key={index} issender={m.user_name === 'Sample1'}>
                                    <Name issender={m.user_name === 'Sample1'}>{m.user_name}</Name>
                                    <Messages issender={m.user_name === 'Sample1'}>{m.message}</Messages>
                                    <Time issender={m.user_name === 'Sample1'}>{m.date_and_time}</Time>
                                </ChatBubble>
                            ))
                            :
                            <p>No Messages</p>
                    }
                </MessageContainer>
                
                <InputContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '0.6rem' }}>
                        <Textarea
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <AttachmentWrapper>
                            <AttachmentIcon hide={file}>
                                <LuPaperclip />
                                <FileInput type="file" onChange={handleFileChange} />
                            </AttachmentIcon>
                        </AttachmentWrapper>
                        <SendIcon onClick={handleSendMessage} />
                    </div>
                    {file &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '0.6rem' }}>
                            {file && <FileNameDisplay>{file.name}</FileNameDisplay>}
                            {file && <CancelIcon onClick={handleClearFile} />}
                        </div>
                    }
                </InputContainer>
            </div>
        </ChatContainer>
    );
}

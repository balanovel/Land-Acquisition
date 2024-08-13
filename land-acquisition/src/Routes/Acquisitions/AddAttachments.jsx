import React, { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import styled from 'styled-components';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
//toast
import { ToastContainer, toast } from 'react-toastify'; // Default import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS


const AttachmentOpacity = styled.div`
    display: flex;
    background: black;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    // opacity: 0.9;
    justify-content: center;
    align-items: center;
`;

const AttachementDiv = styled.div`
    position: relative;
    border-radius: 1rem;
    background-color: #06545c;
    height: auto;
    width: 50%;
    padding: 10px;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const FileList = styled.ul`
    list-style-type: none;
    padding: 1rem;
    width: 100%;
`;

const FileItem = styled.li`
    color: white;
    margin: 5px 0;
    padding-right: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const RemoveButton = styled.button`
    background: transparent;
    color: red;
    border: none;
    cursor: pointer;
    font-size: 14px;
    &:hover {
        text-decoration: underline;
    }
`;

const ClearButton = styled.button`
    margin-top: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
        background-color: darkred;
    }
`;

const SaveButton = styled.button`
    margin-top: 10px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
        background-color: darkgreen;
    }
`;

export default function AddAttachments({ taskName, handleAttchementClose }) {
    const [attachments, setAttachments] = useState([]);


    // Toast Notifications
    const handleSuccess = (message) => {
        toast.success(message, { toastId: "success" }); // Use default toast success method
    };

    const handleError = (message) => {
        toast.error(message, { toastId: "error" }); // Use default toast error method
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAttachments(prevFiles => [...prevFiles, ...files]);
    };

    const handleRemoveAttachment = (index) => {
        setAttachments(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleClearAttachments = () => {
        setAttachments([]);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSaveAttachments = async () => {
        attachments.forEach((file) => {
            console.log(file.name);

        })

        // const base64Promises = attachments.map(file => convertToBase64(file));
        // const base64Files = await Promise.all(base64Promises);

        // const base64Payload = {
        //     rawFiles: attachments,
        //     base64Files,
        //     id: taskName,
        // };

        // console.log(base64Payload);


        // axios.post('https://10.10.0.30/api/method/upload_attachment', formData)
        //     .then((res) => {
        //         console.log('Attachments successfully uploaded!');

        //     })
        //     .catch((err) => {
        //         console.error('Error uploading attachments:', err);

        //     })

        // Code Dev
        attachments.map(async (file) => {
            try {
                const fileUploadUrl = 'http://10.10.0.33/api/method/upload_file';
                const formData = new FormData();
                formData.append('file', file);

                const fileUploadResponse = await axios.post(fileUploadUrl, { formData, doctype: "Task", docname: taskName, filename: file.name, file_url: `/files/${file.name}` }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
                handleSuccess('Attachments Added Sucessfully!');

                console.log('File upload response:', fileUploadResponse.data);

                if (!fileUploadResponse.data.message || !fileUploadResponse.data.message.file_url) {
                    throw new Error('File upload failed or response is missing file URL');
                    handleError('File upload failed or response is missing file URL')
                }

                const fileUrl = fileUploadResponse.data.message.file_url;

                console.log('File uploaded:', fileUrl);

                return fileUrl;
            } catch (error) {
                // console.error('File upload error:', error.response ? error.response.data : error.message);
                handleError('File upload failed, Please try again ')
                throw new Error('File upload failed: ' + (error.response ? error.response.data : error.message));
            }
        });
    };

    return (
        <AttachmentOpacity>
            <AttachementDiv>
                <FaWindowClose
                    size={24}
                    onClick={handleAttchementClose}
                    style={{
                        color: 'red',
                        position: 'absolute',
                        top: '5px',
                        right: '6px',
                        cursor: 'pointer'
                    }}
                />

                {attachments.length <= 10 ? <input
                    type='file'
                    multiple
                    onChange={handleFileChange}
                />
                    :
                    <p style={{ color: 'Yellow', paddingLeft: '1rem' }} >Only 10 Attachements are permitted!!!!!</p>
                }

                {/* Display selected file names with remove button */}
                {attachments.length > 0 && (
                    <>
                        <FileList>
                            {attachments.map((file, index) => (
                                <FileItem key={index}>
                                    {file.name}
                                    <RemoveButton onClick={() => handleRemoveAttachment(index)}>
                                        <MdCancel />
                                    </RemoveButton>
                                </FileItem>
                            ))}
                        </FileList>
                        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '1rem' }}>
                            <ClearButton onClick={handleClearAttachments}>
                                Clear All
                            </ClearButton>
                            {attachments.length <= 10 &&
                                <SaveButton onClick={handleSaveAttachments}>
                                    Save
                                </SaveButton>
                            }
                        </div>
                    </>
                )}
            </AttachementDiv>
            <ToastContainer /> {/* Add ToastContainer here */}
        </AttachmentOpacity>
    );
}

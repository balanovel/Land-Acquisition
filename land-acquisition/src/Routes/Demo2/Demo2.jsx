import React, { useState } from 'react';
import axios from 'axios';

function ApiComponent() {
    const [taskName, setTaskName] = useState('');
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleApiCall = async () => {
        try {
            // Step 1: Login to Frappe
            const loginUrl = 'http://10.10.0.33/api/method/login';
            const loginResponse = await axios.post(loginUrl, {
                usr: 'visweswaran@noveloffice.com',
                pwd: 'Novel@123'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Important for maintaining session
            });

            if (loginResponse.data.message !== "Logged In") {
                throw new Error('Login failed');
            }

            // Step 2: Upload the file to Frappe
            const fileUploadUrl = 'http://10.10.0.33/api/method/upload_file';
            const formData = new FormData();
            formData.append('file', file);

            const fileUploadResponse = await axios.post(fileUploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true // Important for maintaining session
            });

            if (!fileUploadResponse.data.message) {
                throw new Error('File upload failed');
            }

            const fileUrl = fileUploadResponse.data.message.file_url;
            console.log('File uploaded:', fileUrl);

            // Step 3: Call the API to add a task with the uploaded file
            const apiUrl = 'http://10.10.0.33/api/method/sourcingchildattachmentapi';
            const params = {
                task_name: taskName,
                file_url: fileUrl,
                parent_doctype: 'Sourcing',
                parent_name: 'SOURCEID00001'
            };

            const apiResponse = await axios.post(apiUrl, params, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Important for maintaining session
            });

            console.log('Success:', apiResponse.data);
            setSuccessMessage('API call successful: ' + apiResponse.data.message);
            setErrorMessage('');  // Clear error message
            setTaskName('');  // Clear the input field after successful submission
            setFile(null); // Clear the file input
        } catch (error) {
            console.error('Error calling API:', error);
            setErrorMessage('Error: ' + error.message);
            setSuccessMessage('');  // Clear success message
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '20px', width: '300px', margin: '20px auto' }}>
            <h2>API Call Example</h2>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                style={{ padding: '10px', margin: '10px 0', width: '100%' }}
            />
            <input
                type="file"
                onChange={handleFileChange}
                style={{ padding: '10px', margin: '10px 0', width: '100%' }}
            />
            <button
                onClick={handleApiCall}
                style={{ padding: '10px 20px', color: '#fff', backgroundColor: '#008080', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
                Submit
            </button>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
        </div>
    );
}

export default ApiComponent;

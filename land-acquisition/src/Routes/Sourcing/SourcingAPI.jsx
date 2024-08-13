import axios from 'axios';

// Login function to authenticate and get cookies
const login = async (userName, passWord) => {
    const loginUrl = 'http://10.10.0.33/api/method/login';
    const credentials = {
        usr: userName,
        pwd: passWord
    };

    try {
        console.log('Attempting to login...');
        const response = await axios.post(loginUrl, credentials, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        console.log('Login response:', response.data);

        if (response.data.message !== "Logged In") {
            throw new Error('Login failed');
        }

        return response.data


    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw new Error('Login failed: ' + (error.response ? error.response.data : error.message));
    }
};

// Login function to authenticate and get cookies
const logout = async () => {
    const loginUrl = 'http://10.10.0.33/api/method/logout';

    try {
        console.log('Attempting to logout...');
        const response = await axios.get(loginUrl, {
            // headers: { 'Content-Type': 'application/json' },
            // withCredentials: true
        });

        console.log('Login response:', response.data);

        return true;
    } catch (error) {
        console.error('Logout error:', error.response ? error.response.data : error.message);
        throw new Error('Logout failed: ' + (error.response ? error.response.data : error.message));
    }
};
// export function login

// Fetch data function to get the sourcing data
const fetchSourcingData = async () => {
    try {

        const apiUrl = 'http://10.10.0.33/api/method/sourcingchildtabledata';
        const response = await axios.get(apiUrl, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        console.log('Fetch response:', response.data);

        if (!response.data || typeof response.data.message !== 'object') {
            throw new Error('API response data is undefined or not an object');
        }

        console.log('Data fetched successfully:', response.data.message);
        return response.data.message;
    } catch (error) {
        console.error('Error calling API:', error.response ? error.response.data : error.message);
        throw new Error('Fetching data failed: ' + (error.response ? error.response.data : error.message));
    }
};

// Function to upload file
const uploadFile = async (file) => {
    try {
        const fileUploadUrl = 'http://10.10.0.33/api/method/upload_file';
        const formData = new FormData();
        formData.append('file', file);

        const fileUploadResponse = await axios.post(fileUploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        console.log('File upload response:', fileUploadResponse.data);

        if (!fileUploadResponse.data.message || !fileUploadResponse.data.message.file_url) {
            throw new Error('File upload failed or response is missing file URL');
        }

        const fileUrl = fileUploadResponse.data.message.file_url;

        console.log('File uploaded:', fileUrl);

        return fileUrl;
    } catch (error) {
        console.error('File upload error:', error.response ? error.response.data : error.message);
        throw new Error('File upload failed: ' + (error.response ? error.response.data : error.message));
    }
};


const updateStatus = async (name, task, status, fileUrl, remarks) => {
    try {
        const updateUrl = 'http://10.10.0.33/api/method/sourcingchildapi';
        const updatedObject = {
            data: {
                parent_name: name,
                task_name: task,
                status: status,
                // file_url: `http://10.10.11.120/${fileUrl}`
                file_url: fileUrl,
                remarks: remarks
            }
        }
        const headersObj = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const response = await axios.put(updateUrl, updatedObject, headersObj);

        console.log('Status update response:', response);
        console.log(name, task, status, `http://10.10.0.33/${fileUrl}`);

        if (!response.data.status || response.data.status !== 'success') {
            throw new Error('Status update failed');
        }
    } catch (error) {

    }
};


export { fetchSourcingData, uploadFile, updateStatus, login, logout };

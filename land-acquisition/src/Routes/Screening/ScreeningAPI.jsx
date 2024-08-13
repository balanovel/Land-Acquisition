import axios from 'axios';

let cachedData = null;

const login = async (userName, passWord) => {
    const loginUrl = 'http://10.10.0.33/api/method/login';
    const credentials = {
        usr: userName,
        pwd: passWord
    };

    const response = await axios.post(loginUrl, credentials, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    if (response.data.message !== "Logged In") {
        throw new Error('Login failed');
    }

    return response;
};

const fetchScreeningData = async () => {
    if (cachedData && cachedData.screeningData) {
        return cachedData.screeningData;
    }
    try {
        // await login();
        const apiUrl = 'http://10.10.0.33/api/method/fetchyetobescreenedData';
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        if (!response.data || !response.data.message) {
            throw new Error('API response data is undefined or missing');
        }

        cachedData = { ...cachedData, screeningData: response.data.message };
        return response.data.message;
    } catch (error) {
        console.error('Error calling API:', error);
        throw error;
    }
};

const fetchGridData = async () => {
    if (cachedData && cachedData.gridData) {
        return cachedData.gridData;
    }
    try {
        const apiUrl = 'http://10.10.0.33/api/method/totalotsdata';
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        if (!response.data || !response.data.message) {
            throw new Error('API response data is undefined');
        }

        const data = Object.values(response.data.message);

        if (!Array.isArray(data)) {
            throw new Error('Expected an array but got ' + typeof data);
        }

        cachedData = { ...cachedData, gridData: data };
        return data;
    } catch (error) {
        console.error('Error fetching grid data:', error);
        throw error;
    }
};

const fetchQohData = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchqohdata');
        return response.data.message;
    } catch (error) {
        console.error('Error fetching QOH data:', error);
        throw error;
    }
};

const fetchQualifiedData = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchqadata');
        return response.data.message['Qualified Qualified'];
    } catch (error) {
        console.error('Error fetching qualified data:', error);
        throw error;
    }
};


const fetchQRejectedData = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchqrejecteddata');
        return response.data.message['Qualified Rejected'];
    } catch (error) {
        console.error('Error fetching rejected data:', error);
        throw error;
    }
}

const fetchQipData = async () => {
    if (cachedData && cachedData.qipData) {
        return cachedData.qipData;
    }
    try {
        const apiUrl = 'http://10.10.0.33/api/method/fetchqipdata';
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        if (!response.data || !response.data.message) {
            throw new Error('API response data is undefined or missing');
        }

        const qipValue = response.data.message['Open'];
        cachedData = { ...cachedData, qipData: qipValue };
        return qipValue;
    } catch (error) {
        console.error('Error calling API:', error.message);
        throw error;
    }
};
const fetchQualifiedPenData = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/qualified_pen', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        console.log('Full API Response:', response);
        console.log('In Progress Data:', response.data.message);

        return response.data.message; // Ensure this is what you need
    } catch (error) {
        console.error('Error fetching In Progress data:', error);
        throw error;
    }
};









const ScreeningAPI = {
    fetchScreeningData,
    fetchGridData,
    fetchQohData,
    fetchQualifiedData,
    fetchQRejectedData,
    fetchQipData,
    fetchQualifiedPenData, // Add the new function here

};

export default ScreeningAPI;

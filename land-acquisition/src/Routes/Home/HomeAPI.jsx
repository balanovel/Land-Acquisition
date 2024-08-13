// HomeAPI.jsx
import axios from 'axios';

export const fetchSourcingCount = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchsourcingcount');
        const { Pending, Completed, Cancelled } = response.data.message;
        return {
            Pending,
            Completed,
            Cancelled,
            total: Pending + Completed + Cancelled
        };
    } catch (error) {
        console.error('Error fetching the sourcing count:', error);
        throw error;
    }
};


export const fetchScreeningCount = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchyetobescreenedData', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return response.data.message["Yet to be screened"];
    } catch (error) {
        console.error('Error fetching the screening count:', error);
        throw error;
    }
};
export const fetchAnalysisCount = async () => {
    try {
        const response = await fetch('http://10.10.0.33/api/method/analysisdatacount');
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching analysis data:', error);
        return {};
    }
};
export const fetchActiveCount = async () => {
    try {
        const response = await axios.get('http://10.10.0.33/api/method/fetchactivecount');
        const { active_project_count } = response.data.message;
        return active_project_count;
    } catch (error) {
        console.error('Error fetching active count:', error);
        throw error;
    }
};


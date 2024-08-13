
import axios from 'axios';

const AnalysisAPI = {
    fetchAnalysisData: async () => {
        try {
            const response = await fetch('http://10.10.0.33/api/method/analysisdatacount');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.message; // Adjust according to the actual API response structure
        } catch (error) {
            console.error('Failed to fetch analysis data:', error);
            throw error;
        }
    },

    fetchTotalLotsInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_total_lots_info');
        return response.data.message;
    },

    fetchYetToBeAnalysedInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_yet_to_be_analysed_info');
        return response.data;
    }, 
    fetchShortlistedInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_shortlisted_info');
        return response.data.message;
    },

    fetchSelectedInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_selected_info');
        return response.data.message;
    },
    
    fetchNeedInputInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_need_input_info');
        return response.data; // Adjust according to the actual API response structure
    },  
    fetchRejectedInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_rejected_info');
        return response.data; // Adjust according to the actual API response structure
    },
    fetchOnHoldInfo: async () => {
        const response = await axios.get('http://10.10.0.33/api/method/analysis_onhold_info');
        return response.data.message;
    },
    // Add this method to AnalysisAPI
fetchOnSiteInfo: async () => {
    const response = await axios.get('http://10.10.0.33/api/method/analysis_need_input_acquisition_info');
    return response.data.message; // Adjust according to the actual API response structure
},
fetchNeedInputOnsiteInfo: async () => {
    const response = await axios.get('http://10.10.0.33/api/method/analysis_need_input_onsite_info');
    return response.data.message; // Adjust according to the actual API response structure
},





};

export default AnalysisAPI;

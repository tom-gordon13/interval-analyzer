import axios from 'axios';

const serverPort = process.env.REACT_APP_SERVER_PORT;

export const updateActivityDetails = async (activityId, updateData, accessToken) => {
    try {
        const response = await axios.put(`http://localhost:${serverPort}/activity-basic/${activityId}`, updateData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Activity updated successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error updating activity:', error.response.data.message || error.message);
        } else {
            console.error('Error updating activity:', error.message);
        }
    }
};

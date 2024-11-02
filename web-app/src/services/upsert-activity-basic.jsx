import axios from 'axios';

const serverPort = 3000

export const upsertActivityBasic = async (userId, activityData, accessToken) => {
    try {
        const response = await axios.post(
            `http://localhost:${serverPort}/user/${userId}/activity-basic/${activityData.id}`,
            activityData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data; // Access the response data
        console.log('Activity upserted successfully:', data);
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error upserting activity:', error.response?.data?.message || error.message);
    }
};
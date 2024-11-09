import axios from 'axios';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const upsertActivityBasic = async (userId, activityData, accessToken) => {
    activityData.activity_id = String(activityData.activity_id)
    try {
        const response = await axios.put(
            `http://localhost:${serverPort}/user/${userId}/activity-basic/${activityData.id}`,
            activityData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data;
        console.log('Activity upserted successfully:', data);
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error upserting activity:', error.response?.data?.message || error.message);
    }
};
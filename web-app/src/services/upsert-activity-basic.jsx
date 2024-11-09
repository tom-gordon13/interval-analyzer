import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const upsertActivityBasic = async (userId, activityData) => {
    activityData.activity_id = String(activityData.activity_id)
    const accessToken = getCookie('stravaAccessToken')

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
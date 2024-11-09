import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const upsertEditedActivity = async (activityData) => {
    const activity_id = String(activityData.id)
    const accessToken = getCookie('stravaAccessToken')
    try {
        const response = await axios.post(
            `http://localhost:${serverPort}/activity/${activity_id}/edited-activity`,
            activityData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data;
        console.log('Edited activity upserted successfully:', data);
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error upserting activity:', error.response?.data?.message || error.message);
    }
};
import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const fetchedEditedActivity = async (activityId) => {
    const accessToken = getCookie('stravaAccessToken')
    try {
        const response = await axios.get(
            `http://localhost:${serverPort}/activity/${activityId}/edited-activity`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        console.log('here', response)

        const data = response.data;
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error fetching edited activity:', error.response?.data?.message || error.message);
    }
};
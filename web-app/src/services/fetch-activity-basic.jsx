import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const fetchActivityBasic = async (userId, quantity) => {
    const accessToken = getCookie('stravaAccessToken')
    try {
        const response = await axios.get(
            `http://localhost:${serverPort}/user/${userId}/activity-basic/`,
            { quantity: quantity },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = response.data;
        return data;
    } catch (error) {
        // Handle errors
        console.error('Error upserting activity:', error.response?.data?.message || error.message);
    }
};
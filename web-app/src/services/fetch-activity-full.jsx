import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = 3000

export const fetchActivityFull = async (activityId) => {
    const stravaAccessToken = getCookie('stravaAccessToken')
    try {
        const response = await axios.get(`http://localhost:${serverPort}/activity/${activityId}`, {
            headers: {
                Authorization: `Bearer ${stravaAccessToken}`
            }
        })
        return response.data
    } catch (err) {
        console.log(err.message);
    }
};
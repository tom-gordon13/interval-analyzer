import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

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
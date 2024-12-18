import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

const serverPort = process.env.REACT_APP_SERVER_PORT

export const fetchActivitiesSummary = async (before, after) => {
    const stravaAccessToken = getCookie('stravaAccessToken')

    try {
        const response = await axios.get(`http://localhost:${serverPort}/activity?before=${before}&after=${after}`, {
            headers: {
                Authorization: `Bearer ${stravaAccessToken}`
            }
        })
        return response
    } catch (err) {
        console.log(err.message);
    }
};
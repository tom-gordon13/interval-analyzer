import axios from 'axios';

const serverPort = 3000

export const fetchActivityFull = async (stravaAccessToken, activityId) => {
    console.log(`http://localhost:${serverPort}/activity/${activityId}`)

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
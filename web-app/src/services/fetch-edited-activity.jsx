import axios from 'axios';

const serverPort = 3000

export const fetchedEditedActivity = async (activityId, accessToken) => {
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
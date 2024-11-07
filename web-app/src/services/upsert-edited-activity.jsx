import axios from 'axios';

const serverPort = 3000

export const upsertEditedActivity = async (activityData, accessToken) => {
    const activity_id = String(activityData.id)
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
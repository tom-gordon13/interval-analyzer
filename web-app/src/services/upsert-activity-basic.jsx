import axios from 'axios';

const serverPort = 3000

export const upsertActivityBasic = async (userId, activityData, accessToken) => {
    try {
        const response = await fetch(`http://localhost:${serverPort}/user/${userId}/activity-basic/${activityData.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(activityData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upsert activity');
        }
        const data = await response.json();
        console.log('Activity upserted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error upserting activity:', error.message);
    }
};
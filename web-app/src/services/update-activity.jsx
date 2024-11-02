import axios from 'axios';

const serverPort = 3000

export const updateActivityDetails = async (activityId, updateData, accessToken) => {
    try {
        const response = await fetch(`http://localhost:${serverPort}/activity-basic/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update activity');
        }
        const data = await response.json();
        console.log('Activity updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error updating activity:', error.message);
    }
};
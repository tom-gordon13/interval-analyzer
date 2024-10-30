import axios from 'axios';

const serverPort = 3000
// /**
//  * Updates a Strava activity's details.
//  * @param {string} accessToken - Your Strava access token.
//  * @param {number} activityId - The ID of the activity to update.
//  * @param {object} updates - An object containing the fields to update.
//  * @returns {Promise<object>} - The updated activity data.
//  */
// export const updateStravaActivity = async (accessToken, activityId, updates) => {
//     try {
//         const response = await axios.put(
//             `https://www.strava.com/api/v3/activities/${activityId}`,
//             updates,
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         console.log('Activity updated successfully:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error updating activity:', error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

export const updateActivityDetails = async (activityId, updateData, accessToken) => {
    try {
        const response = await fetch(`http://localhost:${serverPort}/activity/${activityId}`, {  // Change to your server URL
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
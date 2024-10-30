const axios = require('axios');

/**
 * Updates a Strava activity's details.
 * @param {string} accessToken - Your Strava access token.
 * @param {number} activityId - The ID of the activity to update.
 * @param {object} updates - An object containing the fields to update.
 * @returns {Promise<object>} - The updated activity data.
 */

const updateActivityDetails = async (req, res, next) => {
    const { activityId } = req.params;
    const updates = req.body
    const { accessToken } = req

    try {
        const response = await axios.put(
            `https://www.strava.com/api/v3/activities/${activityId}`,
            updates,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Activity updated successfully');
        req.updatedActivity = response.data

        next();
    } catch (error) {
        console.error('Error updating activity:', error.response ? error.response.data : error.message);
        throw error;
    }
};


module.exports = updateActivityDetails;
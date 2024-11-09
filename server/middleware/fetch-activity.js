const axios = require('axios');

const getActivityDetails = async (req, res, next) => {

    try {
        const { activityId } = req.params;
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ error: 'Access token is required' });
        }

        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        req.activityDetails = response.data;
        next();
    } catch (error) {
        console.error('Error fetching activity details:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to fetch activity details' });
    }
};

module.exports = getActivityDetails;

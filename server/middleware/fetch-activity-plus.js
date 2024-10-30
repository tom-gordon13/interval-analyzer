const axios = require('axios');

const fetchActivityDetails = async (req, res, next) => {
    const { activityId } = req.params;
    const accessToken = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

    try {
        // Fetch the main activity details
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}?include_all_efforts=true`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // Fetch additional data (streams and zones)
        const activityStreams = await fetchActivityStreams(accessToken, activityId);
        const activityZones = await fetchActivityZones(accessToken, activityId);

        // Attach the fetched data to the req object
        req.activityDetails = {
            ...response.data,
            streams: activityStreams,
            zones: activityZones,
        };

        // Call next() to pass control to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error fetching activity details:', error.response?.data || error.message);
        // Send an error response if something goes wrong
        res.status(500).json({ error: 'Failed to fetch activity details' });
    }
};


const fetchActivityStreams = async (accessToken, activityId) => {
    try {
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,altitude,heartrate,cadence,watts`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const activityStreams = response.data;

        return activityStreams;
    } catch (error) {
        console.error('Error fetching activity streams:', error);
        throw error;
    }
};

const fetchActivityZones = async (accessToken, activityId) => {
    try {

        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}/zones`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const activityZones = response.data;

        return activityZones;
    } catch (error) {
        console.error('Error fetching activity zones:', error);
        throw error;
    }
};

module.exports = fetchActivityDetails;
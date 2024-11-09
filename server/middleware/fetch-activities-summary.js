const axios = require('axios');

const fetchActivitiesSummmary = async (req, res, next) => {
    try {
        const { before, after } = req.query;
        const accessToken = req.headers.authorization?.split(' ')[1];

        const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&page=1&per_page=200`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        req.data = response.data
        next()
    } catch (error) {
        console.error("Error in / route:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = fetchActivitiesSummmary
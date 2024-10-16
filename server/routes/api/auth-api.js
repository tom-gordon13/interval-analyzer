const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

router.get('/api/environment', (req, res) => {
    const environmentVariables = {
        STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
        STRAVA_REDIRECT_URI: process.env.STRAVA_REDIRECT_URI,
    };
    res.json(environmentVariables);
});

router.post('/api/exchange-token', async (req, res) => {
    try {
        const { code } = req.body;

        // Exchanges authorization code for an access token
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        });

        const accessToken = response.data.access_token;

        res.json({ accessToken });
    } catch (error) {
        console.error('Error exchanging code for access token', error);
        res.status(500).json({ error: 'Failed to exchange code for access token' });
    }
});

router.get('/api/get-access-token', (req, res) => {
    const accessToken = req.cookies.stravaAccessToken;
    res.json({ accessToken });
});

module.exports = router;
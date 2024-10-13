const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');

// Define an API endpoint to expose environment variables
router.get('/api/environment', (req, res) => {
    const environmentVariables = {
        STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
        STRAVA_REDIRECT_URI: process.env.STRAVA_REDIRECT_URI,
        // Add more variables as needed
    };
    res.json(environmentVariables);
});

// Route to handle Strava OAuth callback
router.get('/strava-callback', async (req, res) => {
    try {
        const code = req.query.code;

        // Exchange the authorization code for an access token
        const tokenResponse = await axios.post('https://www.strava.com/oauth/token', querystring.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        // Set the access token as an HTTP-only cookie
        res.cookie('stravaAccessToken', accessToken);


        // Handle the access token (e.g., store it in your database)
        console.log('Received Access Token:', accessToken);

        // Redirect to a success page
        res.redirect('http://localhost:3001/');

    } catch (error) {
        console.error('Error handling Strava callback:', error);
        // Handle errors and redirect to an error page
        res.redirect('/error.html');
    }
});

// Route to get the access token
router.get('/api/get-access-token', (req, res) => {
    const accessToken = req.cookies.stravaAccessToken;
    res.json({ accessToken });
});

module.exports = router;
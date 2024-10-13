import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from '@mui/material';

const serverPort = 3000;


const AuthButton = () => {
    const [environmentVariables, setEnvironmentVariables] = useState({});

    const handleConnectToStrava = () => {
        const apiEndpoint = `http://localhost:${serverPort}/api/environment`
        axios.get(apiEndpoint)
            .then((response) => {
                const receivedVariables = response.data;
                // Store the received variables in the component state
                setEnvironmentVariables(receivedVariables);

                // Now you can access and use the environment variables
                const client_id = receivedVariables.STRAVA_CLIENT_ID;
                const redirect_uri = receivedVariables.STRAVA_REDIRECT_URI;
                // Use apiKey and apiSecret as needed

                const authorization_url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=read,activity:read_all`;

                window.location.href = authorization_url;
                // Make an API request to retrieve the access token

                axios.get('/api/get-access-token')
                    .then((response) => {
                        const accessToken = response.data.accessToken;
                        getUserInfo(accessToken)
                        Cookies.set('stravaAccessToken', accessToken, { expires: 0.25 });
                        const storedToken = Cookies.get('stravaAccessToken');
                        console.log(`Cookie stored - ${storedToken}`)
                    })
                    .catch((error) => {
                        console.error('Error fetching access token', error);
                    });

            })
            .catch((error) => {
                console.error('Error fetching environment variables', error);
            });
    };

    const getUserInfo = async (accessToken) => {
        try {
            const response = await axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log('User Information:', response.data);
        } catch (error) {
            console.error('Error fetching user information:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <Button variant='contained' onClick={handleConnectToStrava}>Click to authenticate with Strava</Button>
    );
};

export default AuthButton;
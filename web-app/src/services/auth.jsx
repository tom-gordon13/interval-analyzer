import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const serverPort = process.env.REACT_APP_SERVER_PORT;


const AuthButton = () => {
    const [environmentVariables, setEnvironmentVariables] = useState({});

    const handleConnectToStrava = async () => {
        const apiEndpoint = `http://localhost:${serverPort}/api/environment`;

        axios.get(apiEndpoint)
            .then((response) => {
                const receivedVariables = response.data;
                setEnvironmentVariables(receivedVariables);

                const client_id = receivedVariables.STRAVA_CLIENT_ID;
                const redirect_uri = receivedVariables.STRAVA_REDIRECT_URI;

                // Authorization URL for Strava OAuth
                const authorization_url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=read,activity:read_all,activity:write`;

                window.location.href = authorization_url;
            })
            .catch((error) => {
                console.error('Error fetching environment variables', error);
            });
    };

    return (
        <Button variant='contained' onClick={handleConnectToStrava}>Click to authenticate with Strava</Button>
    );
};

export default AuthButton;
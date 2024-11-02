import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const serverPort = 3000

const HandleStravaCallback = ({ setUser, user }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode && !user) {
            axios.post(`http://localhost:${serverPort}/api/exchange-token`,
                { code: authorizationCode },
            )
                .then(async response => {
                    const accessToken = response.data.accessToken;

                    // Store the token in cookies - !!bug here with expiration!!
                    Cookies.set('stravaAccessToken', accessToken, { expires: 0.25 });
                    console.log(`Access token stored in cookies: ${accessToken}`);

                    if (!user) await getUserInfo(accessToken);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Error exchanging authorization code for access token:', error);
                });
        } else {
            console.error('Authorization code not found in URL');
        }
    }, []);

    const getUserInfo = async (accessToken) => {
        try {
            const response = await axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user information:', error.response ? error.response.data : error.message);
        }
    };

    return <div>Connecting to Strava...</div>;
};

export default HandleStravaCallback;
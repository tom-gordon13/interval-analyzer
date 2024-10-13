import './activity-card.css';
import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';

function ActivityCard() {
    // Define the API endpoint
    const [activities, setActivities] = useState({});
    const [currAvitity, setCurrActivity] = useState({});

    // Make the API request
    function handleMostRecentClick() {
        const apiUrl = 'https://www.strava.com/api/v3/athlete/activities';

        // Set up the request headers with the access token
        const token = getCookie('stravaAccessToken')

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        axios.get(apiUrl, { headers })
            .then((response) => {
                // Handle the response data (list of recent activities)
                const activities = response.data;
                setActivities(activities)
                setCurrActivity(activities[0])
                console.log('Recent Activities:', activities);
            })
            .catch((error) => {
                console.error('Error fetching recent activities:', error);
            });
    }


    return (
        <div className="Activity">
            <button onClick={handleMostRecentClick}>
                Get most recent activity
            </button>
            <br />
            Most recent activity:
            <hr />
            Name: {currAvitity['name']}
            <br />
            Type: {currAvitity['sport_type']}
            <br />
            Date: {currAvitity['start_date']}
        </div>
    );
}

export default ActivityCard;
import React, { useState } from 'react';
import ActivitiesSummaryCard from './activities-summary-card';
import { getCookie } from '../utils/browser-helpers';
import axios from 'axios';
import { formatActivities } from '../utils/format-activities';
import { ActivitiesDropdown } from './activities-dropdown';
import { ActivityDialog } from './activity-dialog';

const today_beg = new Date()
today_beg.setHours(0, 0, 0, 0);
const today_end = new Date()
today_end.setHours(23, 59, 0, 0);

const axiosStrava = axios.create({
    baseURL: 'https://www.strava.com', // Set the Strava API base URL
    timeout: 10000, // Optional: Set a timeout for requests
});

export const ActivitiesContainer = ({

}) => {
    const [activities, setActivities] = useState({});
    const [activityObj, setActivityObj] = useState({});
    const [startDate, setStartDate] = useState(today_beg)
    const [endDate, setEndDate] = useState(today_end)
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showActivityDialog, setShowActivityDialog] = useState(false)
    const [showActivityDropdown, setShowActivityDropdown] = useState(false)

    const handleClose = () => {
        setShowActivityDialog(false)
    }

    const handleDateChange = (date, pickerType) => {
        if (pickerType === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const handleActivitiesSummaryClick = () => {
        const apiUrl = `/api/v3/athlete/activities?after=${startDate.getTime() / 1000}&before=${endDate.getTime() / 1000}&page=1&per_page=200`;
        // Set up the request headers with the access token
        const token = getCookie('stravaAccessToken')
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        axiosStrava.get(apiUrl, { headers })
            .then((response) => {
                // Handle the response data (list of recent activities)
                const activities = response.data;
                setActivities(activities)
                setActivityObj(formatActivities(activities))
                setShowActivityDropdown(true)
            })
            .catch((error) => {
                console.error('Error fetching recent activities:', error);
            });
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',

            }}
        >
            <ActivitiesSummaryCard
                activities={activities}
                handleActivitiesSummaryClick={handleActivitiesSummaryClick}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                handleDateChange={handleDateChange}
                activityObj={activityObj}
            />
            {showActivityDropdown && activities.length ? (<ActivitiesDropdown
                activities={Object.keys(activities).map(key => activities[key])}
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                showActivityDialog={showActivityDialog}
                setShowActivityDialog={setShowActivityDialog}
            />) : <h5>No activites found - update date range</h5>}

            {selectedActivity ? (<ActivityDialog
                open={showActivityDialog}
                onClose={handleClose}
                activity={selectedActivity}
            />) : null}

        </div>
    )

}
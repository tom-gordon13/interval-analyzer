import React, { useState } from 'react';
import ActivitiesSummaryCard from './ActivitiesSummaryCard';
import { getCookie } from '../../utils/browser-helpers';
import axios from 'axios';
import { formatActivities } from '../../utils/format-activities';
import { ActivitiesDropdown } from './ActivitiesDropdown';
import { ActivityDialog } from './ActivityDialog';

const today_beg = new Date()
today_beg.setHours(0, 0, 0, 0);
const today_end = new Date()
today_end.setHours(23, 59, 0, 0);

const axiosStrava = axios.create({
    baseURL: 'https://www.strava.com',
    timeout: 10000,
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
        const token = getCookie('stravaAccessToken')
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        axiosStrava.get(apiUrl, { headers })
            .then((response) => {
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
        <div className='flex flex-col flex-wrap items-center'>
            <ActivitiesSummaryCard
                activities={activities}
                handleActivitiesSummaryClick={handleActivitiesSummaryClick}
                startDate={startDate}
                endDate={endDate}
                handleDateChange={handleDateChange}
                activityObj={activityObj}
            />
            {showActivityDropdown && activities.length ? (<ActivitiesDropdown
                activities={Object.keys(activities).map(key => activities[key])}
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                setShowActivityDialog={setShowActivityDialog}
            />) : <h5>No activities found - update date range</h5>}

            {selectedActivity ? (<ActivityDialog
                open={showActivityDialog}
                onClose={handleClose}
                activity={selectedActivity}
                selectedActivity={selectedActivity}
            />) : null}
        </div>
    )

}
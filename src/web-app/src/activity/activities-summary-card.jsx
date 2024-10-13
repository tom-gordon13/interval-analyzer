import './activities-summary-card.css';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/browser-helpers';
import DatePicker from 'react-datepicker';
import { formatActivities } from '../utils/format-activities';
import { ActivityTypeSummary } from './activity-type-summary'
import { Button } from '@mui/material';


const ActivitiesSummaryCard = ({
    activities,
    handleActivitiesSummaryClick,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleDateChange,
    activityObj
}) => {
    // Define the API endpoint
    // const [activities, setActivities] = useState({});
    // const [activityObj, setActivityObj] = useState({});
    // const [startDate, setStartDate] = useState(today_beg)
    // const [endDate, setEndDate] = useState(today_end)

    // const handleDateChange = (date, pickerType) => {
    //     if (pickerType === 'start') {
    //         setStartDate(date);
    //     } else {
    //         setEndDate(date);
    //     }
    // };

    // Make the API request
    // const handleActivitiesSummaryClick = () => {
    //     const apiUrl = `/api/v3/athlete/activities?after=${startDate.getTime() / 1000}&before=${endDate.getTime() / 1000}&page=1&per_page=200`;
    //     // Set up the request headers with the access token
    //     const token = getCookie('stravaAccessToken')
    //     const headers = {
    //         'Authorization': `Bearer ${token}`,
    //     };

    //     axiosStrava.get(apiUrl, { headers })
    //         .then((response) => {
    //             // Handle the response data (list of recent activities)
    //             const activities = response.data;
    //             console.log(response)
    //             setActivities(activities)
    //             console.log('Recent Activities:', activities);
    //             setActivityObj(formatActivities(activities))
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching recent activities:', error);
    //         });
    // }


    return (
        <div className="activity-summary">
            <div className='date-container'>
                <div className='date-pick-box'>
                    <h5 className='date-pick-header'>Start Date</h5>
                    <DatePicker selected={startDate} onChange={(date) => handleDateChange(date, 'start')} />

                </div>
                <div className='date-pick-box'>
                    <h5 className='date-pick-header'>End Date</h5>
                    <DatePicker selected={endDate} onChange={(date) => handleDateChange(date, 'end')} />

                </div>
            </div>
            <br />
            <Button
                variant="contained"
                onClick={handleActivitiesSummaryClick}
            >
                Confirm Date Window
            </Button>
            <br />
            {activities.length ? (<div>Number of Activities: {activities.length}</div>) : ''}
            <div class='activity-types-container'>
                {activityObj && activities.length ?
                    Object.keys(activityObj).map((activityType, index) => (
                        <ActivityTypeSummary
                            key={`${activityType}-${index}`}
                            class='activity-type'
                            activityType={activityType}
                            activitySet={activityObj[activityType]} />
                    ))
                    : ''}
            </div>
        </div>
    );
}

export default ActivitiesSummaryCard;
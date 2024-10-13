import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getCookie } from '../utils/browser-helpers';
import { fetchActivityDetails } from '../utils/fetch-activity-details';

const token = getCookie('stravaAccessToken')
const supportedActivityTypes = ['Ride', 'VirtualRide']

export const ActivitiesDropdown = ({
    activities,
    selectedActivity,
    setSelectedActivity,
    showActivityDialog,
    setShowActivityDialog
}) => {

    const handleChange = async (event) => {
        if (!supportedActivityTypes.includes(event.target.value.type)) {
            alert('Unsupported activity type')
            return
        }
        const selectedActivityFull = await fetchActivityDetails(token, event.target.value)
        setSelectedActivity(selectedActivityFull);
        setShowActivityDialog(true)
    };

    return (
        <FormControl style={{
            margin: '1rem',
        }}>
            <InputLabel id="activity-select-label">Select Activity</InputLabel>
            <Select
                labelId="activity-select-label"
                id="activity-select"
                value={selectedActivity}
                onChange={handleChange}
                style={{
                    color: 'white',
                    backgroundColor: 'white'
                }}
            >
                {activities.map((activity, index) => (
                    <MenuItem key={index} value={activity}>
                        {activity.name}  ---  {activity.type}  ({activity.start_date.substring(0, 10)})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


import React, { useState, useEffect, useMemo } from 'react';
import { ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { fetchActivityFull } from '../../services/fetch-activity-full';


export const RecentActivityItem = ({ activity, setSelectedActivity }) => {
    const date = new Date(activity.activity_date);
    const activityDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const handleClick = async (e) => {
        const selectedActivityFull = await fetchActivityFull(activity.activity_id)
        setSelectedActivity(selectedActivityFull);
    }

    return (
        <ListItemButton value={activity.activity_id} onClick={handleClick}>
            <ListItemAvatar>
                <Avatar>
                    {/* <DirectionsBikeIcon /> */}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={`${activity.name} (${activity.sport_type})`}
                secondary={activityDate}
                sx={{ color: 'black' }}
            />
        </ListItemButton>
    );
};
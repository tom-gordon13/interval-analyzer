import React, { useState, useEffect, useMemo } from 'react';
import { List } from '@mui/material';
import { RecentActivityItem } from './RecentActivityItem';

export const RecentlyViewedActivities = ({ recentlyViewedActivities, setSelectedActivity }) => {
    useEffect(() => {
    }, [recentlyViewedActivities])

    return (
        <div className='mt-16'>
            <h2 className='mb-4'>Recently Viewed Activities</h2>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {recentlyViewedActivities?.map((activity, index) => {
                    return (<RecentActivityItem activity={activity} setSelectedActivity={setSelectedActivity} key={activity.id || index} />)
                })}
            </List>
        </div >
    );
};

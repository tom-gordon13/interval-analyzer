import React, { useState, useEffect, useContext } from 'react';
import ActivitiesSummaryCard from './ActivitiesSummaryCard';
import { formatActivities } from '../../utils/format-activities';
import { ActivitiesDropdown } from './ActivitiesDropdown';
import { ActivityDialog } from './ActivityDialog';
import { RecentActivities } from './RecentActivities';
import { fetchActivityBasic } from '../../services/fetch-activity-basic';
import { fetchActivitiesSummary } from '../../services/fetch-activities-summary'
import { UserContext } from '../../context/UserContext';
import { SelectedActivityContext } from '../../context/SelectedActivityContext';

const today_beg = new Date()
today_beg.setHours(0, 0, 0, 0);
const today_end = new Date()
today_end.setHours(23, 59, 0, 0);

export const ActivitiesContainer = () => {
    const [activities, setActivities] = useState({});
    const [activityObj, setActivityObj] = useState({});
    const [startDate, setStartDate] = useState(today_beg)
    const [endDate, setEndDate] = useState(today_end)
    const [recentActivities, setRecentActivities] = useState(null)
    const [showActivityDialog, setShowActivityDialog] = useState(false)
    const [showActivityDropdown, setShowActivityDropdown] = useState(false)
    const [hasSearchedDates, setHasSearchedDates] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(UserContext);
    const { selectedActivity, setSelectedActivity } = useContext(SelectedActivityContext)

    const handleClose = () => {
        setShowActivityDialog(false)
    }

    useEffect(() => {
        if (selectedActivity) {
            setShowActivityDialog(true);
        }
    }, [selectedActivity]);

    useEffect(() => {
        const recentActivitiesHandler = async () => {
            const recentActivitiesTemp = await fetchActivityBasic(user.id, 3)
            setRecentActivities(recentActivitiesTemp)
        }
        recentActivitiesHandler()
    }, [])


    const handleDateChange = (date, pickerType) => {
        if (pickerType === 'start') {
            setStartDate(date || today_beg);
        } else {
            setEndDate(date || today_end);
        }
    };

    const handleActivitiesSummaryClick = async () => {
        try {
            setIsLoading(true)
            const before = endDate.getTime() / 1000
            const after = startDate.getTime() / 1000

            const summary = await fetchActivitiesSummary(before, after)
            const activities = summary.data;
            setActivities(activities)
            setActivityObj(formatActivities(activities))
            setShowActivityDropdown(true)
        } catch (e) {
            console.log('Error loading activities summary', e)
        } finally {
            setIsLoading(false)
            setHasSearchedDates(true)
        }
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
                setShowActivityDialog={setShowActivityDialog}
            />) : <h5>{hasSearchedDates ? (isLoading ? 'Loading activities...' : 'No activities found - update date range') : null}</h5>}

            {selectedActivity ? (<ActivityDialog
                open={showActivityDialog}
                onClose={handleClose}
                activity={selectedActivity}
            />) : null}

            {recentActivities && recentActivities.length ? (<RecentActivities recentActivities={recentActivities} setSelectedActivity={setSelectedActivity} />) : null}
        </div>
    )

}
import React, { useState, useEffect, useContext } from 'react';
import ActivitiesSummaryCard from './ActivitiesSummaryCard';
import { formatActivities } from '../../utils/format-activities';
import { ActivitiesDropdown } from './ActivitiesDropdown';
import { ActivityDialog } from './ActivityDialog';
import { RecentlyViewedActivities } from './RecentActivities';
import { fetchActivityBasic } from '../../services/fetch-activity-basic';
import { fetchActivitiesSummary } from '../../services/fetch-activities-summary'
import { UserContext } from '../../context/UserContext';
import { SelectedActivityContext } from '../../context/SelectedActivityContext';
import { Grid, Button, ButtonGroup } from '@mui/material';

const today_beg = new Date()
today_beg.setHours(0, 0, 0, 0);
const today_end = new Date()
today_end.setHours(23, 59, 0, 0);

const now = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 7);
sevenDaysAgo.setHours(0, 0, 0, 0);

const oneYearAgo = new Date();
oneYearAgo.setFullYear(now.getFullYear() - 1);
oneYearAgo.setHours(0, 0, 0, 0);
const oneYearAgoStart = new Date(oneYearAgo);
oneYearAgoStart.setDate(oneYearAgo.getDate() - 7);
oneYearAgoStart.setHours(0, 0, 0, 0);

export const ActivitiesContainer = () => {
    const [activities, setActivities] = useState({});
    const [activityObj, setActivityObj] = useState({});
    const [startDate, setStartDate] = useState(today_beg)
    const [endDate, setEndDate] = useState(today_end)
    const [recentlyViewedActivities, setRecentlyViewedActivities] = useState(null)
    const [showActivityDialog, setShowActivityDialog] = useState(false)
    const [showActivityDropdown, setShowActivityDropdown] = useState(false)
    const [hasSearchedDates, setHasSearchedDates] = useState(false)
    const [activeSearchType, setActiveSearchType] = useState('DATE')
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(UserContext);
    const { selectedActivity, setSelectedActivity } = useContext(SelectedActivityContext)

    const handleClose = () => {
        setShowActivityDialog(false)
    }



    useEffect(() => {
        let currentWeekData = null
        let yearAgoData = null
        const fetchData = async () => {
            try {
                const fetchTimePeriodActivitiesHandler = async (before, after) => {
                    const summary = await fetchActivitiesSummary(before, after);
                    return summary; // No need for summary.data if fetchActivitiesSummary already returns data
                };

                const beforeCurrentWeek = Math.floor(now.getTime() / 1000);
                const afterCurrentWeek = Math.floor(sevenDaysAgo.getTime() / 1000);

                const beforeYearAgo = Math.floor(oneYearAgo.getTime() / 1000);
                const afterYearAgo = Math.floor(oneYearAgoStart.getTime() / 1000);

                currentWeekData = await fetchTimePeriodActivitiesHandler(beforeCurrentWeek, afterCurrentWeek);
                yearAgoData = await fetchTimePeriodActivitiesHandler(beforeYearAgo, afterYearAgo);

                console.log("Current Week Data:", currentWeekData);
                console.log("Same Week Last Year Data:", yearAgoData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData()
    }, [])

    useEffect(() => {
        if (selectedActivity) {
            setShowActivityDialog(true);
        }
    }, [selectedActivity]);

    useEffect(() => {
        const recentActivitiesHandler = async () => {
            const recentActivitiesTemp = await fetchActivityBasic(user.id, 3)
            setRecentlyViewedActivities(recentActivitiesTemp)
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
        <Grid container>
            <Grid item xs={6}>
                <div >
                    <h2>Week of XYZ</h2>
                </div>
                {/* <RecentActivities recentlyViewedActivities={recentlyViewedActivities} setSelectedActivity={setSelectedActivity} /> */}
            </Grid>
            <Grid item xs={6}>
                <div className='flex flex-col flex-wrap items-center'>
                    {/* <ButtonGroup variant="text" aria-label="Basic button group">
                        <Button variant='contained' sx={{ margin: '0.25rem' }}>Activity Name</Button>
                        <Button variant='contained' sx={{ margin: '0.25rem' }}>Date</Button>
                    </ButtonGroup> */}
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

                    {recentlyViewedActivities && recentlyViewedActivities.length ? (<RecentlyViewedActivities recentlyViewedActivities={recentlyViewedActivities} setSelectedActivity={setSelectedActivity} />) : null}
                </div>
            </Grid>
        </Grid>
    )

}
import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Button, Switch } from '@mui/material';
import ActivityChart from './ActivityChart'
import { LapChart } from './LapChart'
import ActivitiesFilter from './ActivitiesFilter'
import ActivityRadioButtons from './ActivityRadioButtons'
import LapPowerBuckets from './LapPowerBuckets'
import { upsertActivityBasic } from '../../services/upsert-activity-basic'
import { upsertEditedActivity } from '../../services/upsert-edited-activity'
import { getCookie } from '../../utils/browser-helpers';
import { UserContext } from '../../context/UserContext';
import { SelectedActivityContext } from '../../context/SelectedActivityContext';


export const ActivityDialog = ({ open, onClose, activity }) => {
    const [selectedLaps, setSelectedLaps] = useState({})
    const [filterActive, setFilterActive] = useState(false)
    const [minMaxPowerRange, setMinMaxPowerRange] = useState([])
    const [minMaxPowerFilter, setMinMaxPowerFilter] = useState([])
    const [powerBuckets, setPowerBuckets] = useState([])
    const [powerMovingAvg, setPowerMovingAvg] = useState(1)
    const [fullLapStream, setFullLapStream] = useState([])
    const [isInEditMode, setIsInEditMode] = useState(false)
    const { user } = useContext(UserContext);
    const { selectedActivity, setSelectedActivity } = useContext(SelectedActivityContext)
    const { name, distance, type } = activity;

    useEffect(() => {
        if (activity.laps.length > 1) setIsInEditMode(false)
    }, [activity])

    const updateActivity = () => {
        if (activity) {

            const newLaps = activity.laps.map((lap, index) => {
                if (index === 0) {

                    return { ...lap, average_watts: 400 };
                }

                return lap;
            });
            const newActivity = {
                ...activity,
                laps: newLaps
            }
            setSelectedActivity(newActivity)
        }
    }

    useEffect(() => {
        if (!selectedActivity) return
        const activityData = {
            activity_id: selectedActivity.id,
            name: selectedActivity.name,
            sport_type: selectedActivity.sport_type,
            activity_date: selectedActivity.start_date
        }
        const accessToken = getCookie('stravaAccessToken')
        upsertActivityBasic(user.id, activityData, accessToken)
    }, [selectedActivity])

    const powerRadioValues = [1, 3, 5, 10]
    const powerRadioLabels = ['1 sec', '3 sec', '5 sec', '10 sec']

    const data = activity.laps.map((lap, index) => ({
        category: `Lap ${index + 1}`,
        value: lap.average_watts,
        elapsed_time: lap.elapsed_time,
        dynamicWidthValue: lap.elapsed_time / activity.elapsed_time * 700
    }));

    useEffect(() => {
        const minMaxVals = data.reduce(
            (acc, lap) => {
                const { value } = lap;
                return [
                    Math.min(acc[0], value),
                    Math.max(acc[1], value)
                ];
            },
            [Infinity, -Infinity]
        );
        setMinMaxPowerRange(minMaxVals)
        if (!powerBuckets.length) setPowerBuckets(minMaxVals)
    }, [selectedActivity, selectedLaps])

    useEffect(() => {
        if (!filterActive) {
            setSelectedLaps({})
            return
        }
        const testArray = data.filter((lap) => lap.value > minMaxPowerFilter[0] - 1 && lap.value < minMaxPowerFilter[1] + 1).reduce((acc, lap) => {
            acc[lap.category] = lap.value;
            return acc;
        }, {});
        setSelectedLaps(testArray)
    }, [filterActive])

    const handleToggle = () => {
        setIsInEditMode(!isInEditMode)
    }

    const handleSaveEditedActivity = () => {
        upsertEditedActivity('123', selectedActivity, getCookie('stravaAccessToken'))
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                zIndex: '900',
            }}
            PaperProps={{
                sx: {
                    minWidth: '200%',
                    width: '200%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }
            }}
        >
            <IconButton
                aria-label="close"
                onClick={() => {
                    setSelectedLaps([])
                    onClose()
                }}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                X
            </IconButton>
            {
                !isInEditMode ?
                    <DialogTitle sx={{ width: '35%' }}>Activity Details

                        <div>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Distance:</strong> {distance}</p>
                            <p><strong>Type:</strong> {type}</p>
                            <p><strong>Date:</strong> {activity.start_date_local.slice(0, 10)}</p>
                            <hr />
                            <div className='flex flex-col p-2 justify-between' sx={{ width: '100%' }}>
                                <Button variant='contained' sx={{ marginBottom: '0.5rem' }} onClick={() => setSelectedLaps({})}>Clear Selected Laps</Button>
                                {/* <Button onClick={updateActivity}>Update Activity</Button> */}

                                <Button variant='contained' onClick={() => setFilterActive(!filterActive)}>{filterActive ? 'Remove' : 'Apply'} Filters</Button>
                                <br />
                                <ActivitiesFilter title='Power Range (watts)' property='' minValue={minMaxPowerRange[0]} maxValue={minMaxPowerRange[1]} setMinMaxFilter={setMinMaxPowerFilter} />
                                <ActivityRadioButtons sx={{ margin: '10rem' }} values={powerRadioValues} labels={powerRadioLabels} title='Power Moving Average' setUltimateValue={setPowerMovingAvg} />
                                {selectedLaps && Object.keys(selectedLaps).length ? (
                                    <>
                                        <LapPowerBuckets powerBuckets={powerBuckets} fullLapStream={fullLapStream} />
                                        <ActivitiesFilter title='Power Buckets' property='' minValue={0} maxValue={800} setMinMaxFilter={setPowerBuckets} />
                                    </>
                                )
                                    : null}

                            </div>
                        </div>
                    </DialogTitle> : null
            }
            <DialogContent >
                <br />
                {Object.keys(selectedLaps).length > 0 ? (<p>Number of Selected Laps: {Object.keys(selectedLaps).length}</p>) : null}
                <hr />
                {selectedActivity.streams.some(stream => stream.type === 'watts') ?
                    <ActivityChart data={data} selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} isInEditMode={isInEditMode} />
                    : <h2 className='flex justify-center items-center h-40'>No power data available</h2>}

                Edit Mode: <Switch checked={isInEditMode} onChange={handleToggle} disabled={activity.laps.length > 1} />
                <br />
                <LapChart selectedLaps={selectedLaps} setSelectedActivity={setSelectedActivity} lapData={data} activity={activity} powerMovingAvg={powerMovingAvg} setFullLapStream={setFullLapStream} isInEditMode={isInEditMode} />
                {isInEditMode && <Button onClick={handleSaveEditedActivity} variant='contained'>Save edited Activity</Button>}
            </DialogContent>
        </Dialog >
    );
};

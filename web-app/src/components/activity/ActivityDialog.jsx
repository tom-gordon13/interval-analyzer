import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Switch } from '@mui/material';
import ActivityChart from './ActivityChart'
import { LapChart } from './LapChart'
import ActivitiesFilter from './ActivitiesFilter'
import ActivityRadioButtons from './ActivityRadioButtons'
import LapPowerBuckets from './LapPowerBuckets'
import { upsertActivityBasic } from '../../services/upsert-activity-basic'
import { upsertEditedActivity } from '../../services/upsert-edited-activity'
import { fetchedEditedActivity } from '../../services/fetch-edited-activity';
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
    const [editedActivity, setEditedActivity] = useState(null)
    const [editedActivitySelected, setEditedActivitySelected] = useState(false)
    const [originalActivity, setOriginalAcitivity] = useState(activity)
    const { user } = useContext(UserContext);
    const { selectedActivity, setSelectedActivity } = useContext(SelectedActivityContext)
    const { name, distance, type } = activity;

    useEffect(() => {
        if (activity.laps.length > 1) setIsInEditMode(false)
    }, [activity])

    const editedActivityHandler = async () => {
        const editedActivity = await fetchedEditedActivity(selectedActivity.id)
        setEditedActivity(editedActivity.activity_data)
        setSelectedLaps({})
    }

    useEffect(() => {
        editedActivityHandler()
    }, [])

    const handleSwapToEditedActivity = () => {
        const swappedActivity = editedActivitySelected ? originalActivity : editedActivity
        setSelectedActivity(swappedActivity)
        setEditedActivitySelected(!editedActivitySelected)
        editedActivityHandler()
    }

    useEffect(() => {
        if (selectedActivity) {
            const activityData = {
                activity_id: selectedActivity.id,
                name: selectedActivity.name,
                sport_type: selectedActivity.sport_type,
                activity_date: selectedActivity.start_date
            }
            upsertActivityBasic(user.id, activityData)
        }

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
        } else {
            const testArray = data.filter((lap) => lap.value > minMaxPowerFilter[0] - 1 && lap.value < minMaxPowerFilter[1] + 1).reduce((acc, lap) => {
                acc[lap.category] = lap.value;
                return acc;
            }, {});
            setSelectedLaps(testArray)
        }
    }, [filterActive])

    const handleToggle = () => {
        setIsInEditMode(!isInEditMode)
        setSelectedLaps({ 'Lap 1': activity.laps[0].average_watts }) // Automatically select the first lap when entering edit mode
    }

    const handleSaveEditedActivity = () => {
        upsertEditedActivity(selectedActivity)
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
                    setSelectedLaps({})
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
                                        <LapPowerBuckets powerBuckets={powerBuckets} fullLapStream={fullLapStream} isOpen={selectedLaps && Object.keys(selectedLaps).length} />
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
                Swap to Edited Activity: <Switch checked={editedActivitySelected} onChange={handleSwapToEditedActivity} disabled={!editedActivity} />
                <Button onClick={handleSaveEditedActivity} variant='contained'>{editedActivity ? 'Override' : 'Save'} edited Activity</Button>
                <br />
                <LapChart selectedLaps={selectedLaps} setSelectedActivity={setSelectedActivity} lapData={data} activity={activity} powerMovingAvg={powerMovingAvg} setFullLapStream={setFullLapStream} isInEditMode={isInEditMode} setEditedActivitySelected={setEditedActivitySelected} />
            </DialogContent>
        </Dialog >
    );
};

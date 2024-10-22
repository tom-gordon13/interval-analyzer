import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Button } from '@mui/material';
import ActivityChart from './ActivityChart'
import LapChart from './LapChart'
import ActivitiesFilter from './ActivitiesFilter'
import ActivityRadioButtons from './ActivityRadioButtons'

import jsonData from '../../test-data/test-activity-cycling.json';

export const ActivityDialog = ({ open, onClose, activity, selectedActivity }) => {
    const [selectedLaps, setSelectedLaps] = useState({})
    const [filterActive, setFilterActive] = useState(false)
    const [minMaxPowerRange, setMinMaxPowerRange] = useState([])
    const [minMaxPowerFilter, setMinMaxPowerFilter] = useState([])
    const [powerMovingAvg, setPowerMovingAvg] = useState(1)
    const { name, distance, type } = activity;

    const powerRadioValues = [1, 3, 5, 10]
    const powerRadioLabels = ['1 second', '3 seconds', '5 seconds', '10 seconds']

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
            <DialogTitle sx={{ width: '35%' }}>Activity Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    variant='contained'
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    X
                </IconButton>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Distance:</strong> {distance}</p>
                <p><strong>Type:</strong> {type}</p>
                <p><strong>Date:</strong> {activity.start_date_local.slice(0, 10)}</p>
                <hr />
                <div className='flex flex-col p-2 justify-between' sx={{ width: '100%' }}>
                    <Button variant='contained' sx={{ marginBottom: '0.5rem' }} onClick={() => setSelectedLaps({})}>Clear Selected Laps</Button>
                    <Button variant='contained' onClick={() => setFilterActive(!filterActive)}>{filterActive ? 'Remove' : 'Apply'} Filters</Button>
                    <br />
                    <ActivitiesFilter title='Power Range (watts)' property='' minValue={minMaxPowerRange[0]} maxValue={minMaxPowerRange[1]} setMinMaxFilter={setMinMaxPowerFilter} />
                    <ActivityRadioButtons values={powerRadioValues} labels={powerRadioLabels} title='Power Moving Average' setUltimateValue={setPowerMovingAvg} />
                </div>
            </DialogTitle>
            <DialogContent>
                <br />
                {Object.keys(selectedLaps).length > 0 ? (<p>Number of Selected Laps: {Object.keys(selectedLaps).length}</p>) : null}
                <hr />

                <ActivityChart data={data} selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} />
                <br />
                <LapChart selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} lapData={data} activity={activity} powerMovingAvg={powerMovingAvg} />

            </DialogContent>
        </Dialog>
    );
};

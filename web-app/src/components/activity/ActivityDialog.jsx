import React, { useState, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ActivityChart from './ActivityChart'
import LapChart from './LapChart'
import ActivitiesFilter from './ActivitiesFilter'

import jsonData from '../../test-data/test-activity-cycling.json';

export const ActivityDialog = ({ open, onClose, activity }) => {
    const { name, distance, type } = activity;
    const [selectedLaps, setSelectedLaps] = useState({})
    const [filterActive, setFilterActive] = useState(false)
    const [minMaxPowerRange, setMinMaxPowerRange] = useState([])
    const [minMaxPowerFilter, setMinMaxPowerFilter] = useState([])

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
    }, [])

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
                </div>
            </DialogTitle>
            <DialogContent>
                <br />
                {Object.keys(selectedLaps).length > 0 ? (<p>Number of Selected Laps: {Object.keys(selectedLaps).length}</p>) : null}
                <hr />

                <ActivityChart data={data} selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} />
                <br />
                <LapChart selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} lapData={data} activity={activity} />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant='contained'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

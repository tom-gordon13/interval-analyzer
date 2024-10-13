import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ActivityChart from './activity-chart'
import LapChart from './lap-chart'

// Test
import jsonData from '../test-data/test-activity-cycling.json';



export const ActivityDialog = ({ open, onClose, activity }) => {
    const { name, distance, type } = activity;

    const [fullActivity, setFullActivity] = useState(null)
    const [selectedLaps, setSelectedLaps] = useState({})
    const [avgWatts, setAvgWatts] = useState(null)


    const data = activity.laps.map((lap, index) => ({
        category: `Lap ${index + 1}`,
        value: lap.average_watts,
        dynamicWidthValue: lap.elapsed_time / activity.elapsed_time * 700
    }));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                zIndex: '900'
            }}
            PaperProps={{
                sx: {
                    minWidth: '1000px', // Set your desired minimum width
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }
            }}
        >
            <DialogTitle>Activity Details</DialogTitle>
            <DialogContent>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Distance:</strong> {distance}</p>
                <p><strong>Type:</strong> {type}</p>
                <p><strong>Date:</strong> {activity.start_date_local.slice(0, 10)}</p>
                <br />
                {Object.keys(selectedLaps).length > 0 ? (<p>Number of Selected Laps: {Object.keys(selectedLaps).length}</p>) : null}
                <hr />

                <ActivityChart data={data} selectedLaps={selectedLaps} setSelectedLaps={setSelectedLaps} />
                <br />
                <LapChart selectedLaps={selectedLaps} lapData={data} activity={activity} />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

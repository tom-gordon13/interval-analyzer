import React, { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Grid } from '@mui/material';

const ActivityRadioButtons = ({ values, labels, title, setUltimateValue }) => {
    const [selectedValue, setSelectedValue] = useState('1');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setUltimateValue(event.target.value)
    };


    return (
        <FormControl component="fieldset" sx={{ marginTop: '2rem' }}>
            <FormLabel component="legend">{title}</FormLabel>
            <RadioGroup
                aria-label="options"
                name="options"
                value={selectedValue}
                onChange={handleChange}
            >
                <Grid container spacing={2}>
                    {values.map((value, idx) =>
                    (
                        <Grid item xs={3} key={value} sx={{ padding: 0 }}>
                            <FormControlLabel value={value} control={<Radio />} label={labels[idx]} />
                        </Grid>
                    )
                    )}
                </Grid>
            </RadioGroup>
        </FormControl>
    );
};

export default ActivityRadioButtons;

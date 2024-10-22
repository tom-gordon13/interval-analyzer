import React, { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';

const ActivityRadioButtons = ({ values, labels, title, setUltimateValue }) => {
    const [selectedValue, setSelectedValue] = useState('1');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setUltimateValue(event.target.value)
    };


    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{title}</FormLabel>
            <RadioGroup
                aria-label="options"
                name="options"
                value={selectedValue}
                onChange={handleChange}
            >
                {values.map((value, idx) =>
                (
                    <FormControlLabel value={value} control={<Radio />} label={labels[idx]} />
                )
                )}
            </RadioGroup>
        </FormControl>
    );
};

export default ActivityRadioButtons;

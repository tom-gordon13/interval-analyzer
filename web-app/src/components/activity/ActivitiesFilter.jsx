import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React, { useState, useEffect } from 'react';

const ActivitiesFilter = ({ title, property, minValue, maxValue, setMinMaxFilter }) => {
    const [sliderValue, setSliderValue] = useState([minValue, maxValue])

    useEffect(() => {
        setSliderValue([minValue, maxValue])
    }, [minValue, maxValue])

    const handleChange = (event, newValue) => {
        setSliderValue(newValue)
        setMinMaxFilter(newValue)
    }

    // handleInputChange updates the corresponding slider value when the input is changed
    const handleInputChange = (index) => (event) => {
        const newValues = [...sliderValue];
        newValues[index] = event.target.value === '' ? '' : Number(event.target.value);
        setSliderValue(newValues);
    };

    // handleBlur makes sure the value is within the slider's range when the input loses focus
    const handleBlur = (index) => () => {
        const newValues = [...sliderValue];
        if (newValues[index] < minValue) {
            newValues[index] = minValue;
        } else if (newValues[index] > maxValue) {
            newValues[index] = maxValue;
        }
        setSliderValue(newValues);
    };

    return (
        <div>
            <h3 className='mb-2 text-center'>{title}</h3>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Min"
                    value={sliderValue[0]}
                    onChange={handleInputChange(0)}
                    onBlur={handleBlur(0)}
                    inputProps={{
                        step: 1,
                        min: minValue,
                        max: maxValue,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        className: 'text-sm p-6'
                    }}
                    sx={{ marginRight: 2, minWidth: '70px' }}
                />
                <Slider
                    getAriaLabel={() => title}
                    value={sliderValue}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={minValue}
                    max={maxValue}
                />
                <TextField
                    label="Max"
                    value={sliderValue[1]}
                    onChange={handleInputChange(1)}
                    onBlur={handleBlur(1)}
                    inputProps={{
                        step: 1,
                        min: minValue,
                        max: maxValue,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                    sx={{ marginLeft: 2, minWidth: '70px' }}
                />
            </Box>
        </div>
    );
}

export default ActivitiesFilter;
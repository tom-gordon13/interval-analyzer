import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import * as d3 from 'd3';
import { insertNewLap } from '../../services/insert-new-lap'

const generateDataPoints = (valuesArray, startIndex, numOfValues, movingAvgIdx, adjustment) => {
    const result = [];
    let movingAvgSum = 0;
    const adjustmentValue = adjustment || 0

    for (let timeIndex = 0; timeIndex < numOfValues; timeIndex++) {
        const currIndex = startIndex + timeIndex + (startIndex > 0 ? adjustmentValue : 0)
        let watts;

        if (movingAvgIdx === 1 || timeIndex === 0) {
            watts = valuesArray[currIndex];
            movingAvgSum += valuesArray[currIndex];
        } else if (timeIndex < movingAvgIdx) {
            movingAvgSum += valuesArray[currIndex];
            watts = movingAvgSum / (timeIndex + 1);
        } else {
            movingAvgSum = movingAvgSum + valuesArray[currIndex] - valuesArray[currIndex - movingAvgIdx];
            watts = movingAvgSum / movingAvgIdx;
        }
        watts = !watts ? 0 : watts
        result.push({ timeIndex, watts });
    }
    return result;
}

export const LapChart = ({ selectedLaps, activity, powerMovingAvg, setFullLapStream, isInEditMode }) => {
    const [editAreaStaged, setEditAreaStaged] = useState(false)
    const [editRange, setEditRange] = useState([])
    const ref = useRef(null);

    const handleNewLap = () => {
        const test = insertNewLap(activity, Math.min(...editRange), Math.max(...editRange))
        console.log(test)
    }

    useEffect(() => {
        if (!selectedLaps || Object.keys(selectedLaps).length === 0) return;

        let lapDataFull = [];
        let adjustmentValue = activity.laps[0].elapsed_time - activity.laps[0].end_index;
        let maxLapLength = 0;

        for (const lap in selectedLaps) {
            const match = lap.match(/\d+$/);
            const lapIndex = match ? parseInt(match[0], 10) - 1 : null;

            const lapObj = {
                name: lap,
                values: generateDataPoints(
                    activity.streams.find(item => item.type === 'watts').data,
                    activity.laps[lapIndex].start_index,
                    activity.laps[lapIndex].end_index - activity.laps[lapIndex].start_index,
                    Number(powerMovingAvg),
                    adjustmentValue
                )
            };
            maxLapLength = Math.max(maxLapLength, activity.laps[lapIndex].end_index - activity.laps[lapIndex].start_index);
            lapDataFull.push(lapObj);
        }

        setFullLapStream(lapDataFull.flatMap((lap) => lap.values.map(value => value.watts)));

        if (lapDataFull.length === 0) {
            setFullLapStream([]);
            return;
        }

        const svgWidth = isInEditMode ? 1200 : 800;
        const svgHeight = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 20 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain([d3.min(lapDataFull, ds => d3.min(ds.values, d => d.timeIndex)), d3.max(lapDataFull, ds => d3.max(ds.values, d => d.timeIndex))])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(lapDataFull, ds => d3.max(ds.values, d => d.watts))])
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const lineGenerator = d3.line()
            .x(d => xScale(d.timeIndex))
            .y(d => yScale(d.watts));

        const svg = d3.select(ref.current)
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const paths = g.selectAll('.line')
            .data(lapDataFull, ds => ds.name)
            .enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', ds => colorScale(ds.name))
            .attr('stroke-width', 1.5)
            .attr('d', ds => lineGenerator(ds.values));

        let isDragging = false;
        let startX, endX;

        if (editAreaStaged) {
            g.append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'gray') // Gray color
                .attr('opacity', 0.7);
        }

        if (isInEditMode) {
            g.append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'transparent')
                .on('mousedown', function (event) {
                    isDragging = true;
                    startX = d3.pointer(event)[0];
                })
                .on('mousemove', function (event) {
                    if (isDragging) {
                        endX = d3.pointer(event)[0];
                        highlightSection(startX, endX);
                    }
                })
                .on('mouseup', function () {
                    isDragging = false;
                    if (startX && endX) {
                        setEditAreaStaged(true)
                        setEditRange([xScale.invert(startX), xScale.invert(endX)])
                    }
                });

            // Drawing and highlight segments in edit mode
            const highlightSection = (startX, endX) => {
                const [xMin, xMax] = startX < endX ? [startX, endX] : [endX, startX];
                const dataXMin = xScale.invert(xMin);
                const dataXMax = xScale.invert(xMax);
                g.selectAll('.line-segment').remove();
                // Draw each line as separate segments
                lapDataFull.forEach(ds => {
                    for (let i = 0; i < ds.values.length - 1; i++) {
                        const point1 = ds.values[i];
                        const point2 = ds.values[i + 1];

                        // Check if the segment is within the selected range
                        const isInRange = (point1.timeIndex >= dataXMin && point1.timeIndex <= dataXMax) ||
                            (point2.timeIndex >= dataXMin && point2.timeIndex <= dataXMax);

                        g.append('line')
                            .attr('class', 'line-segment')
                            .attr('x1', xScale(point1.timeIndex))
                            .attr('y1', yScale(point1.watts))
                            .attr('x2', xScale(point2.timeIndex))
                            .attr('y2', yScale(point2.watts))
                            .attr('stroke', isInRange ? 'orange' : colorScale(ds.name))
                            .attr('stroke-width', 1.5);
                    }
                });
            };
        }

        paths.exit().remove();

        const yAxis = d3.axisLeft(yScale)
            .ticks(d3.max(lapDataFull, ds => d3.max(ds.values, d => d.watts)) / 50)
            .tickSize(-width);

        g.append('g')
            .call(yAxis)
            .selectAll('line')
            .attr('stroke', '#ccc')
            .attr('stroke-dasharray', '2,2');

        const xAxis = d3.axisBottom(xScale)
            .ticks((d3.max(lapDataFull, ds => d3.max(ds.values, d => d.timeIndex)) - d3.min(lapDataFull, ds => d3.min(ds.values, d => d.timeIndex))) / (maxLapLength / 20))
            .tickFormat(d => `${d}`);

        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        const legend = g.selectAll(".legend")
            .data(lapDataFull.map(ds => ds.name))
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);

    }, [selectedLaps, activity, powerMovingAvg, isInEditMode, editAreaStaged]);

    return (
        <div style={{ position: 'relative' }}>
            {selectedLaps && Object.keys(selectedLaps).length ? <svg ref={ref} className="w-full"></svg> : null}
            {editAreaStaged && (
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'auto'
                }}>
                    <Button
                        variant="contained"
                        onClick={handleNewLap}
                        sx={{ marginRight: '1rem' }}
                    >
                        {`Create a new lap from ${Math.round(Math.min(...editRange))} to ${Math.round(Math.max(...editRange))}`}
                    </Button>
                    <Button variant="contained" onClick={() => { setEditAreaStaged(false) }}>Cancel</Button>
                </div>
            )}
        </div>
    );
};
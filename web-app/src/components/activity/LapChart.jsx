import React, { useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import * as d3 from 'd3';

function generateDataPoints(valuesArray, startIndex, numOfValues, movingAvgIdx) {
    const result = [];
    let movingAvgSum = 0;
    for (let i = 0; i < numOfValues; i++) {
        const time = i;
        let watts;
        if (i < movingAvgIdx - 1 || movingAvgIdx === 1) {
            watts = valuesArray[startIndex + i];
            movingAvgSum += valuesArray[startIndex + i];
        } else {
            movingAvgSum = movingAvgSum - valuesArray[startIndex + i - movingAvgIdx - 1] + valuesArray[startIndex + i];
            watts = movingAvgSum / movingAvgIdx;
        }

        result.push({ time, watts });
    }
    return result;
}

const LapChart = ({ selectedLaps, setSelectedLaps, activity, powerMovingAvg }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!selectedLaps || Object.keys(selectedLaps).length === 0) return;

        let lapDataFull = [];
        for (const lap in selectedLaps) {
            const match = lap.match(/\d+$/);
            const lapIndex = match ? parseInt(match[0], 10) - 1 : null;

            const lapObj = {
                name: lap,
                values: generateDataPoints(
                    activity.streams[0].data,
                    activity.laps[lapIndex].start_index,
                    activity.laps[lapIndex].end_index - activity.laps[lapIndex].start_index,
                    Number(powerMovingAvg)
                )
            };
            lapDataFull.push(lapObj);
        }

        if (lapDataFull.length === 0) return;

        const svgWidth = 800, svgHeight = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 20 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain([d3.min(lapDataFull, ds => d3.min(ds.values, d => d.time)), d3.max(lapDataFull, ds => d3.max(ds.values, d => d.time))])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(lapDataFull, ds => d3.max(ds.values, d => d.watts))])
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const lineGenerator = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.watts));

        const svg = d3.select(ref.current)
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        // Clear previous lines and legends
        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const paths = g.selectAll('.line')
            .data(lapDataFull, ds => ds.name);

        // Enter phase (add new lines)
        paths.enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', ds => colorScale(ds.name))
            .attr('stroke-width', 1.5)
            .attr('d', ds => lineGenerator(ds.values));

        // Exit phase (remove old lines)
        paths.exit().remove();

        // Add Y-Axis
        const yAxis = d3.axisLeft(yScale)
            .ticks(d3.max(lapDataFull, ds => d3.max(ds.values, d => d.watts)) / 50) // Generate ticks at intervals of 50
            .tickSize(-width); // Extend ticks across the width for grid lines

        // Append the y-axis to the chart
        g.append('g')
            .call(yAxis)
            .selectAll('line') // Add gridlines
            .attr('stroke', '#ccc')
            .attr('stroke-dasharray', '2,2'); // Optional: style for gridlines

        // Re-append legends after removing previous ones
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

    }, [selectedLaps, activity, powerMovingAvg]);

    return (
        <>
            {selectedLaps && Object.keys(selectedLaps).length ? <svg ref={ref} className='w-full'></svg> : null}
        </>
    );
};

export default LapChart;

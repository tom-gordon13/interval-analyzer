import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import jsonData from '../../test-data/test-activity-cycling.json';

function generateDataPoints(valuesArray, startIndex, numOfValues, movingAvgIdx = 1) {
    const result = [];
    let movingAvgSum = 0
    for (let i = 0; i < numOfValues; i++) {
        const time = i;
        let watts;
        if (i < movingAvgIdx - 1 || movingAvgIdx == 1) {
            watts = valuesArray[startIndex + i];
            movingAvgSum = movingAvgSum + valuesArray[startIndex + i]
        } else {
            movingAvgSum = movingAvgSum - valuesArray[startIndex + i - movingAvgIdx - 1] + valuesArray[startIndex + i]
            watts = movingAvgSum / movingAvgIdx
        }

        result.push({ time, watts });
    }
    console.log(result)
    return result;
}

d3.select('svg').selectAll('*').remove();

const LapChart = ({ lapData, selectedLaps, activity }) => {

    const lapDataFull = []

    for (const lap in selectedLaps) {
        const match = lap.match(/\d+$/);

        const lapIndex = match ? parseInt(match[0], 10) - 1 : null;

        const lapObj = {
            name: lap,
            values: generateDataPoints(activity.streams[0].data, activity.laps[lapIndex].start_index, (activity.laps[lapIndex].end_index - activity.laps[lapIndex].start_index))
        }
        lapDataFull.push(lapObj)
    }

    const ref = useRef(null);

    useEffect(() => {

        console.log(lapDataFull)

        // if (!lapDataFull) return;
        if (!lapDataFull || lapDataFull.length === 0) return;
        const svgWidth = 600, svgHeight = 400;
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
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        // const xAxis = d3.axisBottom(xScale);
        // const yAxis = d3.axisLeft(yScale);
        // svg.append('g')
        //     .attr('transform', `translate(0,${height})`)
        //     .call(xAxis);

        // svg.append('g')
        //     .call(yAxis);
        svg.selectAll("*").remove()
        console.log(lapDataFull)
        const paths = svg.selectAll('path')
            .data(lapDataFull, ds => ds.name)

        paths.enter().append('path')
            .attr('fill', 'none')
            .attr('stroke', ds => colorScale(ds.name))
            .attr('stroke-width', 1.5)
            .attr('d', ds => lineGenerator(ds.values))
            .attr('class', 'line');

        paths.exit().remove();
        // paths.selectAll().remove()








        // // lapDataFull.forEach(ds => {
        // //     svg.append('path')
        // //         .datum(ds.values)
        // //         .attr('fill', 'none')
        // //         .attr('stroke', () => colorScale(ds.name)) // Use the dataset name to get a color
        // //         .attr('stroke-width', 1.5)
        // //         .attr('d', lineGenerator);
        // // });
        // const validData = lapDataFull.filter(ds => ds && ds.hasOwnProperty('name'));
        // console.log('valid - ', validData)
        // const testData = [
        //     { 'name': 'Tom', 'values': [1, 2, 3] }
        // ]
        // const paths = svg.selectAll('path')
        //     .data(lapDataFull, ds => ds.name);
        // console.log('here')

        // paths.enter().append('path')
        //     .attr('fill', 'none')
        //     .attr('stroke', ds => colorScale(ds.name))
        //     .attr('stroke-width', 1.5)
        //     .attr('d', ds => lineGenerator(ds.values))
        //     .attr('class', 'line');

        // paths.exit().remove();

        const legend = svg.selectAll(".legend")
            .data(lapDataFull.map(ds => ds.name))
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Vertical layout of legend items

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

    }, [lapDataFull]);

    return <svg ref={ref}></svg>;
};

export default LapChart;




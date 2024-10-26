import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LapPowerBuckets = ({ fullLapStream, powerBuckets }) => {
    useEffect(() => {
        console.log('fullLapStream', fullLapStream)
        console.log('powerBuckets', powerBuckets)
    }, [fullLapStream, powerBuckets])

    const svgRef = useRef();

    useEffect(() => {
        const minValue = powerBuckets[0];
        const maxValue = powerBuckets[1];
        console.log(minValue, maxValue)

        const belowMinCount = fullLapStream.filter(value => value < minValue).length;
        const withinRangeCount = fullLapStream.filter(value => value >= minValue && value <= maxValue).length;
        const aboveMaxCount = fullLapStream.filter(value => value > maxValue).length;
        console.log(belowMinCount, withinRangeCount, aboveMaxCount)

        const data = [
            { label: 'Below Min', count: belowMinCount },
            { label: 'Within Range', count: withinRangeCount },
            { label: 'Above Max', count: aboveMaxCount }
        ];

        // Set up SVG dimensions
        const svgWidth = 400;
        const svgHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        // Select the SVG element and clear any previous content
        const svg = d3.select(svgRef.current)
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        svg.selectAll('*').remove();

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        // Set up the container
        const chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Create the bars
        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.count))
            .attr('fill', 'steelblue');

        // Add x-axis
        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis
        chart.append('g')
            .call(d3.axisLeft(yScale));

    }, [fullLapStream, powerBuckets]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default LapPowerBuckets;

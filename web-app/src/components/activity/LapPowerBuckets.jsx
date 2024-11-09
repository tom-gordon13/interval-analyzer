import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LapPowerBuckets = ({ fullLapStream, powerBuckets, isOpen }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const minValue = powerBuckets[0];
        const maxValue = powerBuckets[1];

        const belowMinCount = fullLapStream.filter(value => value < minValue).length;
        const withinRangeCount = fullLapStream.filter(value => value >= minValue && value <= maxValue).length;
        const aboveMaxCount = fullLapStream.filter(value => value > maxValue).length;
        const totalCount = belowMinCount + withinRangeCount + aboveMaxCount;

        const data = [
            { label: `Below ${minValue}`, count: belowMinCount },
            { label: `Between ${minValue} and ${maxValue}`, count: withinRangeCount },
            { label: `Above ${maxValue}`, count: aboveMaxCount }
        ];

        const svgWidth = 400;
        const svgHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        svg.attr('width', svgWidth).attr('height', svgHeight);

        svg.selectAll('*').remove();

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        const chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("padding", "6px")
            .style("background", "rgba(0, 0, 0, 0.7)")
            .style("color", "#fff")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.count))
            .attr('fill', 'steelblue')
            .on("mouseover", function (event, d) {
                const percentage = ((d.count / totalCount) * 100).toFixed(1);
                tooltip
                    .style("opacity", 0.9)
                    .html(`${percentage}% of total`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("fill", "orange");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
                d3.select(this).attr("fill", "steelblue");
            });

        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        chart.append('g')
            .call(d3.axisLeft(yScale));

        return () => tooltip.remove();
    }, [fullLapStream, powerBuckets, isOpen]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default LapPowerBuckets;

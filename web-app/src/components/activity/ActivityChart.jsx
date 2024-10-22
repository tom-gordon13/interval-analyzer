import React, { useEffect, useRef } from 'react';
import '../../styles/activity-chart.css'
import * as d3 from 'd3';

import jsonData from '../../test-data/test-activity-cycling.json';


const ActivityChart = ({ data, selectedLaps, setSelectedLaps }) => {
    const ref = useRef();

    useEffect(() => {
        const svgWidth = 800, svgHeight = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.selectAll("*").remove();

        const colorScale = d3.scaleSequential(d3.interpolateReds)
            .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.value)]);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("z-index", "1000");


        let currentPosition = 0;

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => {
                let position = currentPosition;
                currentPosition += d.dynamicWidthValue;
                return position;
            })
            .attr("y", d => y(d.value))
            .attr("width", d => d.dynamicWidthValue)
            .attr("height", d => height - y(d.value))
            // .attr("fill", d => d.value > 200 ? 'tomato' : 'steelblue')
            .attr("fill", d => colorScale(d.value))
            .on("click", (event, d) => {
                const lapName = d.category
                setSelectedLaps(currentSelectedLaps => {
                    if (lapName in currentSelectedLaps) {
                        const updated = { ...selectedLaps };
                        delete updated[[d.category]];
                        return updated;
                    } else {
                        return {
                            ...currentSelectedLaps,
                            [d.category]: d.value
                        }
                    }

                });
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.category}<br/>Average Watts: ${d.value}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
                d3.select(this)
                    .attr("fill", "orange");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this)
                    .attr("fill", d => colorScale(d.value))
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)

        svg.append("g")
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={ref}></svg>;
};

export default ActivityChart;

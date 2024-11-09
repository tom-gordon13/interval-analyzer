import React, { useEffect, useRef } from 'react';
import '../../styles/activity-chart.css'
import * as d3 from 'd3';

const selectedLapColor = 'blue'

const ActivityChart = ({ data, selectedLaps, setSelectedLaps, isInEditMode }) => {
    const ref = useRef();

    useEffect(() => {
        const svgWidth = isInEditMode ? 1200 : 800;
        const svgHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .selectAll("*").remove();

        const g = d3.select(ref.current)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([0, d3.sum(data, d => d.dynamicWidthValue)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.value)]);

        const colorScale = d3.scaleSequential(d3.interpolateReds)
            .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("z-index", "1000");

        let currentPosition = 0;

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => {
                let position = currentPosition;
                currentPosition += d.dynamicWidthValue;
                return xScale(position);
            })
            .attr("y", d => yScale(d.value))
            .attr("width", d => xScale(d.dynamicWidthValue))
            .attr("height", d => height - yScale(d.value))
            .attr("fill", d => {
                return d.category in selectedLaps ? selectedLapColor : colorScale(d.value);
            })
            .on("click", (event, d) => {
                const lapName = d.category;
                setSelectedLaps(currentSelectedLaps => {
                    if (lapName in currentSelectedLaps) {
                        const updated = { ...currentSelectedLaps };
                        delete updated[d.category];
                        return updated;
                    } else {
                        return {
                            ...currentSelectedLaps,
                            [d.category]: d.value
                        };
                    }
                });
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(`${d.category}<br/>Average Watts: ${d.value}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("fill", "orange");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr("fill", d => {
                    return d.category in selectedLaps ? selectedLapColor : colorScale(d.value);
                });
            });

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));

        return () => {
            if (tooltip) tooltip.remove();
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [data, selectedLaps, setSelectedLaps, isInEditMode]);

    return <svg ref={ref}></svg>;
};

export default ActivityChart;
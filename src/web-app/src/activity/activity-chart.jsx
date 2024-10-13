import React, { useEffect, useRef } from 'react';
import './activity-chart.css'
import * as d3 from 'd3';

import jsonData from '../test-data/test-activity-cycling.json';


const ActivityChart = ({ data, selectedLaps, setSelectedLaps }) => {
    const ref = useRef();

    useEffect(() => {
        const svgWidth = 600, svgHeight = 400;
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


        // Assuming dynamicWidthValue directly translates to pixels here
        // Adjust as necessary for your data's scale
        let currentPosition = 0;

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => {
                let position = currentPosition;
                currentPosition += d.dynamicWidthValue; // Increase currentPosition by the dynamic width for the next bar
                return position;
            })
            .attr("y", d => y(d.value))
            .attr("width", d => d.dynamicWidthValue) // Use the dynamicWidthValue as the width directly
            .attr("height", d => height - y(d.value))
            // .attr("fill", d => d.value > 200 ? 'tomato' : 'steelblue')
            .attr("fill", d => colorScale(d.value))
            .on("click", (event, d) => {
                // Action to perform on bar click, e.g., logging the data
                const lapName = d.category
                setSelectedLaps(currentSelectedLaps => {
                    if (lapName in currentSelectedLaps) {
                        const updated = { ...selectedLaps };
                        console.log(updated)
                        delete updated[[d.category]];
                        console.log(updated)
                        return updated;
                    } else {
                        return {
                            ...currentSelectedLaps, // Spread the current state to copy its properties
                            [d.category]: d.value // Spread the new object to add its properties to the state
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
            // Update the mouseout function
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this)
                    .attr("fill", d => colorScale(d.value))
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
        // .call(d3.axisBottom(d3.scaleLinear().domain([0, data.length]).range([0, currentPosition]))); // Adjusted to use currentPosition for scale

        svg.append("g")
            .call(d3.axisLeft(y));
    }, [data]); // Dependency array

    return <svg ref={ref}></svg>;
};

export default ActivityChart;


// const ActivityChart = ({ data }) => {
//     const ref = useRef();

//     useEffect(() => {
//         // Define dimensions and margins for the chart
//         const svgWidth = 600, svgHeight = 400;
//         const margin = { top: 20, right: 20, bottom: 30, left: 40 };
//         const width = svgWidth - margin.left - margin.right;
//         const height = svgHeight - margin.top - margin.bottom;

//         // Create root container where we will append all other chart elements
//         const svg = d3.select(ref.current)
//             .attr("width", svgWidth)
//             .attr("height", svgHeight)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`);

//         // Clear SVG to prevent duplication
//         svg.selectAll("*").remove();

//         // Scales
//         const x = d3.scaleBand()
//             .range([0, width])
//             .padding(0)
//             .domain(data.map(d => d.category));

//         const y = d3.scaleLinear()
//             .range([height, 0])
//             .domain([0, d3.max(data, d => d.value)]);

//         const dynamicWidthScale = d3.scaleLinear()
//             .domain([0, d3.max(data, d => d.dynamicWidthValue)]) // Assuming dynamicWidthValue is within a known range
//             .range([0, x.bandwidth()]);

//         // Append x-axis
//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(x));

//         // Append y-axis
//         svg.append("g")
//             .call(d3.axisLeft(y));

//         // Draw bars
//         svg.selectAll(".bar")
//             .data(data)
//             .enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", d => x(d.category))
//             .attr("y", d => y(d.value))
//             // .attr("width", x.bandwidth())
//             .attr("width", d => dynamicWidthScale(d.dynamicWidthValue))
//             .attr("height", d => height - y(d.value))
//             .attr("fill", d => d.value > 200 ? 'tomato' : 'steelblue').on("click", (event, d) => {
//                 // Action to perform on bar click, e.g., logging the data
//                 console.log(`Clicked on ${d.category}: ${d.value}`);
//                 // You can also call other functions here or update the state to trigger React updates
//             });
//     }, [data]); // Redraw chart if data changes

//     return (
//         <svg ref={ref}></svg>
//     );
// };

// export default ActivityChart;

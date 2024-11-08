import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import jsonData from '../test-data/test-activity-cycling.json';
Chart.register(...registerables);

function createSequentialArray(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
}

const ActivityChart = () => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Ensure the chart is not initialized more than once
        if (chartInstance.current) {
            // chartInstance.current.destroy();
        }

        if (chartContainer && chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Category 1', 'Category 2', 'Category 3'],
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: [jsonData.laps[0].average_watts, null, null], // Only the first bar
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            barThickness: 50, // Width for the first bar
                        },
                        {
                            label: 'Dataset 2',
                            data: [null, jsonData.laps[1].average_watts, , null], // Only the second bar
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            barThickness: 20, // Different width for the second bar
                        },
                        {
                            label: 'Dataset 3',
                            data: [null, null, jsonData.laps[2].average_watts,], // Only the third bar
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            barThickness: 20, // Different width for the third bar
                        },
                    ]

                },
                // data: {
                //     labels: createSequentialArray(jsonData.laps.length),
                //     datasets: [{
                //         label: 'Laps',
                //         data: jsonData.laps.map(lap => lap.average_watts),
                //         borderWidth: 1
                //     }]
                // },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        },
                        x: [{
                            // Adjust these percentages to control space between bars
                            barPercentage: 1,
                            categoryPercentage: 1,
                        }]
                    }
                }
            });
        }
    }, []);

    return (
        <canvas ref={chartContainer}></canvas>
    );
};

export default ActivityChart;

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Assuming you have a canvas element in your HTML with id="myChart"
const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d')!;

const myChart = new Chart(ctx, {
    type: 'line', // or 'bar', 'pie', etc.
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3, 9],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

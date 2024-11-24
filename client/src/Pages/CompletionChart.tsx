// src/Components/CompletionChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CompletionChartProps {
    totalTitles: number;
    completedTitles: number;
}

const CompletionChart: React.FC<CompletionChartProps> = ({ totalTitles, completedTitles }) => {
    const data = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [completedTitles, totalTitles - completedTitles],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.raw}%`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
    };

    return (
        <div style={{ width: '50px', height: '50px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default CompletionChart;

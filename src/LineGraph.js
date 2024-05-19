import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ data }) => {
  const years = Object.keys(data).map(year => year.toString());
  const jobCounts = Object.values(data).map(item => item.totalJobs);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Jobs',
        data: jobCounts,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Total Jobs from 2020 to 2024',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineGraph;

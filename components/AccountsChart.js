import { useState } from 'react';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AccountsChart = ({ summary, refreshFunction }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Protect user',
        data: [65, 78, 66, 44, 56, 67, 75],
        backgroundColor: '#2F1DA9',
      },
      {
        label: 'Basic user',
        data: [65, 78, 66, 44, 56, 67, 75],
        backgroundColor: '#533DE9',
      },
      {
        label: 'Total user',
        data: [65, 78, 66, 44, 56, 67, 75],
        backgroundColor: '#EAECF0',
      },
    ],
  };

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <div class="table-responsive">
        {/* <div style={{ width: '1000px' }}> */}
        <Bar data={data} options={options} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default AccountsChart;

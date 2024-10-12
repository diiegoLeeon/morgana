import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTaskContext } from '../contexts/TaskContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { taskLists } = useTaskContext();

  // Simulated data for daily performance
  const dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: '#CBDBFF',
        tension: 0.1,
      },
      {
        label: 'Tasks Added',
        data: [15, 12, 6, 8, 3, 3, 5],
        borderColor: '#004AEC',
        tension: 0.1,
      },
    ],
  };

  // Simulated data for monthly performance
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 70, 75, 60, 50],
        backgroundColor: 'rgba(203, 219, 255, 0.6)',
      },
      {
        label: 'Tasks Added',
        data: [70, 62, 85, 84, 60, 58, 45, 50, 75, 80, 65, 55],
        backgroundColor: 'rgba(0, 74, 236, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Task Performance',
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="p-8 glass-card m-4">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Daily Task Performance</h2>
          <Line options={options} data={dailyData} />
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Task Performance</h2>
          <Bar options={options} data={monthlyData} />
        </div>
      </div>
      <div className="mt-8 bg-gray-800/50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Task Lists Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {taskLists.map((list) => (
            <div key={list.id} className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">{list.name}</h3>
              <p className="text-gray-300">Total Tasks: {list.tasks.length}</p>
              <p className="text-gray-300">
                Completed: {list.tasks.filter((task) => task.completed).length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
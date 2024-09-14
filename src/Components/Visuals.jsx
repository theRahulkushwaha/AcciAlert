import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './Visuals.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Visuals = () => {
  const [accidentData, setAccidentData] = useState({
    labels: [],
    counts: []
  });
  const [loading, setLoading] = useState(false);

  const fetchAccidentData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/accident_counts'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const labels = Object.keys(data);
      const counts = Object.values(data);

      setAccidentData(prevData => {
        const updatedLabels = [...new Set([...prevData.labels, ...labels])];
        const updatedCounts = updatedLabels.map(label => {
          const count = counts[labels.indexOf(label)] || 0;
          return prevData.counts[prevData.labels.indexOf(label)] || 0 + count;
        });

        return {
          labels: updatedLabels,
          counts: updatedCounts
        };
      });
    } catch (error) {
      console.error('Error fetching accident data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidentData(); // Initial fetch

    const intervalId = setInterval(fetchAccidentData, 200); // Fetch every 200ms

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const data = {
    labels: accidentData.labels,
    datasets: [
      {
        label: 'Accident Counts',
        data: accidentData.counts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Accident Counts by Type'
      }
    },
    scales: {
      y: {
        ticks: {
          stepSize: 2, // Adjust step size here
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value; // Show only integer values
            }
          }
        }
      }
    }
  };

  return (
    <div className='VisualsContainer'>
      <h2 className='VisualsTitle'>Accident Statistics</h2>
      <Bar className='VisualsChart'
        data={data}
        options={options}
      />
    </div>
  );
};

export default Visuals;

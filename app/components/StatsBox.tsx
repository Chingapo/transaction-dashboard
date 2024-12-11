import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stats {
  totalSale: number;
  totalItemsSold: number;
  totalItemsNotSold: number;
}

interface StatsBoxProps {
  selectedMonth: string;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const StatsBox: React.FC<StatsBoxProps> = ({ selectedMonth }) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/statistics?month=${selectedMonth}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, [selectedMonth]);

  if (!stats) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  const monthDisplay = selectedMonth === '13' ? 'All Months' : monthNames[parseInt(selectedMonth, 10) - 1];

  return (
    <div className="bg-blue-950 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Statistics for {monthDisplay}</h3>
      <div className="space-y-2">
        <p className="text-lg text-gray-100">
          <span className="font-medium">Total Sale:</span> ${stats.totalSale.toFixed(2)}
        </p>
        <p className="text-lg text-gray-100">
          <span className="font-medium">Total Sold Items:</span> {stats.totalItemsSold}
        </p>
        <p className="text-lg text-gray-100">
          <span className="font-medium">Total Unsold Items:</span> {stats.totalItemsNotSold}
        </p>
      </div>
    </div>
  );
};

export default StatsBox;

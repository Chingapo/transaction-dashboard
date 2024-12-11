"use client";
import { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import StatsBox from './components/StatsBox';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'All',
];

const IndexPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('13');

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Transaction Dashboard</h1>
      <div className="flex justify-center mb-6">
        <label className="mr-2">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border rounded bg-gray-800 text-gray-100"
        >
          {months.map((month, index) => (
            <option key={month} value={String(index + 1)}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <StatsBox selectedMonth={selectedMonth} />

      <TransactionTable selectedMonth={selectedMonth} />
      <BarChart selectedMonth={selectedMonth} />
      <PieChart selectedMonth={selectedMonth} />

      
    </div>
  );
};

export default IndexPage;

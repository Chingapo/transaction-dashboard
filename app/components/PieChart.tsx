import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, PieController, CategoryScale, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, PieController, CategoryScale);

interface CategoryData {
  category: string;
  count: number;
}

interface PieChartProps {
  selectedMonth: string;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const PieChart: React.FC<PieChartProps> = ({ selectedMonth }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`/api/pieChart?month=${selectedMonth}`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, [selectedMonth]);

  useEffect(() => {
    if (categories.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const chartData = {
        labels: categories.map((category) => category.category),
        datasets: [
          {
            label: 'Number of Items',
            data: categories.map((category) => category.count),
            backgroundColor: [
              '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#F2FF33',
              '#FF9133', '#33FF91', '#9133FF', '#33F2FF', '#F7B533'
            ],
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Items per Category for ${parseInt(selectedMonth) !== 13 ? monthNames[parseInt(selectedMonth) - 1] : 'All Months'}`,
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'pie'>) => `${context.label}: ${context.raw} items`,
            },
          },
        },
      };

      chartInstance.current = new ChartJS(chartRef.current, {
        type: 'pie',
        data: chartData,
        options: chartOptions,
      });
    }
  }, [categories]);

  return (
    <div className="bg-blue-950 p-6 rounded-lg shadow-md h-3/5 w-4/6 mx-auto mt-10 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold text-gray-100 mb-4">
        Items per Category for {parseInt(selectedMonth) !== 13 ? monthNames[parseInt(selectedMonth) - 1] : 'All Months'}
      </h3>
      {categories.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <div className="text-center text-lg text-gray-100">Loading...</div>
      )}
    </div>
  );
};

export default PieChart;

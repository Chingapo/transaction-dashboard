import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController, TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

interface PriceRange {
  range: string;
  count: number;
}

interface PriceChartProps {
  selectedMonth: string;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const PriceChart: React.FC<PriceChartProps> = ({ selectedMonth }) => {
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    const fetchPriceRanges = async () => {
      try {
        const response = await axios.get(`/api/barChart?month=${selectedMonth}`);
        setPriceRanges(response.data.priceRanges);
      } catch (error) {
        console.error('Error fetching price ranges:', error);
      }
    };

    fetchPriceRanges();
  }, [selectedMonth]);

  useEffect(() => {
    if (priceRanges.length > 0 && chartRef.current) {
      // Destroy previous chart if it exists, else throws error
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const sortedPriceRanges = [...priceRanges].sort((a, b) => {
        const aMin = parseInt(a.range.split('-')[0], 10);
        const bMin = parseInt(b.range.split('-')[0], 10);
        return aMin - bMin;
      });

      const chartData = {
        labels: sortedPriceRanges.map((range) => range.range),
        datasets: [
          {
            label: 'Number of Items',
            color: 'rgb(243, 244, 246)',
            data: sortedPriceRanges.map((range) => range.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Price Range vs. Number of Items',
            color: 'rgb(243, 244, 246)',
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'bar'>) => `Items: ${context.raw}`,
              color: 'rgb(243, 244, 246)',
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price Range',
              color: 'rgb(243, 244, 246)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Items',
              color: 'rgb(243, 244, 246)',
            },
          },
        },
      };

      chartInstance.current = new ChartJS(chartRef.current, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceRanges]);

  return (
    <div className="bg-blue-950 p-6 mx-auto rounded-lg w-4/6 shadow-md mt-10 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold text-gray-100 mb-4">
        Price Range vs. Number of Items for {parseInt(selectedMonth) !== 13 ? monthNames[parseInt(selectedMonth) - 1] : 'All Months'}
      </h3>
      {priceRanges.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <div className="text-center text-lg text-gray-100">Loading...</div>
      )}
    </div>
  );
};

export default PriceChart;

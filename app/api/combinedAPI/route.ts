import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const month = searchParams.get('month') || '13';

    const [statsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/statistics?month=${month}`),
      fetch(`${API_BASE_URL}/barChart?month=${month}`),
      fetch(`${API_BASE_URL}/pieChart?month=${month}`),
    ]);

    if (!statsResponse.ok || !barChartResponse.ok || !pieChartResponse.ok) {
      throw new Error('Failed to fetch one or more of the APIs.');
    }

    const statsData = await statsResponse.json();
    const barChartData = await barChartResponse.json();
    const pieChartData = await pieChartResponse.json();

    const combinedData = {
      statistics: statsData,
      barChart: barChartData,
      pieChart: pieChartData,
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    return NextResponse.json({ error: 'Failed to fetch combined data' }, { status: 500 });
  }
}

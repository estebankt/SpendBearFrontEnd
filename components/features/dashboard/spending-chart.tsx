'use client';

import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useCurrentMonthlySummary } from '@/lib/hooks/use-analytics';
import { PieChart } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Spending Chart Component
 *
 * Features:
 * - Donut chart showing spending by category
 * - Legend with category names and amounts
 * - Responsive sizing
 * - Loading state
 * - Empty state when no data
 */
export function SpendingChart() {
  const { data: summary, isLoading } = useCurrentMonthlySummary();

  // Generate chart data from spending by category
  const chartData = React.useMemo(() => {
    if (!summary || !summary.spendingByCategory) {
      return null;
    }

    const categories = Object.keys(summary.spendingByCategory);
    const amounts = Object.values(summary.spendingByCategory);

    // Filter out zero amounts
    const filteredData = categories
      .map((category, index) => ({
        category,
        amount: amounts[index] || 0,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending

    if (filteredData.length === 0) {
      return null;
    }

    // Generate colors for each category
    const colors = generateColors(filteredData.length);

    return {
      labels: filteredData.map((item) => item.category),
      datasets: [
        {
          data: filteredData.map((item) => item.amount),
          backgroundColor: colors,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 2,
        },
      ],
    };
  }, [summary]);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 12,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = (data.datasets[0]?.data[i] as number) || 0;
                const formattedValue = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value);

                return {
                  text: `${label}: ${formattedValue}`,
                  fillStyle: (data.datasets[0]?.backgroundColor as string[])?.[i] || '',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value);

            // Calculate percentage
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);

            return `${label}: ${formattedValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center justify-center">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!chartData) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={PieChart}
          title="No spending data"
          description="Start adding transactions to see your spending breakdown by category"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
      <div className="max-w-full">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
}

// Helper function to generate colors for chart
function generateColors(count: number): string[] {
  const baseColors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(14, 165, 233, 0.8)',   // Sky
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(34, 197, 94, 0.8)',    // Lime
    'rgba(168, 85, 247, 0.8)',   // Violet
  ];

  // If we need more colors than base, generate additional ones
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors = [...baseColors];
  const remaining = count - baseColors.length;

  for (let i = 0; i < remaining; i++) {
    const hue = (i * 137.5) % 360; // Golden angle for even distribution
    colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
  }

  return colors;
}

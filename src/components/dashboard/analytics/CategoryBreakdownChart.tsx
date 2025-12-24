import { CategoryBreakdown } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdown[];
}

export default function CategoryBreakdownChart({ categories }: CategoryBreakdownChartProps) {
  // Calculate cumulative percentages for the conic gradient
  let cumulativePercentage = 0;
  const gradientStops = categories.map((cat) => {
    const startPercentage = cumulativePercentage;
    cumulativePercentage += cat.percentage;
    return `${cat.color} ${startPercentage}% ${cumulativePercentage}%`;
  }).join(', ');

  return (
    <div className="glass-panel rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-text-main mb-6">Category Breakdown</h3>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Donut Chart */}
        <div className="flex items-center justify-center flex-shrink-0">
          <div className="relative w-48 h-48">
            {/* Outer circle with gradient */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(${gradientStops})`,
              }}
            />
            {/* Inner circle to create donut effect */}
            <div className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-background-dark flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-main">100%</p>
                <p className="text-xs text-text-muted">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 content-start">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-main truncate">
                    {cat.category}
                  </p>
                  <p className="text-sm font-semibold text-text-main">
                    {cat.percentage.toFixed(1)}%
                  </p>
                </div>
                <p className="text-xs text-text-muted truncate">
                  {formatCurrency(cat.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

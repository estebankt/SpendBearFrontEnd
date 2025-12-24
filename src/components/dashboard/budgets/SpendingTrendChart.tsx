import { formatCurrency } from '@/lib/utils';

interface SpendingTrendData {
  week: number;
  actual: number;
  projected: number;
}

interface SpendingTrendChartProps {
  data: SpendingTrendData[];
}

export default function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const maxValue = Math.max(...data.flatMap((d) => [d.actual, d.projected]));
  const chartHeight = 200;

  return (
    <div className="glass-panel rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-main">Spending Trend</h3>
          <p className="text-sm text-text-muted">Actual vs Projected</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-text-muted">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-blue" />
            <span className="text-text-muted">Projected</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
          {data.map((item, index) => {
            const actualHeight = (item.actual / maxValue) * chartHeight;
            const projectedHeight = (item.projected / maxValue) * chartHeight;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                {/* Bars */}
                <div className="w-full flex gap-1 items-end justify-center">
                  {/* Actual Bar */}
                  <div className="relative group flex-1">
                    <div
                      className="bg-primary rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${actualHeight}px` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-dark rounded text-xs text-text-main whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {formatCurrency(item.actual)}
                    </div>
                  </div>

                  {/* Projected Bar */}
                  <div className="relative group flex-1">
                    <div
                      className="bg-accent-blue rounded-t-md transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${projectedHeight}px` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-dark rounded text-xs text-text-main whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {formatCurrency(item.projected)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis Labels */}
      <div className="flex items-center justify-between mt-4 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-text-muted">Week {item.week}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Card from '@/components/ui/Card';
import { MOCK_CASH_FLOW } from '@/lib/constants';

export default function CashFlowChart() {
  const maxValue = Math.max(...MOCK_CASH_FLOW.flatMap(w => [w.income, w.expenses]));

  return (
    <Card className="col-span-2 animate-enter delay-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Cash Flow</h3>
          <p className="text-sm text-text-muted">Income vs Expenses</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green text-sm font-bold">
          Net: +$4,500
        </span>
      </div>

      <div className="h-64 flex items-end justify-between gap-4 mb-6">
        {MOCK_CASH_FLOW.map((week, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center gap-1 h-48">
              {/* Income bar */}
              <div
                className="w-1/2 bg-accent-blue rounded-t hover:bg-accent-blue/80 transition-colors cursor-pointer relative group"
                style={{ height: `${(week.income / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dark-highlight px-2 py-1 rounded text-xs text-text-main whitespace-nowrap">
                  ${week.income}
                </div>
              </div>
              {/* Expenses bar */}
              <div
                className="w-1/2 bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer relative group"
                style={{ height: `${(week.expenses / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dark-highlight px-2 py-1 rounded text-xs text-text-main whitespace-nowrap">
                  ${week.expenses}
                </div>
              </div>
            </div>
            <span className="text-xs text-text-muted font-medium">{week.week}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent-blue"></div>
          <span className="text-sm text-text-muted">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary"></div>
          <span className="text-sm text-text-muted">Expenses</span>
        </div>
      </div>
    </Card>
  );
}

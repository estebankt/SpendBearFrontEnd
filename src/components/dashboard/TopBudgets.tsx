import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { MOCK_BUDGETS } from '@/lib/constants';

export default function TopBudgets() {
  return (
    <Card className="animate-enter delay-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Top Budgets</h3>
          <p className="text-sm text-text-muted">This month&apos;s progress</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_BUDGETS.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${budget.color}/10`}>
                    <span className={`material-symbols-outlined ${budget.color} text-[16px]`}>
                      {budget.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-main">{budget.name}</p>
                    <p className="text-xs text-text-muted">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </p>
                  </div>
                </div>
                {budget.warning && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-primary/10 text-primary">
                    Near Limit
                  </span>
                )}
              </div>
              <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    budget.warning ? 'bg-primary' : budget.color
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

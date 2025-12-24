import { formatCurrency } from '@/lib/utils';

interface BudgetSummaryCardsProps {
  leftToSpend: number;
  totalBudgeted: number;
  daysRemaining: number;
  totalDaysInMonth: number;
}

export default function BudgetSummaryCards({
  leftToSpend,
  totalBudgeted,
  daysRemaining,
  totalDaysInMonth,
}: BudgetSummaryCardsProps) {
  const daysElapsed = totalDaysInMonth - daysRemaining;
  const progressPercentage = (daysElapsed / totalDaysInMonth) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Left to Spend Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Left to Spend</h3>
          <span className="material-symbols-outlined text-accent-green text-2xl">
            savings
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-accent-green mb-2">
            {formatCurrency(leftToSpend)}
          </p>
          <div className="w-full bg-surface-dark-highlight rounded-full h-2 mb-2">
            <div
              className="bg-accent-green h-2 rounded-full transition-all"
              style={{ width: `${Math.max(0, (leftToSpend / totalBudgeted) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted">
            {Math.round((leftToSpend / totalBudgeted) * 100)}% remaining
          </p>
        </div>
      </div>

      {/* Total Budgeted Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Total Budgeted</h3>
          <span className="material-symbols-outlined text-accent-yellow text-2xl">
            account_balance_wallet
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-text-main">
            {formatCurrency(totalBudgeted)}
          </p>
          <p className="text-xs text-text-muted mt-1">This month</p>
        </div>
      </div>

      {/* Days Remaining Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Days Remaining</h3>
          <span className="material-symbols-outlined text-accent-blue text-2xl">
            calendar_today
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-text-main mb-2">
            {daysRemaining}
            <span className="text-lg text-text-muted ml-1">days</span>
          </p>
          <div className="w-full bg-surface-dark-highlight rounded-full h-2 mb-2">
            <div
              className="bg-accent-blue h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-muted">
            {daysElapsed} of {totalDaysInMonth} days elapsed
          </p>
        </div>
      </div>
    </div>
  );
}

import { formatCurrency } from '@/lib/utils';

interface AnalyticsSummaryCardsProps {
  totalSpending: number;
  netSavings: number;
  budgetAdherence: number;
}

export default function AnalyticsSummaryCards({
  totalSpending,
  netSavings,
  budgetAdherence,
}: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Spending Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Total Foraging</h3>
          <span className="material-symbols-outlined text-primary text-2xl">
            shopping_cart
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(totalSpending)}
          </p>
          <p className="text-xs text-text-muted mt-1">Total spent this period</p>
        </div>
      </div>

      {/* Net Savings Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Honey Pot</h3>
          <span className="material-symbols-outlined text-accent-green text-2xl">
            savings
          </span>
        </div>
        <div className="flex flex-col">
          <p className={`text-3xl font-bold ${netSavings >= 0 ? 'text-accent-green' : 'text-primary'}`}>
            {formatCurrency(netSavings)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {netSavings >= 0 ? 'Net savings' : 'Net deficit'}
          </p>
        </div>
      </div>

      {/* Budget Adherence Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Budget Adherence</h3>
          <span className="material-symbols-outlined text-accent-yellow text-2xl">
            pie_chart
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-accent-yellow">
            {budgetAdherence.toFixed(1)}%
          </p>
          <div className="w-full bg-surface-dark-highlight rounded-full h-2 mt-2">
            <div
              className="bg-accent-yellow h-2 rounded-full transition-all"
              style={{ width: `${Math.min(budgetAdherence, 100)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            {budgetAdherence <= 100 ? 'Within budget' : 'Over budget'}
          </p>
        </div>
      </div>
    </div>
  );
}

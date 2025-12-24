import { formatCurrency } from '@/lib/utils';

interface TransactionSummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export default function TransactionSummaryCards({
  totalIncome,
  totalExpenses,
  netBalance,
}: TransactionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Income Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Total Income</h3>
          <span className="material-symbols-outlined text-accent-green text-2xl">
            trending_up
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-accent-green">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-text-muted mt-1">This period</p>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Total Expenses</h3>
          <span className="material-symbols-outlined text-primary text-2xl">
            trending_down
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-xs text-text-muted mt-1">This period</p>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-muted">Net Balance</h3>
          <span className="material-symbols-outlined text-accent-blue text-2xl">
            account_balance_wallet
          </span>
        </div>
        <div className="flex flex-col">
          <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-accent-green' : 'text-primary'}`}>
            {formatCurrency(netBalance)}
          </p>
          <p className="text-xs text-text-muted mt-1">Income - Expenses</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { useMonthlyAnalytics } from '@/lib/hooks/use-analytics';

export default function KPICards() {
  const now = new Date();
  const { data, isLoading, error } = useMonthlyAnalytics(now.getFullYear(), now.getMonth() + 1);

  const totalIncome = data?.totalIncome ?? 0;
  const totalExpense = data?.totalExpense ?? 0;
  const netBalance = data?.netBalance ?? 0;
  const budgetUsage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  const savingsRate = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-enter">
        {[1, 2, 3].map((i) => (
          <Card key={i} hoverEffect>
            <div className="animate-pulse">
              <div className="h-4 bg-surface-dark-highlight rounded w-1/3 mb-4" />
              <div className="h-8 bg-surface-dark-highlight rounded w-2/3 mb-4" />
              <div className="h-2 bg-surface-dark-highlight rounded w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-enter">
      {/* Net Balance */}
      <Card hoverEffect>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10">
              <span className="material-symbols-outlined text-accent-green text-[24px]">
                account_balance_wallet
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Net Balance</p>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-text-main' : 'text-primary'}`}>
                {formatCurrency(netBalance)}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
            netBalance >= 0 ? 'bg-accent-green/10 text-accent-green' : 'bg-primary/10 text-primary'
          }`}>
            <span className="material-symbols-outlined text-[14px]">
              {netBalance >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">This Month</span>
            <span className="text-text-main font-medium">{formatCurrency(totalIncome)} income</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Total Spent */}
      <Card hoverEffect className="delay-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="material-symbols-outlined text-primary text-[24px]">
                payments
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-text-main">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {budgetUsage}%
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Budget Usage</span>
            <span className="text-text-main font-medium">{budgetUsage}%</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Savings Rate */}
      <Card hoverEffect className="delay-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10">
              <span className="material-symbols-outlined text-accent-yellow text-[24px]">
                savings
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Honey Pot</p>
              <p className="text-2xl font-bold text-text-main">
                {savingsRate}%
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-monokai-gray/10 text-text-muted text-xs font-bold">
            Savings Rate
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Savings Rate</span>
            <span className="text-text-main font-medium">{savingsRate}%</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-yellow rounded-full transition-all"
              style={{ width: `${Math.max(0, savingsRate)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

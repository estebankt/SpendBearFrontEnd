'use client';

import { StatCard } from '@/components/ui/stat-card';
import { useCurrentMonthlySummary, usePreviousMonthlySummary } from '@/lib/hooks/use-analytics';
import { TrendingUp, DollarSign, Wallet, PiggyBank } from 'lucide-react';

/**
 * Stats Cards Component
 *
 * Features:
 * - Displays Total Spending, Total Income, Net Balance
 * - Shows comparison to previous month (percentage change)
 * - Loading skeletons
 * - Color-coded based on positive/negative change
 */
export function StatsCards() {
  const { data: currentMonth, isLoading: isLoadingCurrent } = useCurrentMonthlySummary();
  const { data: previousMonth, isLoading: isLoadingPrevious } = usePreviousMonthlySummary();

  const isLoading = isLoadingCurrent || isLoadingPrevious;

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const spendingChange = currentMonth && previousMonth
    ? calculateChange(currentMonth.totalExpense, previousMonth.totalExpense)
    : 0;

  const incomeChange = currentMonth && previousMonth
    ? calculateChange(currentMonth.totalIncome, previousMonth.totalIncome)
    : 0;

  const balanceChange = currentMonth && previousMonth
    ? calculateChange(currentMonth.netBalance, previousMonth.netBalance)
    : 0;

  // Format currency
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Spending */}
      <StatCard
        label="Total Spending"
        value={currentMonth ? formatCurrency(currentMonth.totalExpense) : '$0'}
        change={{
          value: spendingChange,
          label: 'vs last month',
        }}
        icon={Wallet}
        loading={isLoading}
      />

      {/* Total Income */}
      <StatCard
        label="Total Income"
        value={currentMonth ? formatCurrency(currentMonth.totalIncome) : '$0'}
        change={{
          value: incomeChange,
          label: 'vs last month',
        }}
        icon={TrendingUp}
        loading={isLoading}
      />

      {/* Net Balance */}
      <StatCard
        label="Net Balance"
        value={currentMonth ? formatCurrency(currentMonth.netBalance) : '$0'}
        change={{
          value: balanceChange,
          label: 'vs last month',
        }}
        icon={currentMonth && currentMonth.netBalance >= 0 ? PiggyBank : DollarSign}
        loading={isLoading}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}

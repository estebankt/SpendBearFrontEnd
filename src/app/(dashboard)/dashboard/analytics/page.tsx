'use client';

import { useState, useMemo } from 'react';
import { useMonthlyAnalytics } from '@/lib/hooks/use-analytics';
import { useCategories } from '@/lib/hooks/use-categories';
import { mapMonthlySummary } from '@/lib/api/mappers';
import AnalyticsSummaryCards from '@/components/dashboard/analytics/AnalyticsSummaryCards';
import PeriodSelector from '@/components/dashboard/analytics/PeriodSelector';
import CategoryBreakdownChart from '@/components/dashboard/analytics/CategoryBreakdownChart';
import TopCategoriesList from '@/components/dashboard/analytics/TopCategoriesList';

type Period = 'month' | 'quarter' | 'year';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: analyticsData, isLoading, isError } = useMonthlyAnalytics(year, month);
  const { data: categories = [] } = useCategories();

  const analytics = useMemo(() => {
    if (!analyticsData) return null;
    return mapMonthlySummary(analyticsData, categories);
  }, [analyticsData, categories]);

  const currentPeriodLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const handlePrevPeriod = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const handleNextPeriod = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div className="max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Analytics</h1>
        <p className="text-text-muted">
          Insights into your spending patterns and financial health
        </p>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        currentPeriodLabel={currentPeriodLabel}
        onPrev={handlePrevPeriod}
        onNext={handleNextPeriod}
      />

      {/* Loading/Error */}
      {isLoading && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading analytics...</p>
        </div>
      )}

      {isError && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 block">error</span>
          <p className="text-sm text-text-muted">Failed to load analytics</p>
        </div>
      )}

      {!isLoading && !isError && analytics && (
        <>
          {/* Summary Cards */}
          <AnalyticsSummaryCards
            totalSpending={analytics.totalSpending}
            netSavings={analytics.netSavings}
            budgetAdherence={analytics.budgetAdherence}
          />

          {/* Category Breakdown Chart */}
          <CategoryBreakdownChart categories={analytics.categoryBreakdown} />

          {/* Top Categories List */}
          <TopCategoriesList
            categories={analytics.topCategories}
            totalSpending={analytics.totalSpending}
          />
        </>
      )}

      {!isLoading && !isError && !analytics && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted mb-4 block">
            bar_chart
          </span>
          <h3 className="text-lg font-semibold text-text-main mb-2">No data available</h3>
          <p className="text-sm text-text-muted">
            No transactions found for this period. Start adding transactions to see analytics.
          </p>
        </div>
      )}
    </div>
  );
}

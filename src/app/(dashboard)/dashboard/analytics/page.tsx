'use client';

import { useState } from 'react';
import { MONTHLY_ANALYTICS } from '@/lib/constants';
import AnalyticsSummaryCards from '@/components/dashboard/analytics/AnalyticsSummaryCards';
import PeriodSelector from '@/components/dashboard/analytics/PeriodSelector';
import CategoryBreakdownChart from '@/components/dashboard/analytics/CategoryBreakdownChart';
import TopCategoriesList from '@/components/dashboard/analytics/TopCategoriesList';

type Period = 'month' | 'quarter' | 'year';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [currentPeriodLabel] = useState('January 2024');

  const analytics = MONTHLY_ANALYTICS;

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
      />

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
    </div>
  );
}

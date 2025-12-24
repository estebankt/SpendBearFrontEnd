import { CategoryBreakdown } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface TopCategoriesListProps {
  categories: CategoryBreakdown[];
  totalSpending: number;
}

export default function TopCategoriesList({ categories, totalSpending }: TopCategoriesListProps) {
  return (
    <div className="glass-panel rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-main">Top Spending Categories</h3>
        <span className="text-xs text-text-muted">
          {categories.length} categories
        </span>
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-dark-highlight text-text-main text-sm font-bold">
                  {index + 1}
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: cat.color }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">
                    {cat.category}
                  </p>
                  <p className="text-xs text-text-muted">
                    {cat.percentage.toFixed(1)}% of total
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-text-main">
                {formatCurrency(cat.amount)}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-dark-highlight rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-border-muted">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-muted">Total Spending</p>
          <p className="text-lg font-bold text-text-main">
            {formatCurrency(totalSpending)}
          </p>
        </div>
      </div>
    </div>
  );
}

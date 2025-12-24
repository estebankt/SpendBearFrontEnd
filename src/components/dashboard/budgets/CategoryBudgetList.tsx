import { CategoryBudget } from '@/lib/types';
import CategoryBudgetItem from './CategoryBudgetItem';

interface CategoryBudgetListProps {
  budgets: CategoryBudget[];
}

export default function CategoryBudgetList({ budgets }: CategoryBudgetListProps) {
  // Sort budgets by percentage used (highest first)
  const sortedBudgets = [...budgets].sort((a, b) => b.percentageUsed - a.percentageUsed);

  if (budgets.length === 0) {
    return (
      <div className="glass-panel rounded-lg p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-text-muted mb-4 block">
          savings
        </span>
        <h3 className="text-lg font-semibold text-text-main mb-2">
          No budgets set
        </h3>
        <p className="text-sm text-text-muted mb-6">
          Create your first budget to start tracking your spending.
        </p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Create Budget
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="p-4 bg-surface-dark-highlight border-b border-border-muted">
        <h3 className="text-lg font-semibold text-text-main">Category Budgets</h3>
        <p className="text-sm text-text-muted">
          {sortedBudgets.filter((b) => b.isOverBudget).length} over budget,{' '}
          {sortedBudgets.filter((b) => b.isNearLimit && !b.isOverBudget).length} near limit
        </p>
      </div>

      <div className="divide-y divide-border-muted">
        {sortedBudgets.map((budget) => (
          <CategoryBudgetItem key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
}

'use client';

import { TransactionType } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: TransactionType | 'all';
  onTypeChange: (value: TransactionType | 'all') => void;
}

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
}: TransactionFiltersProps) {
  return (
    <div className="glass-panel rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-surface-dark-highlight rounded-lg px-4 py-2">
          <span className="material-symbols-outlined text-text-muted text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-text-main placeholder-text-muted focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-surface-dark-highlight rounded-lg px-4 py-2">
          <span className="material-symbols-outlined text-text-muted text-xl">
            category
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="flex-1 bg-transparent text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 bg-surface-dark-highlight rounded-lg px-4 py-2">
          <span className="material-symbols-outlined text-text-muted text-xl">
            filter_list
          </span>
          <select
            value={selectedType}
            onChange={(e) => {
              const value = e.target.value;
              onTypeChange(value === 'all' ? 'all' : parseInt(value) as TransactionType);
            }}
            className="flex-1 bg-transparent text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value={TransactionType.Income}>Income</option>
            <option value={TransactionType.Expense}>Expense</option>
          </select>
        </div>
      </div>
    </div>
  );
}

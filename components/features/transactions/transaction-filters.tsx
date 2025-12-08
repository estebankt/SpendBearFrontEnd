'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { CategorySelect } from '@/components/features/categories/category-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionType } from '@/types/api';

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: number;
}

export interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

/**
 * Transaction Filters Component
 *
 * Features:
 * - Filter by date range (start/end date)
 * - Filter by category
 * - Filter by transaction type (Income/Expense)
 * - Clear all filters button
 * - Active filter count badge
 */
export function TransactionFiltersComponent({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      startDate: date ? date.toISOString() : undefined,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date ? date.toISOString() : undefined,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId || undefined,
    });
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type === 'all' ? undefined : Number(type),
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.categoryId) count++;
    if (filters.type !== undefined) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Start Date
          </label>
          <DatePicker
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={handleStartDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            End Date
          </label>
          <DatePicker
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={handleEndDateChange}
            placeholder="Select end date"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <CategorySelect
            value={filters.categoryId || ''}
            onChange={handleCategoryChange}
            placeholder="All categories"
            allowClear
          />
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Type
          </label>
          <Select
            value={
              filters.type === undefined
                ? 'all'
                : filters.type === TransactionType.Income
                ? 'income'
                : 'expense'
            }
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={String(TransactionType.Income)}>Income</SelectItem>
              <SelectItem value={String(TransactionType.Expense)}>Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

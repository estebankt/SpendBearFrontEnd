'use client';

import * as React from 'react';
import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  format,
} from 'date-fns';
import { TransactionItem } from './transaction-item';
import { TransactionFormModal } from './transaction-form-modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactions, useDeleteTransaction } from '@/lib/hooks/use-transactions';
import type { Transaction } from '@/types/api';
import { Receipt } from 'lucide-react';

export interface TransactionListProps {
  filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    type?: number;
  };
}

/**
 * Transaction List Component
 *
 * Features:
 * - Groups transactions by date (Today, Yesterday, This Week, etc.)
 * - Edit and delete functionality
 * - Loading skeleton
 * - Empty state
 * - Infinite scroll support (TODO)
 */
export function TransactionList({ filters }: TransactionListProps) {
  const { data: transactions, isLoading } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();

  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = React.useState<Transaction | null>(null);

  // Group transactions by date
  const groupedTransactions = React.useMemo(() => {
    if (!transactions?.items) return {};

    const groups: Record<string, Transaction[]> = {};

    transactions.items.forEach((transaction) => {
      const date = new Date(transaction.date);
      let groupKey: string;

      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else if (isThisWeek(date)) {
        groupKey = 'This Week';
      } else if (isThisMonth(date)) {
        groupKey = 'This Month';
      } else {
        groupKey = format(date, 'MMMM yyyy');
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey]!.push(transaction);
    });

    // Sort transactions within each group by date (newest first)
    Object.keys(groups).forEach((key) => {
      groups[key]!.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    });

    return groups;
  }, [transactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;

    try {
      await deleteMutation.mutateAsync(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (error) {
      // Error is handled by mutation (toast notification)
      console.error('Delete transaction error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <div className="border rounded-lg overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!transactions?.items || transactions.items.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Start tracking your spending by adding your first transaction"
      />
    );
  }

  // Group order (to ensure consistent ordering)
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month'];
  const sortedGroupKeys = Object.keys(groupedTransactions).sort((a, b) => {
    const aIndex = groupOrder.indexOf(a);
    const bIndex = groupOrder.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // For month groups, sort by date (newest first)
    return b.localeCompare(a);
  });

  return (
    <>
      <div className="space-y-6">
        {sortedGroupKeys.map((groupKey) => (
          <div key={groupKey} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              {groupKey}
            </h3>
            <div className="border rounded-lg overflow-hidden bg-card">
              {groupedTransactions[groupKey]!.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <TransactionFormModal
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction || undefined}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description={`Are you sure you want to delete "${deletingTransaction?.description}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </>
  );
}

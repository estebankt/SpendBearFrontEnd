'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { CategoryBadge } from '@/components/features/categories/category-badge';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { ArrowRight, Receipt } from 'lucide-react';
import { TransactionType } from '@/types/api';
import { cn } from '@/lib/utils/cn';

/**
 * Recent Transactions Widget
 *
 * Features:
 * - Shows last 5 transactions
 * - Compact transaction display
 * - "View All" link to transactions page
 * - Loading skeleton
 * - Empty state
 */
export function RecentTransactions() {
  const { data: transactionData, isLoading } = useTransactions();

  // Get last 5 transactions
  const recentTransactions = transactionData?.items?.slice(0, 5) || [];

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!recentTransactions || recentTransactions.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Receipt}
          title="No transactions"
          description="Start adding transactions to track your spending"
          action={{
            label: 'Add Transaction',
            onClick: () => {
              window.location.href = '/transactions';
            },
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === TransactionType.Income;

            const formattedAmount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: transaction.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(transaction.amount);

            const relativeTime = formatDistanceToNow(new Date(transaction.date), {
              addSuffix: true,
            });

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 py-2 hover:bg-accent/50 rounded-md px-2 -mx-2 transition-colors"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                    isIncome ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                  )}
                >
                  <span className="text-lg">
                    {isIncome ? '💰' : transaction.category?.name[0] || '📝'}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {transaction.category && (
                      <CategoryBadge
                        name={transaction.category.name}
                        isSystemCategory={transaction.category.isSystemCategory}
                        variant="compact"
                      />
                    )}
                    <span className="text-xs text-muted-foreground">{relativeTime}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={cn(
                      'font-semibold text-sm',
                      isIncome ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {isIncome && '+'}
                    {formattedAmount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

'use client';

import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useCategories } from '@/lib/hooks/use-categories';
import { mapTransaction } from '@/lib/api/mappers';
import { useMemo } from 'react';
import { TransactionType } from '@/lib/types';

export default function RecentTransactions() {
  const { data: transactionsData, isLoading, error } = useTransactions({ pageSize: 5 });
  const { data: categories = [], error: catError } = useCategories();

  const transactions = useMemo(() => {
    if (!transactionsData?.items) return [];
    return transactionsData.items.map((t) => mapTransaction(t, categories));
  }, [transactionsData, categories]);

  return (
    <Card className="col-span-2 animate-enter delay-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Recent Transactions</h3>
          <p className="text-sm text-text-muted">Your latest activity</p>
        </div>
        <a href="/dashboard/transactions" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All →
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 py-3">
              <div className="w-10 h-10 bg-surface-dark-highlight rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-surface-dark-highlight rounded w-1/3 mb-2" />
                <div className="h-3 bg-surface-dark-highlight rounded w-1/4" />
              </div>
              <div className="h-4 bg-surface-dark-highlight rounded w-16" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">No recent transactions</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Merchant
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === TransactionType.Income;
                const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/5 hover:bg-surface-dark-highlight/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: transaction.iconColor + '20' }}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ color: transaction.iconColor }}
                          >
                            {transaction.icon}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-text-main">
                          {transaction.merchant}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-monokai-gray/10 text-text-muted">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-text-muted">{formattedDate}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`text-sm font-bold ${
                          isIncome ? 'text-accent-green' : 'text-primary'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/features/categories/category-badge';
import type { Transaction } from '@/types/api';
import { TransactionType } from '@/types/api';
import { cn } from '@/lib/utils/cn';

export interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

/**
 * Transaction List Item Component
 *
 * Features:
 * - Displays transaction details (category, description, amount, date)
 * - Different styling for income vs expense
 * - Edit and delete actions
 * - Relative time display
 */
export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === TransactionType.Income;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount);

  const relativeTime = formatDistanceToNow(new Date(transaction.date), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Category Icon */}
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

        {/* Description & Category */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-1">
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
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-2 ml-4">
        <div className="text-right">
          <p
            className={cn(
              'font-semibold',
              isIncome ? 'text-success' : 'text-foreground'
            )}
          >
            {isIncome && '+'}
            {formattedAmount}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons (visible on hover) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(transaction)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(transaction)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Transaction, TransactionType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isIncome = transaction.type === TransactionType.Income;

  return (
    <tr className="border-b border-border-muted hover:bg-surface-dark-highlight transition-colors">
      {/* Icon & Merchant */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: transaction.iconColor + '20' }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: transaction.iconColor }}
            >
              {transaction.icon}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-main truncate">
              {transaction.merchant}
            </p>
            {transaction.description && (
              <p className="text-xs text-text-muted truncate">
                {transaction.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-dark-highlight text-text-main">
          {transaction.category}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 px-4">
        <p className="text-sm text-text-muted whitespace-nowrap">{formattedDate}</p>
      </td>

      {/* Amount */}
      <td className="py-4 px-4 text-right">
        <p
          className={`text-sm font-semibold ${
            isIncome ? 'text-accent-green' : 'text-text-main'
          }`}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </td>
    </tr>
  );
}

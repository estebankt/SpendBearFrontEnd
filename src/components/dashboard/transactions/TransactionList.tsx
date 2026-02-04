import { Transaction } from '@/lib/types';
import TransactionRow from './TransactionRow';

interface TransactionListProps {
  transactions: Transaction[];
  pageNumber?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  pageNumber = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="glass-panel rounded-lg p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-text-muted mb-4 block">
          receipt_long
        </span>
        <h3 className="text-lg font-semibold text-text-main mb-2">
          No transactions found
        </h3>
        <p className="text-sm text-text-muted mb-6">
          Try adjusting your filters or add a new transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-dark-highlight">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Transaction
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-border-muted px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Page {pageNumber} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange?.(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange?.(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

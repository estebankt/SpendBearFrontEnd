import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { MOCK_TRANSACTIONS } from '@/lib/constants';

export default function RecentTransactions() {
  return (
    <Card className="col-span-2 animate-enter delay-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Recent Transactions</h3>
          <p className="text-sm text-text-muted">Your latest activity</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All →
        </button>
      </div>

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
            {MOCK_TRANSACTIONS.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-white/5 hover:bg-surface-dark-highlight/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.iconColor}/10`}>
                      <span className={`material-symbols-outlined ${transaction.iconColor} text-[20px]`}>
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
                  <span className="text-sm text-text-muted">{transaction.date}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`text-sm font-bold ${
                      transaction.type === 'income' ? 'text-accent-green' : 'text-text-main'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

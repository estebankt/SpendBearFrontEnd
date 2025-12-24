import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { MOCK_ACCOUNTS } from '@/lib/constants';

export default function LinkedAccounts() {
  return (
    <Card className="animate-enter delay-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Linked Accounts</h3>
          <p className="text-sm text-text-muted">{MOCK_ACCOUNTS.length} accounts</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_ACCOUNTS.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-monokai-purple/10">
                <span className="material-symbols-outlined text-monokai-purple text-[20px]">
                  {account.icon}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">{account.name}</p>
                <p className="text-xs text-text-muted">****{account.lastFour}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${account.balance < 0 ? 'text-primary' : 'text-text-main'}`}>
              {formatCurrency(account.balance)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

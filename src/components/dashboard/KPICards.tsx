import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { MOCK_KPIS } from '@/lib/constants';

export default function KPICards() {
  const { netWorth, totalSpent, savings } = MOCK_KPIS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-enter">
      {/* Net Worth */}
      <Card hoverEffect>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10">
              <span className="material-symbols-outlined text-accent-green text-[24px]">
                account_balance_wallet
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Net Worth</p>
              <p className="text-2xl font-bold text-text-main">
                {formatCurrency(netWorth.value)}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-accent-green/10 text-accent-green text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {netWorth.trend}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">{netWorth.progressLabel}</span>
            <span className="text-text-main font-medium">{netWorth.progress}%</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${netWorth.progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Total Spent */}
      <Card hoverEffect className="delay-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="material-symbols-outlined text-primary text-[24px]">
                payments
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-text-main">
                {formatCurrency(totalSpent.value)}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {totalSpent.trend}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">{totalSpent.progressLabel}</span>
            <span className="text-text-main font-medium">{totalSpent.progress}%</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${totalSpent.progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Savings */}
      <Card hoverEffect className="delay-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow/10">
              <span className="material-symbols-outlined text-accent-yellow text-[24px]">
                savings
              </span>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">Honey Pot</p>
              <p className="text-2xl font-bold text-text-main">
                {savings.value}%
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-monokai-gray/10 text-text-muted text-xs font-bold">
            {savings.trend}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">{savings.progressLabel}</span>
            <span className="text-text-main font-medium">{savings.progress}%</span>
          </div>
          <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-yellow rounded-full transition-all"
              style={{ width: `${savings.progress}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

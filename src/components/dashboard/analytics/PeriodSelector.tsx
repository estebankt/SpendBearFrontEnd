'use client';

type Period = 'month' | 'quarter' | 'year';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  currentPeriodLabel: string;
}

export default function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  currentPeriodLabel,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Period Tabs */}
      <div className="flex gap-2 bg-surface-dark-highlight rounded-lg p-1">
        <button
          onClick={() => onPeriodChange('month')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPeriod === 'month'
              ? 'bg-primary text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onPeriodChange('quarter')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPeriod === 'quarter'
              ? 'bg-primary text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Quarter
        </button>
        <button
          onClick={() => onPeriodChange('year')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPeriod === 'year'
              ? 'bg-primary text-white'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Year
        </button>
      </div>

      {/* Period Navigation */}
      <div className="flex items-center gap-2 bg-surface-dark-highlight rounded-lg px-4 py-2">
        <button className="text-text-muted hover:text-text-main transition-colors">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="text-sm font-medium text-text-main min-w-[120px] text-center">
          {currentPeriodLabel}
        </span>
        <button className="text-text-muted hover:text-text-main transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

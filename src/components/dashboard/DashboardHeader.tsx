'use client';

import { getFirstName } from '@/lib/utils';
import NotificationDropdown from './NotificationDropdown';

interface DashboardHeaderProps {
  user: {
    name?: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const firstName = user.name ? getFirstName(user.name) : 'there';

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-text-main flex items-center gap-2">
          Hi, {firstName} <span className="text-2xl">👋</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Your financial hibernation plan is on track
        </p>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-dark-highlight text-text-main hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span className="text-sm font-medium">Oct 1 - Oct 31</span>
        </button>
      </div>
    </div>
  );
}

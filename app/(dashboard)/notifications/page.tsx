import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated on your budget alerts"
      />

      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You&apos;re all caught up! Budget alerts and notifications will appear here."
        size="lg"
      />
    </div>
  );
}

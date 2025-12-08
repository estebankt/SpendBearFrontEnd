import { auth0 } from '@/lib/auth0';
import { StatsCards } from '@/components/features/dashboard/stats-cards';
import { SpendingChart } from '@/components/features/dashboard/spending-chart';
import { BudgetOverview } from '@/components/features/dashboard/budget-overview';
import { RecentTransactions } from '@/components/features/dashboard/recent-transactions';

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  const firstName = user?.given_name || user?.name?.split(' ')[0] || 'there';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <SpendingChart />
          <BudgetOverview />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}

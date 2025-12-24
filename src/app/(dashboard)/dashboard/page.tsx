import { auth0 } from '@/lib/auth0';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KPICards from '@/components/dashboard/KPICards';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import LinkedAccounts from '@/components/dashboard/LinkedAccounts';
import TopBudgets from '@/components/dashboard/TopBudgets';
import FAB from '@/components/dashboard/FAB';

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <DashboardHeader user={session.user} />

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CashFlowChart />
        <LinkedAccounts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions />
        <TopBudgets />
      </div>

      <FAB />
    </>
  );
}

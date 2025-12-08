import { auth0 } from '@/lib/auth0';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, DollarSign, TrendingUp, Wallet } from 'lucide-react';

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

      {/* Stats Grid - Placeholder */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/dashboard/transactions"
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">View Transactions</h3>
                <p className="text-sm text-muted-foreground">See all your expenses</p>
              </div>
            </a>

            <a
              href="/dashboard/budgets"
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Manage Budgets</h3>
                <p className="text-sm text-muted-foreground">Track your spending</p>
              </div>
            </a>

            <a
              href="/dashboard/settings"
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Welcome to SpendBear! Here&apos;s how to get started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Add your first transaction using the + button</li>
              <li>Set up budgets to track your spending</li>
              <li>View your analytics and spending trends</li>
              <li>Customize categories to match your needs</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

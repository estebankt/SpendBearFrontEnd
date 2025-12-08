'use client';

import { useUser } from '@/lib/hooks/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            🐻 SpendBear
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.name || user.email}
            </span>
            <Button variant="outline" asChild>
              <Link href="/auth/logout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || 'there'}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder Cards */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Spending</h2>
            <p className="text-3xl font-bold text-primary">$0.00</p>
            <p className="text-sm text-muted-foreground mt-2">This month</p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Budget Status</h2>
            <p className="text-3xl font-bold text-success">On Track</p>
            <p className="text-sm text-muted-foreground mt-2">All budgets</p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">This month</p>
          </div>
        </div>

        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Start tracking your expenses!
          </p>
        </div>
      </main>
    </div>
  );
}

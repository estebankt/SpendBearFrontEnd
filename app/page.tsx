'use client';

import Link from 'next/link';
import { useUser } from '@/lib/hooks/use-user';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">🐻 SpendBear</div>
          <div>
            {isLoading ? (
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            ) : user ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Track Your Spending,
          <br />
          Master Your Budget
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          SpendBear helps you take control of your finances with simple expense tracking and
          smart budgeting.
        </p>

        <div className="flex gap-4">
          {user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/auth/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-muted/50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SpendBear?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Log transactions in under 2 seconds. No complicated forms, just quick entry.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Smart Budgets</h3>
              <p className="text-muted-foreground">
                Set budgets by category and get real-time alerts when you're approaching limits.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground">
                Designed for your phone. Track expenses on the go, wherever you are.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 SpendBear. Your friendly finance companion.</p>
        </div>
      </footer>
    </main>
  );
}

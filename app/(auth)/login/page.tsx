import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight, TrendingDown, PieChart, Target } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export default async function LoginPage() {
  // If already logged in, redirect to dashboard
  const session = await auth0.getSession();
  if (session?.user) {
    redirect('/');
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding & Features */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">SpendBear</h1>
          </div>

          <p className="text-xl text-muted-foreground">
            Your personal finance companion. Track spending, set budgets, achieve goals.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Track Every Expense</h3>
                <p className="text-sm text-muted-foreground">
                  Quick entry, smart categorization, complete overview
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Set Smart Budgets</h3>
                <p className="text-sm text-muted-foreground">
                  Category limits, alerts, real-time tracking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Visualize Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Charts, trends, insights into your spending habits
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>Sign in to manage your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/api/auth/login" className="block">
              <Button className="w-full" size="lg">
                Sign In with Auth0
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Auth0
            </p>
            <div className="pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

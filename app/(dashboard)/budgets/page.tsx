import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">Set spending limits and track progress</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Budgets</CardTitle>
          <CardDescription>Manage your monthly spending limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No budgets yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first budget to start tracking spending limits
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

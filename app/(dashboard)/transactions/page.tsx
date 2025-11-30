'use client';

import { QuickAddForm } from '@/components/features/transactions/QuickAddForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Manage your income and expenses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Add Form */}
        <QuickAddForm />

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No transactions yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first transaction using the form
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

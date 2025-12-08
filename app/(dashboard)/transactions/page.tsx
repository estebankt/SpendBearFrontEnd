'use client';

import * as React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { QuickAddButton } from '@/components/features/transactions/quick-add-button';
import { TransactionList } from '@/components/features/transactions/transaction-list';
import { TransactionFiltersComponent } from '@/components/features/transactions/transaction-filters';
import type { TransactionFilters } from '@/components/features/transactions/transaction-filters';
import { Card } from '@/components/ui/card';

export default function TransactionsPage() {
  const [filters, setFilters] = React.useState<TransactionFilters>({});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage all your transactions"
        actions={<QuickAddButton variant="button" />}
      />

      {/* Filters */}
      <Card className="p-4">
        <TransactionFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </Card>

      {/* Transaction List */}
      <TransactionList filters={filters} />
    </div>
  );
}

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Receipt } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage all your transactions"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        }
      />

      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Start tracking your expenses by adding your first transaction. Click the + button to get started."
        action={{
          label: 'Add Transaction',
          onClick: () => {
            // Will be implemented in Milestone 5
            alert('Transaction form will be implemented in Milestone 5');
          },
        }}
      />
    </div>
  );
}

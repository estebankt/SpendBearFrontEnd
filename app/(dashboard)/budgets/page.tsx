import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Wallet } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set and track your spending limits"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        }
      />

      <EmptyState
        icon={Wallet}
        title="No budgets yet"
        description="Create your first budget to track spending in specific categories or overall spending."
        action={{
          label: 'Create Budget',
          onClick: () => {
            // Will be implemented in Milestone 6
            alert('Budget form will be implemented in Milestone 6');
          },
        }}
      />
    </div>
  );
}

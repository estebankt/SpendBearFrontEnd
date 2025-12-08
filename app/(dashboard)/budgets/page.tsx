'use client';

import * as React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { BudgetList } from '@/components/features/budgets/budget-list';
import { BudgetFormModal } from '@/components/features/budgets/budget-form-modal';
import { Plus } from 'lucide-react';

export default function BudgetsPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set and track your spending limits"
        actions={
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        }
      />

      {/* Budget List */}
      <BudgetList filters={{ activeOnly: true }} />

      {/* Create Budget Modal */}
      <BudgetFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

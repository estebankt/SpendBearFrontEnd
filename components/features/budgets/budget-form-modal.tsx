'use client';

import { Modal } from '@/components/ui/modal';
import { BudgetForm } from './budget-form';
import type { Budget } from '@/types/api';

export interface BudgetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
}

/**
 * Budget Form Modal
 *
 * Wrapper for the budget form in a modal dialog
 * Supports both create and edit modes
 */
export function BudgetFormModal({
  open,
  onOpenChange,
  budget,
}: BudgetFormModalProps) {
  const isEditing = !!budget;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Budget' : 'Create Budget'}
      description={
        isEditing
          ? 'Update the budget details below'
          : 'Set up a new budget to track your spending'
      }
      size="md"
    >
      <div className="p-6 pt-0">
        <BudgetForm
          budget={budget}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Modal>
  );
}

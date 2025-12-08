'use client';

import { Modal } from '@/components/ui/modal';
import { TransactionForm } from './transaction-form';
import type { Transaction } from '@/types/api';

export interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

/**
 * Transaction Form Modal
 *
 * Wrapper for the transaction form in a modal dialog
 * Supports both create and edit modes
 */
export function TransactionFormModal({
  open,
  onOpenChange,
  transaction,
}: TransactionFormModalProps) {
  const isEditing = !!transaction;

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
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      description={
        isEditing
          ? 'Update the transaction details below'
          : 'Create a new transaction to track your spending'
      }
      size="md"
    >
      <div className="p-6 pt-0">
        <TransactionForm
          transaction={transaction}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Modal>
  );
}

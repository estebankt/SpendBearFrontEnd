'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export interface QuickAddButtonProps {
  variant?: 'fab' | 'button';
  className?: string;
}

/**
 * Quick Add Button Component
 *
 * Features:
 * - FAB style for mobile (fixed position)
 * - Button style for desktop header
 * - Opens transaction form modal
 */
export function QuickAddButton({ variant = 'button', className }: QuickAddButtonProps) {
  const [open, setOpen] = React.useState(false);

  if (variant === 'fab') {
    return (
      <>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Add Transaction"
          description="Create a new transaction"
        >
          <div className="p-4">
            <p className="text-muted-foreground">
              Transaction form will be implemented in Milestone 5
            </p>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Plus className="h-4 w-4 mr-2" />
        <span>Add Transaction</span>
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add Transaction"
        description="Create a new transaction"
      >
        <div className="p-4">
          <p className="text-muted-foreground">
            Transaction form will be implemented in Milestone 5
          </p>
        </div>
      </Modal>
    </>
  );
}

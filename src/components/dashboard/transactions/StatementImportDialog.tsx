'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCategories } from '@/lib/hooks/use-categories';
import {
  useUploadStatement,
  useStatementImportPolling,
  useUpdateCategories,
  useConfirmImport,
  useCancelImport,
} from '@/lib/hooks/use-statement-import';
import type { ApiParsedTransaction, ApiStatementUpload } from '@/lib/api/types';

interface StatementImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'upload' | 'processing' | 'review' | 'complete';

export default function StatementImportDialog({
  open,
  onOpenChange,
}: StatementImportDialogProps) {
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [directUploadData, setDirectUploadData] = useState<ApiStatementUpload | null>(null);
  const [categoryEdits, setCategoryEdits] = useState<Record<string, string>>({});
  const [manualStep, setManualStep] = useState<Step | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const { data: categories = [] } = useCategories();

  // Reset state and close dialog
  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset state after a brief delay to allow animation
    setTimeout(() => {
      setManualStep(null);
      setUploadId(null);
      setDirectUploadData(null);
      setCategoryEdits({});
      setImportedCount(0);
    }, 150);
  }, [onOpenChange]);

  const uploadMutation = useUploadStatement();

  // Only use polling if we need to wait for processing (status is Uploading or Parsing)
  const needsPolling = directUploadData?.status === 'Uploading' || directUploadData?.status === 'Parsing';
  const { data: polledData } = useStatementImportPolling(needsPolling ? uploadId : null);

  // Use direct upload data first, fall back to polled data
  const uploadData = polledData || directUploadData;

  const updateCategoriesMutation = useUpdateCategories();
  const confirmMutation = useConfirmImport();
  const cancelMutation = useCancelImport();

  // Derive step from state - no useEffect needed
  const step: Step = (() => {
    if (manualStep) return manualStep;
    if (!uploadId && !uploadMutation.isPending) return 'upload';
    if (uploadMutation.isPending) return 'processing';
    if (!uploadData) return 'processing';
    if (uploadData.status === 'Uploading' || uploadData.status === 'Parsing') {
      return 'processing';
    }
    if (uploadData.status === 'Confirmed') return 'complete';
    if (uploadData.status === 'PendingReview' || uploadData.status === 'Failed') {
      return 'review';
    }
    return 'upload';
  })();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      uploadMutation.mutate(file, {
        onSuccess: (data) => {
          console.log('[DIALOG] Upload success, data:', data.status);
          setUploadId(data.id);
          setDirectUploadData(data);
        },
      });
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  });

  const handleCategoryChange = (transactionId: string, categoryId: string) => {
    setCategoryEdits((prev) => ({
      ...prev,
      [transactionId]: categoryId,
    }));
  };

  const getCategoryForTransaction = (transaction: ApiParsedTransaction) => {
    return (
      categoryEdits[transaction.id] ||
      transaction.confirmedCategoryId ||
      transaction.suggestedCategoryId
    );
  };

  const handleConfirm = async () => {
    if (!uploadId || !uploadData) return;

    // Build category updates from edits
    const updates = Object.entries(categoryEdits).map(
      ([parsedTransactionId, newCategoryId]) => ({
        parsedTransactionId,
        newCategoryId,
      })
    );

    // Update categories if there are changes
    if (updates.length > 0) {
      await updateCategoriesMutation.mutateAsync({ id: uploadId, input: { updates } });
    }

    // Confirm the import
    confirmMutation.mutate(uploadId, {
      onSuccess: () => {
        setImportedCount(uploadData.parsedTransactions.length);
        setManualStep('complete');
      },
    });
  };

  const handleCancel = () => {
    if (uploadId) {
      cancelMutation.mutate(uploadId);
    }
    handleClose();
  };

  const isPending =
    uploadMutation.isPending ||
    updateCategoriesMutation.isPending ||
    confirmMutation.isPending ||
    cancelMutation.isPending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isPending && handleClose()}
      />

      {/* Dialog */}
      <div className="relative glass-panel rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-main">
            {step === 'upload' && 'Import Bank Statement'}
            {step === 'processing' && 'Processing Statement'}
            {step === 'review' && 'Review Transactions'}
            {step === 'complete' && 'Import Complete'}
          </h2>
          <button
            onClick={() => !isPending && handleClose()}
            className="p-1 hover:bg-surface-dark-highlight rounded transition-colors"
            disabled={isPending}
          >
            <span className="material-symbols-outlined text-text-muted">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Upload Step */}
          {step === 'upload' && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-surface-dark-highlight hover:border-primary/50'
              } ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <span className="material-symbols-outlined text-5xl text-text-muted mb-4 block">
                upload_file
              </span>
              {uploadMutation.isPending ? (
                <p className="text-text-muted">Uploading...</p>
              ) : isDragActive ? (
                <p className="text-primary">Drop your PDF here</p>
              ) : (
                <>
                  <p className="text-text-main mb-2">
                    Drag & drop your bank statement PDF here
                  </p>
                  <p className="text-sm text-text-muted">
                    or click to select a file
                  </p>
                </>
              )}
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-text-main text-lg mb-2">Analyzing your statement...</p>
              <p className="text-sm text-text-muted">
                Our AI is extracting and categorizing your transactions
              </p>
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && uploadData && (
            <>
              {uploadData.status === 'Failed' ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
                    error
                  </span>
                  <p className="text-text-main mb-2">Failed to process statement</p>
                  <p className="text-sm text-text-muted">
                    {uploadData.errorMessage || 'An unknown error occurred'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-text-muted">
                      Found {uploadData.parsedTransactions.length} transactions in{' '}
                      <span className="text-text-main">{uploadData.originalFileName}</span>
                    </p>
                    {uploadData.statementMonth && uploadData.statementYear && (
                      <p className="text-xs text-text-muted mt-1">
                        Statement period: {uploadData.statementMonth}/{uploadData.statementYear}
                      </p>
                    )}
                  </div>

                  {/* Transactions Table */}
                  <div className="border border-surface-dark-highlight rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-surface-dark-highlight">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                            Category
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-dark-highlight">
                        {uploadData.parsedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-surface-dark/30">
                            <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-main max-w-[200px] truncate">
                              {transaction.description}
                            </td>
                            <td
                              className={`px-4 py-3 text-sm text-right whitespace-nowrap ${
                                transaction.amount < 0 ? 'text-primary' : 'text-accent-green'
                              }`}
                            >
                              {transaction.amount < 0 ? '-' : '+'}$
                              {Math.abs(transaction.amount).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={getCategoryForTransaction(transaction)}
                                onChange={(e) =>
                                  handleCategoryChange(transaction.id, e.target.value)
                                }
                                className="w-full bg-surface-dark-highlight rounded px-2 py-1 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-accent-green mb-4 block">
                check_circle
              </span>
              <p className="text-text-main text-lg mb-2">
                Successfully imported {importedCount} transactions
              </p>
              <p className="text-sm text-text-muted">
                Your transactions have been added and categorized
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-surface-dark-highlight">
          {step === 'upload' && (
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 'processing' && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex-1 px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors disabled:opacity-50"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
            </button>
          )}

          {step === 'review' && uploadData?.status !== 'Failed' && (
            <>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {confirmMutation.isPending
                  ? 'Importing...'
                  : `Import ${uploadData?.parsedTransactions.length || 0} Transactions`}
              </button>
            </>
          )}

          {(step === 'complete' || uploadData?.status === 'Failed') && (
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

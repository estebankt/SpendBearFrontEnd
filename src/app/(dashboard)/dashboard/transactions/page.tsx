'use client';

import { useState, useMemo } from 'react';
import { TransactionType } from '@/lib/types';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useCategories } from '@/lib/hooks/use-categories';
import { mapTransaction } from '@/lib/api/mappers';
import TransactionSummaryCards from '@/components/dashboard/transactions/TransactionSummaryCards';
import TransactionFilters from '@/components/dashboard/transactions/TransactionFilters';
import TransactionList from '@/components/dashboard/transactions/TransactionList';
import TransactionFormDialog from '@/components/dashboard/transactions/TransactionFormDialog';
import StatementImportDialog from '@/components/dashboard/transactions/StatementImportDialog';
import type { ApiTransaction } from '@/lib/api/types';

export default function TransactionsPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [pageNumber, setPageNumber] = useState(1);

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ApiTransaction | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  // Build API params (server-side filtering for category and type)
  const apiParams = useMemo(() => ({
    pageNumber,
    pageSize: 50,
    ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
    ...(selectedType !== 'all' && { type: selectedType }),
  }), [pageNumber, selectedCategory, selectedType]);

  const { data: transactionsData, isLoading, isError } = useTransactions(apiParams);
  const { data: categories = [] } = useCategories();

  // Map API transactions to display type
  const mappedTransactions = useMemo(() => {
    if (!transactionsData?.items) return [];
    return transactionsData.items.map((t) => mapTransaction(t, categories));
  }, [transactionsData, categories]);

  // Client-side search filter (backend doesn't support text search)
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return mappedTransactions;
    return mappedTransactions.filter((transaction) =>
      transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mappedTransactions, searchQuery]);

  // Calculate summary totals from filtered transactions
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }, [filteredTransactions]);

  const totalPages = transactionsData?.totalPages ?? 1;

  return (
    <div className="max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Transactions</h1>
          <p className="text-text-muted">
            Track and manage all your income and expenses
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setImportOpen(true)}
            className="px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">upload</span>
            Import
          </button>
          <button
            onClick={() => { setEditingTransaction(null); setFormOpen(true); }}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Add New
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <TransactionSummaryCards
        totalIncome={summary.totalIncome}
        totalExpenses={summary.totalExpenses}
        netBalance={summary.netBalance}
      />

      {/* Filters */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => { setSelectedCategory(cat); setPageNumber(1); }}
        selectedType={selectedType}
        onTypeChange={(type) => { setSelectedType(type); setPageNumber(1); }}
      />

      {/* Loading/Error States */}
      {isLoading && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading transactions...</p>
        </div>
      )}

      {isError && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 block">error</span>
          <p className="text-sm text-text-muted">Failed to load transactions</p>
        </div>
      )}

      {/* Transactions List */}
      {!isLoading && !isError && (
        <TransactionList
          transactions={filteredTransactions}
          pageNumber={pageNumber}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          onEdit={(t) => {
            // Find the raw API transaction to edit
            const raw = transactionsData?.items.find((item) => item.id === t.id);
            if (raw) {
              setEditingTransaction(raw);
              setFormOpen(true);
            }
          }}
        />
      )}

      {/* Transaction Form Dialog */}
      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTransaction}
      />

      {/* Statement Import Dialog */}
      <StatementImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
}

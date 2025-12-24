'use client';

import { useState, useMemo } from 'react';
import { TransactionType } from '@/lib/types';
import { TRANSACTIONS_DATA } from '@/lib/constants';
import TransactionSummaryCards from '@/components/dashboard/transactions/TransactionSummaryCards';
import TransactionFilters from '@/components/dashboard/transactions/TransactionFilters';
import TransactionList from '@/components/dashboard/transactions/TransactionList';

export default function TransactionsPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS_DATA.filter((transaction) => {
      // Search filter (merchant or description)
      const matchesSearch =
        searchQuery === '' ||
        transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || transaction.categoryId === selectedCategory;

      // Type filter
      const matchesType =
        selectedType === 'all' || transaction.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedType]);

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
          <button className="px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">upload</span>
            Import
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
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
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Transactions List */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}

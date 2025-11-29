import { create } from 'zustand';
import type { AppState, DateRange, ViewType } from '@/types/app.types';

// Get current month date range
const getCurrentMonthRange = (): DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

export const useAppStore = create<AppState>(set => ({
  // Initial state
  isMobileNavOpen: false,
  activeView: 'dashboard',
  selectedCategory: null,
  dateRange: getCurrentMonthRange(),

  // Actions
  toggleMobileNav: () => set(state => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  setActiveView: (view: ViewType) => set({ activeView: view }),

  setSelectedCategory: (categoryId: string | null) => set({ selectedCategory: categoryId }),

  setDateRange: (range: DateRange) => set({ dateRange: range }),
}));

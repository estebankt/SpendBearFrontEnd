# SpendBear Frontend - Task Breakdown

## Overview

This document contains granular tasks organized into milestones for building SpendBear Frontend from scratch. Each task is designed to be completable in a single focused session.

**Legend:**
- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- ⏸️ Blocked

---

## Milestone 0: Project Initialization
**Goal:** Set up the development environment and project scaffolding  
**Duration:** 1 day

### 0.1 Project Setup
- ⬜ Create Next.js 15 project with TypeScript (`npx create-next-app@latest spendbear-frontend --typescript --tailwind --app --src-dir=false`)
- ⬜ Configure strict TypeScript settings in `tsconfig.json`
- ⬜ Set up path aliases (`@/` for root imports)
- ⬜ Create initial folder structure per CLAUDE.md
- ⬜ Initialize git repository with `.gitignore`

### 0.2 Tailwind & Styling Setup
- ⬜ Configure Tailwind CSS v4
- ⬜ Set up CSS custom properties (colors, spacing)
- ⬜ Create `globals.css` with base styles
- ⬜ Add Inter font via next/font
- ⬜ Configure dark mode support (class-based, for future)

### 0.3 Shadcn/ui Installation
- ⬜ Initialize Shadcn/ui (`npx shadcn@latest init`)
- ⬜ Install core components: Button, Card, Input, Label
- ⬜ Install form components: Form, FormField, FormItem, FormMessage
- ⬜ Install feedback components: Dialog, Sonner (toast)
- ⬜ Install data components: Select, Progress, Skeleton
- ⬜ Create `cn()` utility function

### 0.4 Development Tooling
- ⬜ Configure ESLint with Next.js rules
- ⬜ Set up Prettier with Tailwind plugin
- ⬜ Create `.prettierrc` and `.eslintrc.json`
- ⬜ Add lint-staged and husky for pre-commit hooks
- ⬜ Create `npm run format` and `npm run lint:fix` scripts

### 0.5 Environment & Documentation
- ⬜ Create `.env.local.example` with all required variables
- ⬜ Add environment variable validation (zod or custom)
- ⬜ Copy documentation files (PRD.md, CLAUDE.md, PLANNING.md, TASKS.md)
- ⬜ Create README.md with setup instructions
- ⬜ Verify `npm run dev` starts without errors

---

## Milestone 1: Authentication
**Goal:** Implement complete Auth0 authentication flow  
**Duration:** 2 days

### 1.1 Auth0 SDK Setup
- ⬜ Install `@auth0/nextjs-auth0`
- ⬜ Create `app/api/auth/[...auth0]/route.ts` handler
- ⬜ Configure Auth0 environment variables
- ⬜ Set up `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, etc.
- ⬜ Verify Auth0 tenant configuration matches frontend URLs

### 1.2 Auth Provider & Context
- ⬜ Create `lib/providers/auth-provider.tsx` with UserProvider
- ⬜ Wrap app in UserProvider in root layout
- ⬜ Create `lib/hooks/use-user.ts` custom hook
- ⬜ Add user state typing (Auth0User interface)

### 1.3 Landing Page
- ⬜ Create `app/page.tsx` (landing page)
- ⬜ Design hero section with value proposition
- ⬜ Add "Get Started" button linking to `/api/auth/login`
- ⬜ Add simple feature highlights (3 points max)
- ⬜ Make landing page fully responsive
- ⬜ Add SpendBear logo/branding

### 1.4 Auth Callback Handling
- ⬜ Create `app/(auth)/callback/page.tsx`
- ⬜ Handle Auth0 callback redirect
- ⬜ Check if user exists in backend (`GET /api/identity/me`)
- ⬜ Register new user if 404 (`POST /api/identity/register`)
- ⬜ Redirect to dashboard after successful auth
- ⬜ Show loading state during auth processing

### 1.5 Protected Route Middleware
- ⬜ Create `middleware.ts` for route protection
- ⬜ Configure protected routes pattern (`/dashboard/*`)
- ⬜ Redirect unauthenticated users to login
- ⬜ Allow public routes (landing, login, callback)

### 1.6 Auth UI Components
- ⬜ Create `components/shared/user-menu.tsx` (dropdown)
- ⬜ Add user avatar/initials display
- ⬜ Add logout button (`/api/auth/logout`)
- ⬜ Create login button component for reuse
- ⬜ Add loading skeleton for auth state

### 1.7 Auth Testing
- ⬜ Test full login flow (landing → Auth0 → callback → dashboard)
- ⬜ Test new user registration flow
- ⬜ Test returning user login flow
- ⬜ Test logout flow
- ⬜ Test protected route redirect
- ⬜ Test token refresh (if applicable)

---

## Milestone 2: API Client & Core Hooks
**Goal:** Set up API communication layer and data fetching hooks  
**Duration:** 2 days

### 2.1 Axios Client Setup
- ⬜ Install `axios`
- ⬜ Create `lib/api/client.ts` with base configuration
- ⬜ Set baseURL from environment variable
- ⬜ Configure request timeout (10s)
- ⬜ Add request interceptor for Auth0 token injection

### 2.2 Auth Token Integration
- ⬜ Create `lib/api/get-token.ts` for server-side token retrieval
- ⬜ Create client-side token fetching (if needed)
- ⬜ Add Authorization header to all requests
- ⬜ Handle 401 responses (redirect to login)
- ⬜ Add response error interceptor

### 2.3 API Type Definitions
- ⬜ Create `types/api.ts` with all API response types
- ⬜ Define Transaction type
- ⬜ Define Budget type
- ⬜ Define Category type
- ⬜ Define MonthlySummary type
- ⬜ Define Notification type
- ⬜ Define paginated response wrapper type
- ⬜ Define API error response type

### 2.4 API Endpoint Functions
- ⬜ Create `lib/api/endpoints.ts`
- ⬜ Implement `transactionApi` (list, create, update, delete)
- ⬜ Implement `budgetApi` (list, create, update, delete)
- ⬜ Implement `categoryApi` (list, create)
- ⬜ Implement `analyticsApi` (monthlySummary)
- ⬜ Implement `notificationApi` (list, markRead)
- ⬜ Implement `identityApi` (me, register)

### 2.5 TanStack Query Setup
- ⬜ Install `@tanstack/react-query`
- ⬜ Create `lib/providers/query-provider.tsx`
- ⬜ Configure QueryClient with default options
- ⬜ Set default stale times and cache times
- ⬜ Add QueryClientProvider to root layout
- ⬜ Install React Query DevTools (dev only)

### 2.6 Data Fetching Hooks
- ⬜ Create `lib/hooks/use-transactions.ts`
  - ⬜ `useTransactions(filters)` - list query
  - ⬜ `useCreateTransaction()` - mutation
  - ⬜ `useUpdateTransaction()` - mutation
  - ⬜ `useDeleteTransaction()` - mutation
- ⬜ Create `lib/hooks/use-budgets.ts`
  - ⬜ `useBudgets(filters)` - list query
  - ⬜ `useActiveBudgets()` - active only query
  - ⬜ `useCreateBudget()` - mutation
  - ⬜ `useUpdateBudget()` - mutation
  - ⬜ `useDeleteBudget()` - mutation
- ⬜ Create `lib/hooks/use-categories.ts`
  - ⬜ `useCategories()` - list query
  - ⬜ `useCreateCategory()` - mutation
- ⬜ Create `lib/hooks/use-analytics.ts`
  - ⬜ `useMonthlySummary(year, month)` - query
- ⬜ Create `lib/hooks/use-notifications.ts`
  - ⬜ `useNotifications(filters)` - list query
  - ⬜ `useUnreadCount()` - query
  - ⬜ `useMarkNotificationRead()` - mutation

### 2.7 Cache Invalidation Logic
- ⬜ Configure transaction mutations to invalidate analytics
- ⬜ Configure transaction mutations to invalidate budgets
- ⬜ Configure budget mutations to invalidate budget list
- ⬜ Add optimistic updates for transaction creation
- ⬜ Add rollback on mutation errors

---

## Milestone 3: Core UI Components
**Goal:** Build reusable UI components for the application  
**Duration:** 3 days

### 3.1 Form Inputs
- ⬜ Create `components/ui/currency-input.tsx`
  - ⬜ Auto-format as user types (1234 → $1,234.00)
  - ⬜ Handle decimal input correctly
  - ⬜ Trigger number pad on mobile
  - ⬜ Support currency prop for symbol
  - ⬜ Error state styling
- ⬜ Create `components/ui/date-picker.tsx`
  - ⬜ Calendar popup using Shadcn Calendar
  - ⬜ Quick presets (Today, Yesterday)
  - ⬜ Mobile-friendly display
  - ⬜ Max date validation (no future dates)

### 3.2 Category Components
- ⬜ Create `components/features/categories/category-select.tsx`
  - ⬜ Dropdown with category list
  - ⬜ Search/filter functionality
  - ⬜ Show system vs user categories differently
  - ⬜ Recent categories at top
  - ⬜ Loading state
- ⬜ Create `components/features/categories/category-badge.tsx`
  - ⬜ Display category name with icon/color
  - ⬜ Compact variant for lists

### 3.3 Feedback Components
- ⬜ Create `components/ui/loading-spinner.tsx`
  - ⬜ Size variants (sm, md, lg)
  - ⬜ Full-screen overlay variant
  - ⬜ Label support
- ⬜ Create `components/ui/empty-state.tsx`
  - ⬜ Icon, title, description props
  - ⬜ Action button support
  - ⬜ Various sizes
- ⬜ Configure Sonner toast provider
- ⬜ Create toast helper functions (`showToast.success()`, etc.)

### 3.4 Data Display Components
- ⬜ Create `components/ui/stat-card.tsx`
  - ⬜ Label, value, change indicator
  - ⬜ Icon support
  - ⬜ Loading skeleton variant
- ⬜ Create `components/ui/progress-bar.tsx`
  - ⬜ Percentage display
  - ⬜ Color variants (success, warning, danger)
  - ⬜ Animation on mount
  - ⬜ Label support

### 3.5 Layout Components
- ⬜ Create `components/shared/header.tsx`
  - ⬜ Logo/brand link
  - ⬜ Navigation links (desktop)
  - ⬜ User menu
  - ⬜ Notification bell (with count)
  - ⬜ Quick add button
- ⬜ Create `components/shared/sidebar.tsx` (desktop)
  - ⬜ Navigation links with icons
  - ⬜ Active state highlighting
  - ⬜ Collapsible option
- ⬜ Create `components/shared/mobile-nav.tsx`
  - ⬜ Fixed bottom tab bar
  - ⬜ Icons with labels
  - ⬜ Active state
  - ⬜ Center FAB for quick add

### 3.6 Modal Components
- ⬜ Create `components/ui/modal.tsx` wrapper
  - ⬜ Consistent styling using Shadcn Dialog
  - ⬜ Size variants (sm, md, lg, full)
  - ⬜ Mobile full-screen variant
- ⬜ Create `components/ui/confirm-dialog.tsx`
  - ⬜ Title, description, actions
  - ⬜ Danger variant for destructive actions
  - ⬜ Loading state for confirm button

### 3.7 Utility Components
- ⬜ Create `components/ui/page-header.tsx`
  - ⬜ Title, description, actions slot
  - ⬜ Back button option
- ⬜ Create skeleton variants for all major components
  - ⬜ TransactionItemSkeleton
  - ⬜ BudgetCardSkeleton
  - ⬜ StatCardSkeleton
  - ⬜ ChartSkeleton

---

## Milestone 4: Dashboard Layout & Shell
**Goal:** Create the main dashboard structure and navigation  
**Duration:** 1 day

### 4.1 Dashboard Layout
- ⬜ Create `app/(dashboard)/layout.tsx`
- ⬜ Add session check (redirect if not authenticated)
- ⬜ Implement responsive layout structure
- ⬜ Desktop: sidebar + main content
- ⬜ Mobile: header + content + bottom nav
- ⬜ Add padding and max-width constraints

### 4.2 Navigation Implementation
- ⬜ Wire up Header component with user data
- ⬜ Wire up Sidebar with route links
- ⬜ Wire up MobileNav with route links
- ⬜ Implement active route highlighting
- ⬜ Add navigation links: Dashboard, Transactions, Budgets, Settings

### 4.3 Quick Add Button Integration
- ⬜ Create `components/features/transactions/quick-add-button.tsx`
- ⬜ FAB style for mobile (fixed position)
- ⬜ Header button for desktop
- ⬜ Open transaction form modal on click

### 4.4 Global Providers
- ⬜ Verify all providers in root layout (Query, Auth, Toast)
- ⬜ Add error boundary at layout level
- ⬜ Add loading state for initial auth check

---

## Milestone 5: Transaction Features
**Goal:** Implement complete transaction management  
**Duration:** 3 days

### 5.1 Transaction Form
- ⬜ Create `components/features/transactions/transaction-form.tsx`
- ⬜ Integrate React Hook Form
- ⬜ Add Zod validation schema
- ⬜ Amount field (CurrencyInput)
- ⬜ Category field (CategorySelect)
- ⬜ Date field (DatePicker)
- ⬜ Type toggle (Income/Expense)
- ⬜ Description field (text input)
- ⬜ Submit button with loading state
- ⬜ Cancel button

### 5.2 Transaction Form Modal
- ⬜ Create transaction form dialog wrapper
- ⬜ "Add Transaction" mode (create)
- ⬜ "Edit Transaction" mode (update)
- ⬜ Pre-populate form when editing
- ⬜ Close on successful submit
- ⬜ Show success toast

### 5.3 Transaction List Item
- ⬜ Create `components/features/transactions/transaction-item.tsx`
- ⬜ Display: category icon, description, amount, date
- ⬜ Format amount with currency
- ⬜ Show relative time (2 hours ago)
- ⬜ Different styling for income vs expense
- ⬜ Click to open edit modal
- ⬜ Swipe to delete (mobile) - or delete button

### 5.4 Transaction List
- ⬜ Create `components/features/transactions/transaction-list.tsx`
- ⬜ Fetch transactions using hook
- ⬜ Group by date (Today, Yesterday, This Week, etc.)
- ⬜ Infinite scroll or pagination
- ⬜ Loading skeleton during fetch
- ⬜ Empty state when no transactions

### 5.5 Transaction Filters
- ⬜ Create filter bar component
- ⬜ Date range filter (start date, end date)
- ⬜ Category filter (select)
- ⬜ Type filter (Income/Expense/All)
- ⬜ Clear filters button
- ⬜ Persist filters in URL params

### 5.6 Transactions Page
- ⬜ Create `app/(dashboard)/transactions/page.tsx`
- ⬜ Page header with title and "Add" button
- ⬜ Filter bar
- ⬜ Transaction list
- ⬜ Mobile-responsive layout

### 5.7 Delete Transaction Flow
- ⬜ Add delete confirmation dialog
- ⬜ Implement delete mutation
- ⬜ Show success/error toast
- ⬜ Remove from list optimistically

---

## Milestone 6: Budget Features
**Goal:** Implement budget creation, viewing, and monitoring  
**Duration:** 2 days

### 6.1 Budget Form
- ⬜ Create `components/features/budgets/budget-form.tsx`
- ⬜ Name field (text input)
- ⬜ Amount field (CurrencyInput)
- ⬜ Period select (Monthly, Weekly, Custom)
- ⬜ Start date field
- ⬜ Category field (optional, for category-specific budgets)
- ⬜ Warning threshold slider (50-100%)
- ⬜ Zod validation schema

### 6.2 Budget Card
- ⬜ Create `components/features/budgets/budget-card.tsx`
- ⬜ Display: name, spent/limit, progress bar
- ⬜ Percentage indicator
- ⬜ Color coding: green (<50%), yellow (50-80%), red (>80%)
- ⬜ Days remaining in period
- ⬜ Click to edit
- ⬜ Delete button with confirmation

### 6.3 Budget List
- ⬜ Create `components/features/budgets/budget-list.tsx`
- ⬜ Fetch budgets using hook
- ⬜ Grid layout (responsive)
- ⬜ Loading skeletons
- ⬜ Empty state with "Create Budget" CTA

### 6.4 Budgets Page
- ⬜ Create `app/(dashboard)/budgets/page.tsx`
- ⬜ Page header with "New Budget" button
- ⬜ Active budgets section
- ⬜ Expired/inactive budgets section (collapsed)
- ⬜ Create budget modal

### 6.5 Budget CRUD Operations
- ⬜ Create budget flow (form → mutation → success)
- ⬜ Edit budget flow (load data → form → mutation)
- ⬜ Delete budget flow (confirm → mutation → remove)
- ⬜ Optimistic updates where appropriate

---

## Milestone 7: Dashboard Home
**Goal:** Build the main dashboard with summary and quick access  
**Duration:** 2 days

### 7.1 Stats Cards
- ⬜ Create `components/features/dashboard/stats-cards.tsx`
- ⬜ Fetch monthly summary using hook
- ⬜ Display: Total Spending, Total Income, Net Balance
- ⬜ Comparison to previous month (percentage)
- ⬜ Loading skeletons

### 7.2 Spending Chart
- ⬜ Create `components/features/dashboard/spending-chart.tsx`
- ⬜ Install and configure Chart.js
- ⬜ Pie/Donut chart for spending by category
- ⬜ Legend with category names and amounts
- ⬜ Responsive sizing
- ⬜ Loading state

### 7.3 Budget Overview Widget
- ⬜ Create `components/features/dashboard/budget-overview.tsx`
- ⬜ Fetch active budgets (limit 3)
- ⬜ Compact budget cards with progress
- ⬜ "View All" link to budgets page
- ⬜ Loading skeleton

### 7.4 Recent Transactions Widget
- ⬜ Create `components/features/dashboard/recent-transactions.tsx`
- ⬜ Fetch recent 5 transactions
- ⬜ Compact transaction items
- ⬜ "View All" link to transactions page
- ⬜ Loading skeleton

### 7.5 Dashboard Page Assembly
- ⬜ Create `app/(dashboard)/page.tsx`
- ⬜ Responsive grid layout
- ⬜ Desktop: 3-column layout
- ⬜ Mobile: single column stack
- ⬜ Wire up all widgets
- ⬜ Quick add FAB visible

### 7.6 Dashboard Polish
- ⬜ Add greeting with user name
- ⬜ Add current date display
- ⬜ Smooth loading transitions
- ⬜ Error states for each widget
- ⬜ Pull-to-refresh on mobile (if possible)

---

## Milestone 8: Notifications
**Goal:** Display budget alerts and notifications  
**Duration:** 1 day

### 8.1 Notification Bell
- ⬜ Create notification bell icon in header
- ⬜ Display unread count badge
- ⬜ Click to open notifications dropdown/panel

### 8.2 Notification List
- ⬜ Create `components/features/notifications/notification-list.tsx`
- ⬜ Fetch notifications using hook
- ⬜ Display notification type, message, time
- ⬜ Mark as read on click
- ⬜ Link to related budget

### 8.3 Notification Item
- ⬜ Create notification item component
- ⬜ Different styling for read vs unread
- ⬜ Icon based on notification type
- ⬜ Relative timestamp

---

## Milestone 9: Settings & Profile
**Goal:** User settings and profile management  
**Duration:** 1 day

### 9.1 Settings Page
- ⬜ Create `app/(dashboard)/settings/page.tsx`
- ⬜ Display user profile info (name, email)
- ⬜ Logout button

### 9.2 Profile Display
- ⬜ Show user avatar (from Auth0 or initials)
- ⬜ Show email address
- ⬜ Member since date (if available)

### 9.3 Category Management
- ⬜ Add "Manage Categories" section to settings
- ⬜ List custom categories
- ⬜ "Add Category" button
- ⬜ Create category form modal

---

## Milestone 10: Polish & Testing
**Goal:** Final polish, testing, and production readiness  
**Duration:** 2 days

### 10.1 Error Handling
- ⬜ Add ErrorBoundary components
- ⬜ Create error fallback UI
- ⬜ Handle API errors gracefully
- ⬜ Display user-friendly error messages
- ⬜ Retry mechanisms for failed requests

### 10.2 Loading States
- ⬜ Verify all async operations have loading states
- ⬜ Add Suspense boundaries where appropriate
- ⬜ Create loading.tsx files for routes

### 10.3 Accessibility Audit
- ⬜ Run axe-core accessibility checks
- ⬜ Verify keyboard navigation
- ⬜ Check focus management in modals
- ⬜ Verify color contrast ratios
- ⬜ Add missing ARIA labels

### 10.4 Responsive Testing
- ⬜ Test on mobile viewport (320px, 375px, 414px)
- ⬜ Test on tablet viewport (768px)
- ⬜ Test on desktop (1024px, 1280px)
- ⬜ Fix any layout issues

### 10.5 Performance Optimization
- ⬜ Run Lighthouse audit
- ⬜ Optimize bundle size (check imports)
- ⬜ Lazy load chart components
- ⬜ Optimize images
- ⬜ Verify caching strategy

### 10.6 Unit Tests
- ⬜ Set up Jest and React Testing Library
- ⬜ Write tests for utility functions (formatters)
- ⬜ Write tests for Zod schemas
- ⬜ Write tests for key components (TransactionForm)
- ⬜ Write tests for hooks (mock API responses)

### 10.7 Final Review
- ⬜ Code review for consistency
- ⬜ Remove console.log statements
- ⬜ Update documentation
- ⬜ Verify all environment variables documented
- ⬜ Test full user flows end-to-end

---

## Milestone 11: Deployment
**Goal:** Deploy to production  
**Duration:** 1 day

### 11.1 Vercel Setup
- ⬜ Connect GitHub repository to Vercel
- ⬜ Configure environment variables
- ⬜ Set up production Auth0 application
- ⬜ Update Auth0 callback URLs for production

### 11.2 Production Configuration
- ⬜ Verify NEXT_PUBLIC_API_URL points to production backend
- ⬜ Configure custom domain (if available)
- ⬜ Enable Vercel Analytics (optional)

### 11.3 Post-Deployment
- ⬜ Test production login flow
- ⬜ Verify all features work in production
- ⬜ Monitor for errors
- ⬜ Update documentation with production URL

---

## Summary

| Milestone | Tasks | Est. Duration |
|-----------|-------|---------------|
| 0. Project Init | 25 | 1 day |
| 1. Authentication | 35 | 2 days |
| 2. API & Hooks | 35 | 2 days |
| 3. Core UI | 40 | 3 days |
| 4. Dashboard Layout | 15 | 1 day |
| 5. Transactions | 35 | 3 days |
| 6. Budgets | 20 | 2 days |
| 7. Dashboard Home | 25 | 2 days |
| 8. Notifications | 10 | 1 day |
| 9. Settings | 10 | 1 day |
| 10. Polish & Testing | 35 | 2 days |
| 11. Deployment | 10 | 1 day |
| **Total** | **~295 tasks** | **~21 days** |

---

## Notes

- Tasks can be parallelized where dependencies allow
- Prioritize Milestones 0-5 for core functionality
- Milestone 8 (Notifications) can be deferred if needed
- Each milestone should result in working, testable features

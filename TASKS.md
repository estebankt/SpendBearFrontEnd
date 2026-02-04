# SpendBear Frontend — Backend Integration Tasks

> Generated from the integration plan. Check off each item as completed.

---

## Phase 1: Install Dependencies

- [ ] 1.1 Install runtime dependencies: `axios`, `@tanstack/react-query`, `zod`, `react-hook-form`, `@hookform/resolvers`, `sonner`
- [ ] 1.2 Verify `npm run build` still passes with no errors

---

## Phase 2: API Types & Zod Schemas

### 2A — Backend API Types (`src/lib/api/types.ts`)

- [ ] 2.1 Create `src/lib/api/types.ts`
- [ ] 2.2 Define `ApiUser` interface (id, email, firstName, lastName, picture?, currency)
- [ ] 2.3 Define `ApiCategory` interface (id, name, description?, isSystemCategory)
- [ ] 2.4 Define `ApiTransaction` interface (id, amount, currency, date, description, categoryId, category?, type)
- [ ] 2.5 Define `ApiBudget` interface (id, name, amount, currency, period, startDate, categoryId?, category?, warningThreshold, spent?)
- [ ] 2.6 Define `ApiMonthlySummary` interface (periodStart, periodEnd, totalIncome, totalExpense, netBalance, spendingByCategory, incomeByCategory)
- [ ] 2.7 Define `ApiNotification` interface (id, type, status, title, message, createdAt, actionUrl?)
- [ ] 2.8 Define `PaginatedResponse<T>` generic (items, pageNumber, pageSize, totalCount, totalPages)
- [ ] 2.9 Define `ProblemDetails` error interface (type?, title, status, detail?, errors?)

### 2B — Zod Validation Schemas (`src/lib/api/schemas.ts`)

- [ ] 2.10 Create `src/lib/api/schemas.ts`
- [ ] 2.11 Define `createTransactionSchema` (amount, currency, date, description, categoryId, type)
- [ ] 2.12 Define `updateTransactionSchema`
- [ ] 2.13 Define `createBudgetSchema` (name, amount, currency, period, startDate, categoryId?, warningThreshold)
- [ ] 2.14 Define `updateBudgetSchema`
- [ ] 2.15 Define `createCategorySchema` (name, description?)
- [ ] 2.16 Define `registerUserSchema` (email, firstName, lastName)
- [ ] 2.17 Export inferred `Input` types from each schema
- [ ] 2.18 Verify `npm run build` passes

---

## Phase 3: Server-Side Proxy Routes

### 3A — Shared Proxy Helper

- [ ] 3.1 Create `src/lib/api/server-proxy.ts`
- [ ] 3.2 Implement `proxyToBackend(req, backendPath)` function:
  - Gets JWT via `auth0.getAccessToken()`
  - Returns 401 if no token
  - Builds backend URL with forwarded query params
  - Forwards HTTP method and body
  - Handles 204 No Content responses
  - Returns JSON response with status code

### 3B — Identity Proxy Routes

- [ ] 3.3 Create `src/app/api/backend/identity/me/route.ts` — GET handler
- [ ] 3.4 Create `src/app/api/backend/identity/register/route.ts` — POST handler

### 3C — Transaction Proxy Routes

- [ ] 3.5 Create `src/app/api/backend/transactions/route.ts` — GET + POST handlers
- [ ] 3.6 Create `src/app/api/backend/transactions/[id]/route.ts` — PUT + DELETE handlers (await params for Next.js 16)

### 3D — Category Proxy Routes

- [ ] 3.7 Create `src/app/api/backend/categories/route.ts` — GET + POST handlers

### 3E — Budget Proxy Routes

- [ ] 3.8 Create `src/app/api/backend/budgets/route.ts` — GET + POST handlers
- [ ] 3.9 Create `src/app/api/backend/budgets/[id]/route.ts` — PUT + DELETE handlers

### 3F — Analytics Proxy Routes

- [ ] 3.10 Create `src/app/api/backend/analytics/monthly/route.ts` — GET handler

### 3G — Notification Proxy Routes

- [ ] 3.11 Create `src/app/api/backend/notifications/route.ts` — GET handler
- [ ] 3.12 Create `src/app/api/backend/notifications/[id]/read/route.ts` — PUT handler

### 3H — Verification

- [ ] 3.13 Verify `npm run build` passes
- [ ] 3.14 Manual test: with backend running, log in and test `GET /api/backend/identity/me` returns data or 404

---

## Phase 4: Client-Side API Layer & Providers

### 4A — Axios Client

- [ ] 4.1 Create `src/lib/api/client.ts`
- [ ] 4.2 Configure axios instance with `baseURL: '/api/backend'`
- [ ] 4.3 Add 401 response interceptor (redirect to `/auth/login`)

### 4B — Typed Endpoint Functions

- [ ] 4.4 Create `src/lib/api/endpoints.ts`
- [ ] 4.5 Implement `identityApi` — `me()`, `register(data)`
- [ ] 4.6 Implement `transactionApi` — `list(params)`, `create(data)`, `update(id, data)`, `delete(id)`
- [ ] 4.7 Implement `categoryApi` — `list()`, `create(data)`
- [ ] 4.8 Implement `budgetApi` — `list(params)`, `create(data)`, `update(id, data)`, `delete(id)`
- [ ] 4.9 Implement `analyticsApi` — `monthlySummary(year, month)`
- [ ] 4.10 Implement `notificationApi` — `list(params)`, `markRead(id)`

### 4C — Query Provider

- [ ] 4.11 Create `src/lib/providers/QueryProvider.tsx` (client component)
- [ ] 4.12 Configure `QueryClient` with defaults (staleTime: 60s, retry: 1, refetchOnWindowFocus: false)

### 4D — Wire Providers into App

- [ ] 4.13 Modify `src/app/layout.tsx` — wrap children with `<QueryProvider>`
- [ ] 4.14 Add `<Toaster />` from sonner to `src/app/layout.tsx`
- [ ] 4.15 Verify `npm run build` passes
- [ ] 4.16 Verify app renders identically (no visual changes, no console errors)

---

## Phase 5: React Query Hooks

### 5A — Identity Hooks

- [ ] 5.1 Create `src/lib/hooks/use-identity.ts`
- [ ] 5.2 Implement `useCurrentUser()` — queryKey: `['identity', 'me']`, retry: false
- [ ] 5.3 Implement `useRegister()` — mutation, invalidates `['identity', 'me']`

### 5B — Transaction Hooks

- [ ] 5.4 Create `src/lib/hooks/use-transactions.ts`
- [ ] 5.5 Implement `useTransactions(params?)` — queryKey: `['transactions', params]`
- [ ] 5.6 Implement `useCreateTransaction()` — invalidates transactions, analytics, budgets; toast success/error
- [ ] 5.7 Implement `useUpdateTransaction()` — same invalidation + toast pattern
- [ ] 5.8 Implement `useDeleteTransaction()` — same invalidation + toast pattern

### 5C — Category Hooks

- [ ] 5.9 Create `src/lib/hooks/use-categories.ts`
- [ ] 5.10 Implement `useCategories()` — queryKey: `['categories']`
- [ ] 5.11 Implement `useCreateCategory()` — invalidates `['categories']`

### 5D — Budget Hooks

- [ ] 5.12 Create `src/lib/hooks/use-budgets.ts`
- [ ] 5.13 Implement `useBudgets(params?)` — queryKey: `['budgets', params]`
- [ ] 5.14 Implement `useCreateBudget()` — invalidates `['budgets']`; toast
- [ ] 5.15 Implement `useUpdateBudget()` — invalidates `['budgets']`; toast
- [ ] 5.16 Implement `useDeleteBudget()` — invalidates `['budgets']`; toast

### 5E — Analytics Hooks

- [ ] 5.17 Create `src/lib/hooks/use-analytics.ts`
- [ ] 5.18 Implement `useMonthlyAnalytics(year, month)` — queryKey: `['analytics', 'monthly', year, month]`

### 5F — Notification Hooks

- [ ] 5.19 Create `src/lib/hooks/use-notifications.ts`
- [ ] 5.20 Implement `useNotifications(params?)` — queryKey: `['notifications', params]`
- [ ] 5.21 Implement `useMarkNotificationRead()` — invalidates `['notifications']`

### 5G — Verification

- [ ] 5.22 Verify `npm run build` passes

---

## Phase 6: Auto-Registration (AuthGuard)

- [ ] 6.1 Create `src/components/providers/AuthGuard.tsx` (client component)
- [ ] 6.2 Use `useUser()` from `@auth0/nextjs-auth0/client` to get Auth0 profile
- [ ] 6.3 Use `useCurrentUser()` to check backend registration via GET `/identity/me`
- [ ] 6.4 If 404 + Auth0 user exists → call `useRegister()` with `{ email, firstName, lastName }` from Auth0 profile
- [ ] 6.5 Show loading skeleton while checking/registering
- [ ] 6.6 Render children once user confirmed
- [ ] 6.7 Modify `src/app/(dashboard)/layout.tsx` — wrap `{children}` with `<AuthGuard>`
- [ ] 6.8 Verify `npm run build` passes
- [ ] 6.9 Manual test: new Auth0 user → Network tab shows GET /me (404) → POST /register (200) → GET /me (200)
- [ ] 6.10 Manual test: existing user → single GET /me (200)

---

## Phase 7: Data Mappers

- [ ] 7.1 Create `src/lib/api/mappers.ts`
- [ ] 7.2 Define `CATEGORY_DISPLAY` lookup (category name → icon + color) using existing values from `constants.ts`
- [ ] 7.3 Implement `mapTransaction(t: ApiTransaction, categories: ApiCategory[]): Transaction`
  - Map `description` → `merchant`
  - Derive `icon`/`iconColor` from category name lookup
  - Negate amount for expenses (type === 1)
- [ ] 7.4 Implement `mapBudget(b: ApiBudget, categories: ApiCategory[]): CategoryBudget`
  - Compute `percentageUsed`, `remaining`, `isOverBudget`, `isNearLimit`
  - Derive display fields from category
- [ ] 7.5 Implement `mapMonthlySummary(s: ApiMonthlySummary, categories: ApiCategory[]): MonthlyAnalytics`
  - Transform `spendingByCategory` record into `CategoryBreakdown[]`
  - Compute `topCategories` (top 5 by amount)
  - Compute `netSavings`, `budgetAdherence`
- [ ] 7.6 Verify `npm run build` passes

---

## Phase 8: Wire Pages to Real Data

### 8A — Transactions Page

- [ ] 8.1 Modify `src/app/(dashboard)/dashboard/transactions/page.tsx`
- [ ] 8.2 Remove `TRANSACTIONS_DATA` import from constants
- [ ] 8.3 Add `useTransactions()` and `useCategories()` hooks
- [ ] 8.4 Map API response through `mapTransaction()`
- [ ] 8.5 Pass `categoryId` and `type` as query params (server-side filtering)
- [ ] 8.6 Keep `searchQuery` as client-side filter
- [ ] 8.7 Add loading skeleton when `isLoading`
- [ ] 8.8 Add error state when `isError`
- [ ] 8.9 Add pagination state (pageNumber, pageSize) wired to hook params
- [ ] 8.10 Update summary calculation to use real data

### 8B — Budgets Page

- [ ] 8.11 Modify `src/app/(dashboard)/dashboard/budgets/page.tsx`
- [ ] 8.12 Remove `CATEGORY_BUDGETS` and `MONTHLY_ANALYTICS` imports
- [ ] 8.13 Add `useBudgets()` and `useCategories()` hooks
- [ ] 8.14 Map through `mapBudget()`
- [ ] 8.15 Wire month selector to actual year/month state passed to hooks
- [ ] 8.16 Add loading/error states

### 8C — Analytics Page

- [ ] 8.17 Modify `src/app/(dashboard)/dashboard/analytics/page.tsx`
- [ ] 8.18 Remove `MONTHLY_ANALYTICS` import
- [ ] 8.19 Add `useMonthlyAnalytics(year, month)` hook
- [ ] 8.20 Map through `mapMonthlySummary()`
- [ ] 8.21 Wire period selector to actual year/month state
- [ ] 8.22 Add loading/error states

### 8D — Dashboard Widgets

- [ ] 8.23 Modify `src/components/dashboard/KPICards.tsx` — replace `MOCK_KPIS` with `useMonthlyAnalytics()`, derive KPIs from totalIncome/totalExpense/netBalance
- [ ] 8.24 Modify `src/components/dashboard/CashFlowChart.tsx` — replace `MOCK_CASH_FLOW` with real data (or keep mock if no direct backend equivalent)
- [ ] 8.25 Modify `src/components/dashboard/RecentTransactions.tsx` — replace `MOCK_TRANSACTIONS` with `useTransactions({ pageSize: 5 })` + `useCategories()` + `mapTransaction()`
- [ ] 8.26 Modify `src/components/dashboard/TopBudgets.tsx` — replace `MOCK_BUDGETS` with `useBudgets({ activeOnly: true })` + `useCategories()` + `mapBudget()`
- [ ] 8.27 Keep `src/components/dashboard/LinkedAccounts.tsx` unchanged (no backend endpoint)

### 8E — Pagination for Transaction List

- [ ] 8.28 Modify `src/components/dashboard/transactions/TransactionList.tsx` — add pagination controls
- [ ] 8.29 Wire pagination controls to parent page's `pageNumber` state

### 8F — Verification

- [ ] 8.30 Verify `npm run build` passes
- [ ] 8.31 Manual test: Dashboard page loads data from API
- [ ] 8.32 Manual test: Transactions page loads, filters work, pagination works
- [ ] 8.33 Manual test: Budgets page loads from API
- [ ] 8.34 Manual test: Analytics page loads from API
- [ ] 8.35 Verify empty states display gracefully when no backend data exists

---

## Phase 9: Mutation Forms (CRUD UI)

### 9A — Transaction Form Dialog

- [ ] 9.1 Create `src/components/dashboard/transactions/TransactionFormDialog.tsx`
- [ ] 9.2 Use `react-hook-form` + `zodResolver(createTransactionSchema)`
- [ ] 9.3 Add fields: amount, description, category select (from `useCategories()`), date, type toggle (income/expense), currency
- [ ] 9.4 Handle create mode: call `useCreateTransaction()` on submit
- [ ] 9.5 Handle edit mode: pre-fill form with existing data, call `useUpdateTransaction()` on submit
- [ ] 9.6 Add loading state on submit button
- [ ] 9.7 Close dialog and reset form on success

### 9B — Wire Transaction Form into Page

- [ ] 9.8 Modify `src/app/(dashboard)/dashboard/transactions/page.tsx`
- [ ] 9.9 Add state for dialog open/close and editing transaction
- [ ] 9.10 Wire "Add New" button to open dialog in create mode
- [ ] 9.11 Pass `onEdit` callback to transaction list/rows

### 9C — Transaction Edit/Delete Actions

- [ ] 9.12 Modify `src/components/dashboard/transactions/TransactionRow.tsx`
- [ ] 9.13 Add edit action (calls parent `onEdit` callback to open dialog)
- [ ] 9.14 Add delete action with confirmation prompt
- [ ] 9.15 Wire `useDeleteTransaction()` for delete

### 9D — Budget Form Dialog

- [ ] 9.16 Create `src/components/dashboard/budgets/BudgetFormDialog.tsx`
- [ ] 9.17 Use `react-hook-form` + `zodResolver(createBudgetSchema)`
- [ ] 9.18 Add fields: name, amount, category (optional — null for global), period, startDate, warningThreshold
- [ ] 9.19 Handle create and edit modes
- [ ] 9.20 Add loading state and dialog close on success

### 9E — Wire Budget Form into Page

- [ ] 9.21 Modify `src/app/(dashboard)/dashboard/budgets/page.tsx`
- [ ] 9.22 Add state for dialog open/close and editing budget
- [ ] 9.23 Wire "Add Category" button to open dialog in create mode

### 9F — Budget Edit/Delete Actions

- [ ] 9.24 Modify `src/components/dashboard/budgets/CategoryBudgetItem.tsx`
- [ ] 9.25 Add edit action (opens dialog with existing data)
- [ ] 9.26 Add delete action with confirmation

### 9G — Category Creation

- [ ] 9.27 Add inline category creation option within transaction/budget form dialogs
- [ ] 9.28 Use `useCreateCategory()` hook
- [ ] 9.29 Auto-select newly created category in the parent form

### 9H — Verification

- [ ] 9.30 Manual test: Create transaction → toast → appears in list
- [ ] 9.31 Manual test: Edit transaction → form pre-fills → submit updates
- [ ] 9.32 Manual test: Delete transaction → confirmation → removed from list
- [ ] 9.33 Manual test: Create budget → toast → appears in list
- [ ] 9.34 Manual test: Edit budget → form pre-fills → submit updates
- [ ] 9.35 Manual test: Delete budget → confirmation → removed from list
- [ ] 9.36 Manual test: Create category from within form → category available in select
- [ ] 9.37 Final `npm run build` passes with no TypeScript errors

---

## Final Cleanup

- [ ] 10.1 Review `src/lib/constants.ts` — remove unused mock data (keep `NAV_ITEMS`, `CATEGORIES` display config if still referenced)
- [ ] 10.2 Verify no remaining imports from mock constants in page/component files (except LinkedAccounts)
- [ ] 10.3 Final `npm run build` + `npm run lint` pass

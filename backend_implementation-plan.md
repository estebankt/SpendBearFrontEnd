# Plan: Connect SpendBear Frontend to Backend API

## Summary

Wire the Next.js frontend (currently 100% mock data) to the live backend at `http://localhost:5109`. Uses a server-side proxy pattern so the JWT never reaches the browser, TanStack Query for caching/mutations, and auto-registration on first login.

## Decisions

- **Full stack**: axios, @tanstack/react-query, zod, react-hook-form, @hookform/resolvers, sonner
- **Full CRUD**: GET + POST/PUT/DELETE with cache invalidation and toast feedback
- **Auto-register**: Check `/api/identity/me` on dashboard load; if 404 → auto-register with Auth0 profile
- **Server-side proxy**: Next.js API routes at `/api/backend/*` forward requests with JWT attached

---

## Phase 1: Install Dependencies

```bash
npm install axios @tanstack/react-query zod react-hook-form @hookform/resolvers sonner
```

**Verify**: `npm run build` still passes.

---

## Phase 2: API Types & Zod Schemas

### Create `src/lib/api/types.ts`
Backend-aligned response types (these differ from the existing display types in `src/lib/types.ts`):
- `ApiUser`, `ApiCategory`, `ApiTransaction`, `ApiBudget`, `ApiMonthlySummary`, `ApiNotification`
- `PaginatedResponse<T>` wrapper (items, pageNumber, pageSize, totalCount, totalPages)
- `ProblemDetails` error type

### Create `src/lib/api/schemas.ts`
Zod schemas for mutation inputs:
- `createTransactionSchema`, `updateTransactionSchema`
- `createBudgetSchema`, `updateBudgetSchema`
- `createCategorySchema`
- `registerUserSchema`
- Export inferred `Input` types from each

**Verify**: `npm run build` passes (unused imports are fine).

---

## Phase 3: Server-Side Proxy Routes

### Create `src/lib/api/server-proxy.ts`
Shared helper function `proxyToBackend(req, backendPath)`:
1. Call `auth0.getAccessToken()` to get JWT (from `src/lib/auth0.ts`)
2. Forward request to `http://localhost:5109` + backendPath with `Authorization: Bearer <token>`
3. Pass through query params, request body, and HTTP method
4. Return backend response (handle 204 no-content)

### Create proxy route handlers (11 files):

| Route File | Methods | Proxies To |
|---|---|---|
| `src/app/api/backend/identity/me/route.ts` | GET | `/api/identity/me` |
| `src/app/api/backend/identity/register/route.ts` | POST | `/api/identity/register` |
| `src/app/api/backend/transactions/route.ts` | GET, POST | `/api/spending/transactions` |
| `src/app/api/backend/transactions/[id]/route.ts` | PUT, DELETE | `/api/spending/transactions/{id}` |
| `src/app/api/backend/categories/route.ts` | GET, POST | `/api/spending/categories` |
| `src/app/api/backend/budgets/route.ts` | GET, POST | `/api/budgets` |
| `src/app/api/backend/budgets/[id]/route.ts` | PUT, DELETE | `/api/budgets/{id}` |
| `src/app/api/backend/analytics/monthly/route.ts` | GET | `/api/analytics/summary/monthly` |
| `src/app/api/backend/notifications/route.ts` | GET | `/api/notifications` |
| `src/app/api/backend/notifications/[id]/read/route.ts` | PUT | `/api/notifications/{id}/read` |

Note: Next.js 16 route params are `Promise<{ id: string }>` — must `await params`.

**Verify**: With backend running, after logging in, `curl http://localhost:3000/api/backend/identity/me` (with session cookie) should return user data or 404.

---

## Phase 4: Client-Side API Layer & Providers

### Create `src/lib/api/client.ts`
Axios instance with `baseURL: '/api/backend'` (our proxy, NOT the backend directly). No auth interceptor needed. Add 401 response interceptor that redirects to `/auth/login`.

### Create `src/lib/api/endpoints.ts`
Typed functions using the axios client:
- `identityApi.me()`, `identityApi.register(data)`
- `transactionApi.list(params)`, `.create(data)`, `.update(id, data)`, `.delete(id)`
- `categoryApi.list()`, `.create(data)`
- `budgetApi.list(params)`, `.create(data)`, `.update(id, data)`, `.delete(id)`
- `analyticsApi.monthlySummary(year, month)`
- `notificationApi.list(params)`, `.markRead(id)`

### Create `src/lib/providers/QueryProvider.tsx`
Client component wrapping `QueryClientProvider` with sensible defaults (1min staleTime, retry: 1).

### Modify `src/app/layout.tsx`
- Import `QueryProvider` and `Toaster` from sonner
- Wrap children: `<Auth0Provider><QueryProvider>{children}</QueryProvider><Toaster /></Auth0Provider>`

**Verify**: `npm run build` passes. App renders identically (no data fetching yet).

---

## Phase 5: React Query Hooks

### Create `src/lib/hooks/use-identity.ts`
- `useCurrentUser()` — `queryKey: ['identity', 'me']`, calls `identityApi.me()`, `retry: false`
- `useRegister()` — mutation, invalidates `['identity', 'me']` on success

### Create `src/lib/hooks/use-transactions.ts`
- `useTransactions(params?)` — `queryKey: ['transactions', params]`
- `useCreateTransaction()` — invalidates `['transactions']`, `['analytics']`, `['budgets']`; toast on success/error
- `useUpdateTransaction()` — same invalidation pattern
- `useDeleteTransaction()` — same invalidation pattern

### Create `src/lib/hooks/use-categories.ts`
- `useCategories()` — `queryKey: ['categories']`
- `useCreateCategory()` — invalidates `['categories']`

### Create `src/lib/hooks/use-budgets.ts`
- `useBudgets(params?)` — `queryKey: ['budgets', params]`
- `useCreateBudget()`, `useUpdateBudget()`, `useDeleteBudget()` — invalidate `['budgets']`

### Create `src/lib/hooks/use-analytics.ts`
- `useMonthlyAnalytics(year, month)` — `queryKey: ['analytics', 'monthly', year, month]`

### Create `src/lib/hooks/use-notifications.ts`
- `useNotifications(params?)` — `queryKey: ['notifications', params]`
- `useMarkNotificationRead()` — invalidates `['notifications']`

**Verify**: `npm run build` passes.

---

## Phase 6: Auto-Registration (AuthGuard)

### Create `src/components/providers/AuthGuard.tsx`
Client component that:
1. Uses `useUser()` from Auth0 client SDK to get Auth0 profile
2. Uses `useCurrentUser()` hook to call GET `/api/backend/identity/me`
3. If 404 response + Auth0 user exists + haven't tried yet → call `useRegister()` with `{ email, firstName, lastName }` from Auth0 profile
4. Shows loading skeleton while checking/registering
5. Renders children once user is confirmed

### Modify `src/app/(dashboard)/layout.tsx`
Wrap `{children}` with `<AuthGuard>`:
```
<AuthGuard>{children}</AuthGuard>
```
Note: The layout is a server component. AuthGuard is a client component. This is fine — server components can render client components as children.

**Verify**: Log in with new Auth0 user → Network tab shows GET /me (404) → POST /register (200) → GET /me (200). Existing user: single GET /me (200).

---

## Phase 7: Data Mappers

### Create `src/lib/api/mappers.ts`

The backend API types differ from the frontend display types (e.g., backend `ApiTransaction` has `description` but no `merchant`/`icon`/`iconColor`; frontend `Transaction` type has those). Create mapper functions to bridge:

- `mapTransaction(t: ApiTransaction, categories: ApiCategory[]): Transaction` — maps `description` → `merchant`, derives `icon`/`iconColor` from category name lookup
- `mapBudget(b: ApiBudget, categories: ApiCategory[]): CategoryBudget` — computes `percentageUsed`, `isOverBudget`, `isNearLimit`, derives display fields
- `mapMonthlySummary(s: ApiMonthlySummary, categories: ApiCategory[]): MonthlyAnalytics` — transforms `spendingByCategory` record into `CategoryBreakdown[]` array

Category → icon/color mapping: maintain a `CATEGORY_DISPLAY` lookup in the mapper file using the existing category names from `constants.ts` (Groceries, Dining Out, Transportation, etc.) with a sensible fallback for unknown categories.

---

## Phase 8: Wire Pages to Real Data

### 8a. Transactions Page (`src/app/(dashboard)/dashboard/transactions/page.tsx`)
- Remove `TRANSACTIONS_DATA` import
- Add `useTransactions()` and `useCategories()` hooks
- Map API data through `mapTransaction()`
- Pass `categoryId`, `type` as query params to hook (server-side filtering)
- Keep `searchQuery` as client-side filter (backend doesn't support text search)
- Add loading skeleton when `isLoading`, error state when `isError`
- Add pagination state (`pageNumber`) wired to hook params

### 8b. Budgets Page (`src/app/(dashboard)/dashboard/budgets/page.tsx`)
- Remove `CATEGORY_BUDGETS` and `MONTHLY_ANALYTICS` imports
- Add `useBudgets()` and `useCategories()` hooks
- Map through `mapBudget()`
- Wire month selector to actual year/month state, pass to hook
- Add loading/error states

### 8c. Analytics Page (`src/app/(dashboard)/dashboard/analytics/page.tsx`)
- Remove `MONTHLY_ANALYTICS` import
- Add `useMonthlyAnalytics(year, month)` hook
- Map through `mapMonthlySummary()`
- Wire period selector to actual year/month state
- Add loading/error states

### 8d. Dashboard Widgets (each file modified individually)
These components currently import mock constants directly. Convert each to use hooks:

| Component File | Current Import | Replace With |
|---|---|---|
| `src/components/dashboard/KPICards.tsx` | `MOCK_KPIS` | `useMonthlyAnalytics()` — derive KPI values from totalIncome/totalExpense/netBalance |
| `src/components/dashboard/CashFlowChart.tsx` | `MOCK_CASH_FLOW` | `useMonthlyAnalytics()` — derive from spendingTrend or keep mock (no direct backend equivalent) |
| `src/components/dashboard/RecentTransactions.tsx` | `MOCK_TRANSACTIONS` | `useTransactions({ pageSize: 5 })` + `useCategories()` + `mapTransaction()` |
| `src/components/dashboard/TopBudgets.tsx` | `MOCK_BUDGETS` | `useBudgets({ activeOnly: true })` + `useCategories()` + `mapBudget()` |
| `src/components/dashboard/LinkedAccounts.tsx` | `MOCK_ACCOUNTS` | Keep mock (no backend endpoint for accounts) |

Each gets `'use client'` directive (if not already), loading skeleton, and error handling.

Note: `DashboardPage` (`src/app/(dashboard)/dashboard/page.tsx`) is currently a server component that renders these client child components. It stays as a server component — the children fetch their own data.

**Verify** (per page): With backend running, navigate to page → Network tab shows proxy requests → data renders (may be empty if no backend data). Create test data via Swagger at `http://localhost:5109/scalar/` → refresh → data appears.

---

## Phase 9: Mutation Forms (CRUD UI)

### 9a. Create `src/components/dashboard/transactions/TransactionFormDialog.tsx`
- Modal/dialog for create + edit
- Uses `react-hook-form` + `zodResolver(createTransactionSchema)`
- Fields: amount, description, category (select from `useCategories()`), date, type (income/expense toggle), currency
- Calls `useCreateTransaction()` or `useUpdateTransaction()` on submit
- Pre-fills form when editing an existing transaction

### 9b. Wire into Transactions Page
- "Add New" button opens the dialog in create mode
- Add state: `const [formOpen, setFormOpen] = useState(false)`
- Add state: `const [editingTransaction, setEditingTransaction] = useState<ApiTransaction | null>(null)`

### 9c. Add edit/delete to `src/components/dashboard/transactions/TransactionRow.tsx`
- Add action dropdown or buttons (edit, delete)
- Edit: opens `TransactionFormDialog` with existing data
- Delete: confirmation prompt → calls `useDeleteTransaction().mutate(id)`

### 9d. Create `src/components/dashboard/budgets/BudgetFormDialog.tsx`
- Same pattern: react-hook-form + zod
- Fields: name, amount, category (optional — null for global), period, startDate, warningThreshold
- Calls `useCreateBudget()` or `useUpdateBudget()`

### 9e. Wire into Budgets Page
- "Add Category" button opens budget form dialog
- Add edit/delete actions to `CategoryBudgetItem.tsx`

### 9f. Category creation
- Simple inline form or dialog, accessible from transaction/budget forms when no matching category exists
- Uses `useCreateCategory()` hook

**Verify**: Create transaction via form → toast appears → list refreshes with new item. Edit → form pre-fills → submit updates. Delete → confirmation → item removed. Same flow for budgets.

---

## Files Summary

### New Files (26)

| File | Purpose |
|---|---|
| `src/lib/api/types.ts` | Backend API response types |
| `src/lib/api/schemas.ts` | Zod validation schemas |
| `src/lib/api/client.ts` | Axios client (talks to proxy) |
| `src/lib/api/endpoints.ts` | Typed API endpoint functions |
| `src/lib/api/server-proxy.ts` | Shared proxy helper |
| `src/lib/api/mappers.ts` | API → display type mappers |
| `src/lib/providers/QueryProvider.tsx` | TanStack Query provider |
| `src/lib/hooks/use-identity.ts` | Identity/registration hooks |
| `src/lib/hooks/use-transactions.ts` | Transaction CRUD hooks |
| `src/lib/hooks/use-categories.ts` | Category hooks |
| `src/lib/hooks/use-budgets.ts` | Budget CRUD hooks |
| `src/lib/hooks/use-analytics.ts` | Analytics hooks |
| `src/lib/hooks/use-notifications.ts` | Notification hooks |
| `src/app/api/backend/identity/me/route.ts` | Proxy route |
| `src/app/api/backend/identity/register/route.ts` | Proxy route |
| `src/app/api/backend/transactions/route.ts` | Proxy route |
| `src/app/api/backend/transactions/[id]/route.ts` | Proxy route |
| `src/app/api/backend/categories/route.ts` | Proxy route |
| `src/app/api/backend/budgets/route.ts` | Proxy route |
| `src/app/api/backend/budgets/[id]/route.ts` | Proxy route |
| `src/app/api/backend/analytics/monthly/route.ts` | Proxy route |
| `src/app/api/backend/notifications/route.ts` | Proxy route |
| `src/app/api/backend/notifications/[id]/read/route.ts` | Proxy route |
| `src/components/providers/AuthGuard.tsx` | Auto-registration guard |
| `src/components/dashboard/transactions/TransactionFormDialog.tsx` | Transaction create/edit form |
| `src/components/dashboard/budgets/BudgetFormDialog.tsx` | Budget create/edit form |

### Modified Files (13)

| File | Change |
|---|---|
| `package.json` | Add 6 dependencies |
| `src/app/layout.tsx` | Add QueryProvider + Toaster |
| `src/app/(dashboard)/layout.tsx` | Wrap children with AuthGuard |
| `src/app/(dashboard)/dashboard/transactions/page.tsx` | Replace mock data with hooks |
| `src/app/(dashboard)/dashboard/budgets/page.tsx` | Replace mock data with hooks |
| `src/app/(dashboard)/dashboard/analytics/page.tsx` | Replace mock data with hooks |
| `src/components/dashboard/KPICards.tsx` | Use hooks instead of MOCK_KPIS |
| `src/components/dashboard/CashFlowChart.tsx` | Use hooks instead of MOCK_CASH_FLOW |
| `src/components/dashboard/RecentTransactions.tsx` | Use hooks instead of MOCK_TRANSACTIONS |
| `src/components/dashboard/TopBudgets.tsx` | Use hooks instead of MOCK_BUDGETS |
| `src/components/dashboard/transactions/TransactionRow.tsx` | Add edit/delete actions |
| `src/components/dashboard/transactions/TransactionList.tsx` | Add pagination |
| `src/components/dashboard/budgets/CategoryBudgetItem.tsx` | Add edit/delete actions |

### Unchanged Files
- `src/lib/constants.ts` — kept for reference, can clean up later
- `src/lib/types.ts` — kept, display types still used by components
- `src/middleware.ts` — no changes needed
- `src/lib/auth0.ts` — no changes needed
- All marketing page components
- `src/components/ui/*`
- `src/components/dashboard/LinkedAccounts.tsx` — stays mock (no backend endpoint)

---

## Verification Plan

1. **After Phase 1**: `npm run build` passes
2. **After Phase 4**: App renders identically to current state, no errors in console
3. **After Phase 6**: Login with new user → auto-registration works (check Network tab)
4. **After Phase 8**: Navigate to each page with backend running:
   - Dashboard → proxy requests in Network tab, data renders
   - Transactions → list loads from API, filters work
   - Budgets → budget list loads from API
   - Analytics → monthly summary loads from API
   - Empty states display gracefully when no backend data exists
5. **After Phase 9**: Full CRUD flow:
   - Create transaction → appears in list
   - Edit transaction → updates in list
   - Delete transaction → removed from list
   - Same for budgets
   - Toast notifications appear for all mutations
6. **Final**: `npm run build` passes with no TypeScript errors

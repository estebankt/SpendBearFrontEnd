# Frontend Requirements - SpendBear MVP

## MVP Scope

The MVP frontend focuses on validating core backend functionality with minimal but polished UI. Every feature should work end-to-end to test the API and event-driven architecture.

## User Flows

### 1. Authentication Flow (Critical Path)

```mermaid
Start → Landing Page → Login (Auth0) → Dashboard
                          ↓
                     First Time?
                          ↓
                    Onboarding → Set Currency → Dashboard
```

**Requirements:**
- Social login only (Google, GitHub) via Auth0
- Auto-redirect to dashboard if authenticated
- Persist auth state across refreshes
- Show loading state during auth check
- Handle Auth0 errors gracefully

**UI Components Needed:**
- Landing page with login button
- Auth0 redirect handler
- Loading spinner
- Error toast

### 2. Add Transaction Flow (Core Feature)

```mermaid
Dashboard → [+] Button → Transaction Form → Submit → Success Toast → Dashboard (Updated)
                              ↓
                        Validation Error → Show Inline Errors
```

**Requirements:**
- Accessible via floating action button (mobile) or header button (desktop)
- Form persists if accidentally closed (localStorage)
- Real-time validation as user types
- Success confirmation with transaction details
- Immediate dashboard update (optimistic)

**Form Fields (MVP):**
```typescript
{
  amount: number;        // Required, auto-focus, number pad on mobile
  category: UUID;        // Required, dropdown with icons
  date: Date;           // Default today, calendar picker
  merchant?: string;    // Optional, text input
  notes?: string;       // Optional, textarea
}
```

**UI Components Needed:**
- Modal or slide-over panel
- Currency input with formatting
- Category selector with icons
- Date picker
- Submit button with loading state

### 3. View Dashboard Flow

```mermaid
Login → Dashboard → View Metrics → Interact with Charts
           ↓
    [Spending This Month]
    [Budget Status Cards]
    [Recent Transactions]
    [Quick Actions]
```

**Requirements:**
- Load in < 2 seconds
- Show skeleton while loading
- Cache for 5 minutes
- Pull-to-refresh on mobile
- Auto-refresh budget alerts

**Dashboard Widgets (MVP):**
1. **Month Spending Card**
   - Total amount
   - Comparison to last month
   - Sparkline trend

2. **Active Budgets (max 3)**
   - Progress bar
   - Amount remaining
   - Days left
   - Color coding

3. **Recent Transactions (max 5)**
   - Amount, category icon, merchant
   - Relative time (2 hours ago)
   - Click to view details

4. **Quick Actions**
   - Add Transaction
   - View All Transactions
   - Manage Budgets

### 4. Budget Management Flow

```mermaid
Dashboard → Budgets → Create/Edit Budget → Set Limit → Save
                           ↓
                     View Existing → Edit/Delete
```

**Requirements:**
- Show all budgets with visual status
- Easy limit adjustment (slider or input)
- Period selection (monthly only for MVP)
- Real-time remaining calculation

**UI Components Needed:**
- Budget list/grid
- Budget form modal
- Progress visualization
- Delete confirmation

### 5. Transaction List Flow

```mermaid
Dashboard → View All → Filter/Sort → View Details → Edit/Delete
                           ↓
                     Export (Future)
```

**Requirements:**
- Infinite scroll or pagination
- Group by date
- Quick filters (category, date range)
- Bulk select for delete (Phase 2)

**UI Components Needed:**
- Transaction table/list
- Filter bar
- Sort dropdown
- Detail modal

## Page Specifications

### Landing Page (/)
```
┌──────────────────────────────┐
│     SpendBear Logo          │
│                             │
│  Track Spending,            │
│  Tame Your Budget 🐻        │
│                             │
│  [Get Started with Auth0]   │
│                             │
│  • Simple expense tracking  │
│  • Smart budget alerts      │
│  • Beautiful insights       │
└──────────────────────────────┘
```

### Dashboard (/dashboard)
```
┌──────────────────────────────┐
│ 📊 Dashboard    👤 Profile   │
├──────────────────────────────┤
│ This Month: $1,234.56        │
│ ▼ -12% from last month       │
├──────────────────────────────┤
│ Budgets                      │
│ ├─ Food [████████──] $100    │
│ ├─ Transport [████──] $250   │
│ └─ Shopping [██────] $500    │
├──────────────────────────────┤
│ Recent                  More> │
│ • Starbucks      -$4.50      │
│ • Uber          -$12.30      │
│ • Walmart       -$67.89      │
└──────────────────────────────┘
     [+] Add Transaction
```

### Transaction Form (/dashboard/transactions/new)
```
┌──────────────────────────────┐
│ ← Add Transaction            │
├──────────────────────────────┤
│ Amount *                     │
│ [$][___________]             │
│                             │
│ Category *                  │
│ [🍔 Food & Dining    ▼]     │
│                             │
│ Date                        │
│ [Today - Nov 29 ▼]          │
│                             │
│ Merchant                    │
│ [_______________]           │
│                             │
│ Notes                       │
│ [_______________]           │
│                             │
│ [Cancel]  [Add Transaction] │
└──────────────────────────────┘
```

### Budget List (/dashboard/budgets)
```
┌──────────────────────────────┐
│ ← Budgets     [+ New Budget] │
├──────────────────────────────┤
│ November 2024                │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🍔 Food & Dining        │ │
│ │ $400/$500 limit         │ │
│ │ [████████────────] 80%  │ │
│ │ 2 days remaining        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🚗 Transportation       │ │
│ │ $180/$300 limit         │ │
│ │ [██████────────] 60%    │ │
│ │ 2 days remaining        │ │
│ └─────────────────────────┘ │
└──────────────────────────────┘
```

## Component Library (MVP)

### Core Components Needed

#### Inputs
- **CurrencyInput** - Format as user types, handle decimals
- **CategorySelect** - Icons, search, recent items first
- **DatePicker** - Default today, quick presets
- **FormField** - Label, input, error message wrapper

#### Display
- **Card** - Consistent padding, shadow, border radius
- **ProgressBar** - With percentage, color states
- **Stat** - Label, value, change indicator
- **Empty** - Icon, message, action button

#### Feedback
- **Toast** - Success, error, info variants
- **LoadingSpinner** - Inline and overlay versions
- **Skeleton** - For cards, lists, text
- **ErrorBoundary** - Catch and display errors gracefully

#### Navigation
- **NavBar** - Desktop horizontal
- **MobileNav** - Bottom tab bar
- **Breadcrumb** - For nested pages
- **BackButton** - Consistent navigation

#### Data
- **DataTable** - Sortable, filterable
- **TransactionItem** - List row component
- **BudgetCard** - Progress, stats, actions
- **Chart** - Line, bar, pie wrappers

## Responsive Behavior

### Mobile (< 640px)
- Bottom navigation bar
- Full-screen modals
- Touch-optimized inputs (44px targets)
- Swipe gestures for delete
- Pull-to-refresh

### Tablet (640px - 1024px)
- Side navigation drawer
- 2-column layouts where appropriate
- Modal dialogs (not full screen)

### Desktop (> 1024px)
- Fixed sidebar navigation
- Multi-column dashboard
- Hover states
- Keyboard shortcuts
- Inline editing

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings
- **Screen Readers**: Proper ARIA labels
- **Keyboard Navigation**: All interactive elements reachable

### Implementation
```typescript
// Example accessible component
<button
  aria-label="Add new transaction"
  aria-describedby="add-transaction-tooltip"
  onClick={handleAdd}
  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
>
  <PlusIcon aria-hidden="true" />
  <span className="sr-only">Add Transaction</span>
</button>
```

## Performance Requirements

### Target Metrics (Lighthouse)
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

### Loading States
```typescript
// Progressive loading example
const DashboardPage = () => {
  const { data: user } = useUser(); // Fast, cached
  const { data: summary } = useMonthlySummary(); // May take time
  const { data: transactions } = useRecentTransactions(); // May take time
  
  return (
    <>
      <Header user={user} />
      {summary ? <SummaryCard data={summary} /> : <SummarySkeleton />}
      {transactions ? <RecentList data={transactions} /> : <ListSkeleton />}
    </>
  );
};
```

## Data Management

### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Specific cache times
const CACHE_TIMES = {
  user: Infinity, // Until logout
  categories: 30 * 60 * 1000, // 30 minutes
  dashboard: 5 * 60 * 1000, // 5 minutes
  transactions: 1 * 60 * 1000, // 1 minute
  budgets: 30 * 1000, // 30 seconds (near real-time)
};
```

### Optimistic Updates
```typescript
const addTransaction = useMutation({
  mutationFn: createTransaction,
  onMutate: async (newTransaction) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['transactions'] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['transactions']);
    
    // Optimistically update
    queryClient.setQueryData(['transactions'], (old) => [
      newTransaction,
      ...old,
    ]);
    
    return { previous };
  },
  onError: (err, newTransaction, context) => {
    // Rollback on error
    queryClient.setQueryData(['transactions'], context.previous);
    toast.error('Failed to add transaction');
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  },
});
```

## Error Handling

### User-Friendly Messages
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Can't connect to server. Please check your connection.",
  AUTH_EXPIRED: "Your session expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  BUDGET_EXCEEDED: "This transaction would exceed your budget limit.",
  DUPLICATE_CATEGORY: "A category with this name already exists.",
  GENERIC: "Something went wrong. Please try again.",
};

// Global error handler
const handleApiError = (error: AxiosError) => {
  const code = error.response?.data?.code;
  const message = ERROR_MESSAGES[code] || ERROR_MESSAGES.GENERIC;
  toast.error(message);
};
```

## Testing Requirements

### Unit Test Coverage
- **Components**: 80% coverage
- **Hooks**: 90% coverage
- **Utils**: 100% coverage

### Key Test Scenarios
1. **Authentication**: Login, logout, token refresh
2. **Transaction Form**: Validation, submission, error handling
3. **Dashboard**: Data loading, error states, refresh
4. **Budget Alerts**: Threshold detection, notifications
5. **API Client**: Interceptors, retry logic

### E2E Test Flows (Playwright)
```typescript
// e2e/critical-path.spec.ts
test('User can add transaction and see budget update', async ({ page }) => {
  // Login
  await page.goto('/');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
  
  // Add transaction
  await page.click('[data-testid="add-transaction"]');
  await page.fill('[data-testid="amount-input"]', '50.00');
  await page.selectOption('[data-testid="category-select"]', 'food');
  await page.click('[data-testid="submit-button"]');
  
  // Verify budget updated
  await expect(page.locator('[data-testid="food-budget-progress"]'))
    .toContainText('$450/$500');
});
```

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Lighthouse score > 90
- [ ] Bundle size < 200KB (initial)
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Analytics configured (optional)

### Post-deployment
- [ ] Auth0 callback URLs updated
- [ ] API endpoints verified
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing done
- [ ] Performance monitoring active

## Future Enhancements (Post-MVP)

### Phase 2
- CSV export
- Bulk transaction operations
- Advanced filtering
- Dark mode
- Receipt photo upload

### Phase 3
- Offline support (PWA)
- Real-time sync
- Collaborative budgets
- Spending predictions
- Mobile app (React Native)

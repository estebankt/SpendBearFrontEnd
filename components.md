# Component Library - SpendBear MVP

## Component Architecture

### Principles
- **Composable**: Small, single-purpose components
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Memoized where appropriate
- **Typed**: Full TypeScript coverage
- **Testable**: Props-driven, pure functions where possible

### File Structure
```typescript
// Component file structure
components/
  ComponentName/
    ComponentName.tsx       // Main component
    ComponentName.test.tsx  // Tests
    ComponentName.stories.tsx // Storybook (future)
    index.ts               // Barrel export
```

## Core Components

### Form Components

#### CurrencyInput
Formats currency as user types with proper decimal handling.

```typescript
// components/ui/CurrencyInput.tsx
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  max?: number;
  autoFocus?: boolean;
}

// Usage
<CurrencyInput
  value={amount}
  onChange={setAmount}
  currency="USD"
  placeholder="0.00"
  error={errors.amount}
  autoFocus
/>

// Features:
- Auto-format as user types (1234 → $1,234.00)
- Handle decimal input
- Prevent non-numeric input
- Support paste events
- Mobile number pad trigger
- Max value validation
```

#### CategorySelect
Dropdown with icons and search functionality.

```typescript
// components/ui/CategorySelect.tsx
interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  categories: Category[];
  placeholder?: string;
  error?: string;
  showRecent?: boolean;
  allowCreate?: boolean;
}

// Usage
<CategorySelect
  value={categoryId}
  onChange={setCategoryId}
  categories={categories}
  showRecent={true}
  placeholder="Select category"
/>

// Features:
- Icon display
- Search/filter
- Recent items first
- Create new option
- Keyboard navigation
- Mobile-optimized overlay
```

#### DateInput
Date picker with quick presets.

```typescript
// components/ui/DateInput.tsx
interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  error?: string;
  presets?: DatePreset[];
}

// Usage
<DateInput
  value={date}
  onChange={setDate}
  max={new Date()}
  presets={[
    { label: 'Today', value: new Date() },
    { label: 'Yesterday', value: subDays(new Date(), 1) }
  ]}
/>

// Features:
- Calendar popup
- Quick preset buttons
- Mobile-native date input fallback
- Keyboard shortcuts
- Relative date display
```

### Display Components

#### TransactionItem
List item for transaction display.

```typescript
// components/features/transactions/TransactionItem.tsx
interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  onDelete?: () => void;
  showDate?: boolean;
  compact?: boolean;
}

// Usage
<TransactionItem
  transaction={transaction}
  onClick={() => setSelectedTransaction(transaction)}
  showDate={!isToday(transaction.date)}
/>

// Render example:
┌─────────────────────────────────────┐
│ 🍔 Food & Dining        $45.99     │
│ Starbucks • 2 hours ago            │
└─────────────────────────────────────┘

// Features:
- Category icon
- Formatted amount
- Relative time
- Swipe to delete (mobile)
- Click for details
- Loading state
```

#### BudgetCard
Visual budget status display.

```typescript
// components/features/budgets/BudgetCard.tsx
interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
  showActions?: boolean;
  animate?: boolean;
}

// Usage
<BudgetCard
  budget={budget}
  onClick={() => router.push(`/budgets/${budget.id}`)}
  animate={true}
/>

// Render example:
┌─────────────────────────────────────┐
│ 🍔 Food & Dining                    │
│ $400 of $500                       │
│ ████████████░░░░░░ 80%             │
│ $100 remaining • 2 days left       │
└─────────────────────────────────────┘

// Features:
- Progress bar with animation
- Color coding (green/yellow/red)
- Percentage display
- Time remaining
- Quick edit action
```

#### StatCard
Dashboard metric display.

```typescript
// components/ui/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

// Usage
<StatCard
  label="This Month"
  value="$1,234.56"
  change={{ value: -12, type: 'decrease' }}
  icon={<WalletIcon />}
/>

// Render example:
┌─────────────────────────────────────┐
│ 💰 This Month                       │
│ $1,234.56                          │
│ ↓ 12% from last month              │
└─────────────────────────────────────┘
```

### Chart Components

#### SpendingChart
Wrapper for Chart.js spending visualizations.

```typescript
// components/features/dashboard/SpendingChart.tsx
interface SpendingChartProps {
  data: ChartData;
  type: 'line' | 'bar' | 'pie';
  height?: number;
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: string) => void;
}

// Usage
<SpendingChart
  data={monthlyData}
  type="line"
  period="30d"
  onPeriodChange={setPeriod}
/>

// Features:
- Responsive sizing
- Touch interactions
- Legend toggle
- Period selector
- Loading skeleton
- Empty state
```

### Navigation Components

#### NavigationBar
Desktop navigation header.

```typescript
// components/shared/NavigationBar.tsx
interface NavigationBarProps {
  user: User;
  activeRoute: string;
}

// Usage
<NavigationBar
  user={currentUser}
  activeRoute="/dashboard"
/>

// Render example:
┌─────────────────────────────────────┐
│ 🐻 SpendBear   Dashboard Budgets   │
│                          👤 Mario   │
└─────────────────────────────────────┘

// Features:
- Active route highlighting
- User menu dropdown
- Quick add button
- Responsive collapse
```

#### MobileNav
Bottom tab navigation for mobile.

```typescript
// components/shared/MobileNav.tsx
interface MobileNavProps {
  activeRoute: string;
}

// Usage
<MobileNav activeRoute="/dashboard" />

// Render example:
┌─────────────────────────────────────┐
│   📊      💳      [+]     💰      ⚙️  │
│ Home  Transactions   Budgets Settings│
└─────────────────────────────────────┘

// Features:
- Fixed bottom position
- Active state indication
- Center FAB for quick add
- Badge notifications
- Safe area insets
```

### Feedback Components

#### Toast
Notification system using react-hot-toast.

```typescript
// lib/utils/toast.ts
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: 3000,
      icon: '✅',
      ...options,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: 5000,
      icon: '❌',
      ...options,
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// Usage
showToast.success('Transaction added successfully');
showToast.promise(
  createTransaction(data),
  {
    loading: 'Adding transaction...',
    success: 'Transaction added!',
    error: 'Failed to add transaction',
  }
);
```

#### LoadingSpinner
Consistent loading indicator.

```typescript
// components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  label?: string;
}

// Usage
<LoadingSpinner size="lg" fullScreen label="Loading dashboard..." />

// Variants:
- Inline: <LoadingSpinner size="sm" />
- Overlay: <LoadingSpinner fullScreen />
- With text: <LoadingSpinner label="Loading..." />
```

#### Skeleton
Loading placeholder for content.

```typescript
// components/ui/Skeleton.tsx
interface SkeletonProps {
  variant?: 'text' | 'card' | 'chart' | 'list';
  count?: number;
  height?: number | string;
}

// Usage
<Skeleton variant="card" count={3} />

// Presets:
<TransactionSkeleton /> // Transaction list skeleton
<BudgetCardSkeleton />  // Budget card skeleton
<ChartSkeleton />       // Chart loading state
<DashboardSkeleton />   // Full dashboard skeleton
```

#### EmptyState
Placeholder for empty data.

```typescript
// components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Usage
<EmptyState
  icon={<WalletIcon />}
  title="No transactions yet"
  description="Start tracking your expenses"
  action={{
    label: "Add Transaction",
    onClick: () => setShowAddModal(true)
  }}
/>
```

### Modal Components

#### Modal
Base modal component using Radix UI Dialog.

```typescript
// components/ui/Modal.tsx
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

// Usage
<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Add Transaction"
  size="md"
>
  <TransactionForm onSubmit={handleSubmit} />
</Modal>
```

#### ConfirmDialog
Confirmation dialog for destructive actions.

```typescript
// components/ui/ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'danger' | 'warning' | 'info';
}

// Usage
<ConfirmDialog
  open={showDelete}
  onOpenChange={setShowDelete}
  title="Delete Transaction?"
  description="This action cannot be undone."
  onConfirm={handleDelete}
  variant="danger"
/>
```

## Composite Components

### TransactionForm
Complete form for adding/editing transactions.

```typescript
// components/features/transactions/TransactionForm.tsx
interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionInput) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
}

// Features:
- All form fields integrated
- Validation with error display
- Loading state during submit
- Draft persistence
- Keyboard shortcuts (Cmd+Enter to submit)
```

### DashboardGrid
Responsive grid layout for dashboard widgets.

```typescript
// components/features/dashboard/DashboardGrid.tsx
interface DashboardGridProps {
  children: React.ReactNode;
}

// Responsive breakpoints:
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns with sidebar

// Usage
<DashboardGrid>
  <StatCard />
  <BudgetList />
  <SpendingChart />
  <RecentTransactions />
</DashboardGrid>
```

### QuickAddButton
Floating action button for mobile, header button for desktop.

```typescript
// components/features/transactions/QuickAddButton.tsx
interface QuickAddButtonProps {
  onClick: () => void;
  isMobile?: boolean;
}

// Mobile: Fixed position bottom-right
// Desktop: In header navigation
// Features:
- Prominent CTA
- Tooltip on hover
- Keyboard shortcut (Cmd+N)
- Animation on appear
```

## Hooks

### Data Fetching Hooks

```typescript
// lib/hooks/useTransactions.ts
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => api.transactions.list(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.transactions.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboard']);
      showToast.success('Transaction added');
    },
  });
}
```

### UI Hooks

```typescript
// lib/hooks/useMediaQuery.ts
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 640px)');
```

## Utility Functions

### Formatters

```typescript
// lib/utils/formatters.ts

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return format(date, 'MMM d');
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
```

### Validators

```typescript
// lib/utils/validators.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount too large'),
  categoryId: z.string().uuid('Invalid category'),
  date: z.date().max(new Date(), 'Date cannot be in future'),
  merchant: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const budgetSchema = z.object({
  name: z.string().min(1).max(50),
  limit: z.number().positive().max(1000000),
  periodType: z.enum(['monthly', 'weekly', 'custom']),
  categoryId: z.string().uuid().optional(),
});
```

## Styling Guidelines

### Color Palette

```css
/* styles/globals.css */
:root {
  /* Primary */
  --color-primary: #2563eb; /* Blue */
  --color-primary-hover: #1d4ed8;
  
  /* Status */
  --color-success: #10b981; /* Green */
  --color-warning: #f59e0b; /* Yellow */
  --color-danger: #ef4444; /* Red */
  
  /* Grays */
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
}
```

### Component Styling Pattern

```typescript
// Use Tailwind with cn() utility for conditional classes
import { cn } from '@/lib/utils';

<button
  className={cn(
    "px-4 py-2 rounded-lg font-medium transition-colors",
    "bg-primary text-white hover:bg-primary-hover",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )}
/>
```

### Animation Guidelines

```typescript
// Use Framer Motion for complex animations
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>

// Use CSS for simple transitions
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Testing Patterns

### Component Testing

```typescript
// components/ui/CurrencyInput.test.tsx
describe('CurrencyInput', () => {
  it('formats value as currency', () => {
    render(
      <CurrencyInput
        value={1234.56}
        onChange={jest.fn()}
        currency="USD"
      />
    );
    
    expect(screen.getByDisplayValue('$1,234.56')).toBeInTheDocument();
  });
  
  it('calls onChange with numeric value', () => {
    const handleChange = jest.fn();
    render(<CurrencyInput value={0} onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.45' } });
    
    expect(handleChange).toHaveBeenCalledWith(123.45);
  });
});
```

## Accessibility Checklist

- [ ] All interactive elements have keyboard support
- [ ] Focus indicators visible and clear
- [ ] ARIA labels for icon buttons
- [ ] Form fields have associated labels
- [ ] Error messages linked to fields
- [ ] Color not sole indicator of state
- [ ] Contrast ratios meet WCAG AA
- [ ] Screen reader announcements for dynamic content
- [ ] Skip navigation link
- [ ] Semantic HTML structure

## Performance Checklist

- [ ] Components memoized where appropriate
- [ ] Event handlers use useCallback
- [ ] Heavy computations use useMemo
- [ ] Images lazy loaded
- [ ] Code split at route level
- [ ] Virtual scrolling for long lists
- [ ] Debounced search inputs
- [ ] Optimistic UI updates
- [ ] Skeleton screens for loading

Last Updated: 2024-11-29

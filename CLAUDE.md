# SpendBear Frontend - Claude Code Context

## Project Overview

SpendBear Frontend is a Next.js 15 application providing a clean, fast interface for personal finance management. This file provides context for Claude Code CLI to assist with development.

## Current Status
- **Phase**: MVP Development (Starting Fresh)
- **Backend**: Stable, running on `http://localhost:5109`
- **Priority**: Auth → Transactions → Budgets → Dashboard → Analytics

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| State | Zustand (UI) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Auth | Auth0 (`@auth0/nextjs-auth0`) |
| HTTP | Axios with interceptors |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Toasts | Sonner |
| Animations | Framer Motion |

---

## API Reference (v1.json)

Backend base URL: `http://localhost:5109`  
Auth: Bearer JWT token from Auth0

### Identity Endpoints

```typescript
// Register new user (call on first login)
POST /api/identity/register
Request: {
  email: string;      // Required
  firstName: string;  // Required  
  lastName: string;   // Required
}
Response: 200 OK

// Get current user profile
GET /api/identity/me
Response: User profile object
```

### Transaction Endpoints

```typescript
// List transactions (paginated)
GET /api/spending/transactions
Query params:
  - startDate?: string (ISO datetime)
  - endDate?: string (ISO datetime)
  - categoryId?: string (UUID)
  - type?: 0 | 1 (0=Income, 1=Expense)
  - pageNumber?: number (default: 1)
  - pageSize?: number (default: 50, max: 100)
Response: Paginated list of transactions

// Create transaction
POST /api/spending/transactions
Request: {
  amount: number;       // Required, positive
  currency: string;     // Required, e.g., "USD"
  date: string;         // Required, ISO datetime
  description: string;  // Required
  categoryId: string;   // Required, UUID
  type: 0 | 1;          // Required, 0=Income, 1=Expense
}
Response: Created transaction

// Update transaction
PUT /api/spending/transactions/{id}
Request: Same as create
Response: 200 OK

// Delete transaction
DELETE /api/spending/transactions/{id}
Response: 200 OK (no content)
```

### Category Endpoints

```typescript
// List all categories
GET /api/spending/categories
Response: Array of categories
  - Includes system categories (isSystemCategory: true) - read-only
  - Includes user categories (isSystemCategory: false)
  - Sorted: system first, then user, alphabetically

// Create custom category
POST /api/spending/categories
Request: {
  name: string;         // Required, unique, not matching system category
  description?: string; // Optional
}
Response: Created category
```

### Budget Endpoints

```typescript
// List budgets
GET /api/budgets
Query params:
  - activeOnly?: boolean (default: false)
  - categoryId?: string (UUID, null for global)
  - date?: string (ISO datetime, filter budgets active on this date)
Response: Array of budgets

// Create budget
POST /api/budgets
Request: {
  name: string;             // Required
  amount: number;           // Required
  currency: string;         // Required
  period: 0 | 1 | 2;        // Required, 0=Monthly, 1=Weekly, 2=Custom
  startDate: string;        // Required, ISO datetime
  categoryId?: string;      // Optional UUID, null for global budget
  warningThreshold?: number; // Optional, default: 80 (percentage)
}
Response: Created budget

// Update budget
PUT /api/budgets/{id}
Request: {
  name: string;
  amount: number;
  period: 0 | 1 | 2;
  startDate: string;
  categoryId?: string;
  warningThreshold: number;
}
Response: 200 OK

// Delete budget  
DELETE /api/budgets/{id}
Response: 200 OK (no content)
```

### Analytics Endpoints

```typescript
// Monthly financial summary
GET /api/analytics/summary/monthly
Query params:
  - year: number (2000-2100)
  - month: number (1-12)
Response: {
  periodStart: string;        // Date
  periodEnd: string;          // Date
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  spendingByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}
```

### Notification Endpoints

```typescript
// List notifications
GET /api/notifications
Query params:
  - status?: NotificationStatus
  - type?: NotificationType
  - unreadOnly?: boolean (default: false)
  - pageNumber?: number (default: 1)
  - pageSize?: number (default: 50)
Response: Paginated list of notifications

// Mark notification as read
PUT /api/notifications/{id}/read
Response: 200 OK (no content)
```

### Enums

```typescript
// TransactionType
enum TransactionType {
  Income = 0,
  Expense = 1
}

// BudgetPeriod
enum BudgetPeriod {
  Monthly = 0,
  Weekly = 1,
  Custom = 2
}

// NotificationStatus
enum NotificationStatus {
  Pending = 0,
  Read = 1,
  Dismissed = 2
}

// NotificationType (examples)
enum NotificationType {
  BudgetWarning = 0,
  BudgetExceeded = 1,
  // ... other types
}
```


## Key Implementation Patterns

### API Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor - add token from Auth0
apiClient.interceptors.request.use(async (config) => {
  // Get token from Auth0 session
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/api/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### React Query Hooks Pattern

```typescript
// lib/hooks/use-transactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '@/lib/api/endpoints';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionApi.list(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
```

### Zod Validation Schemas

```typescript
// lib/utils/validators.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  date: z.date().max(new Date(), 'Date cannot be in the future'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid('Please select a category'),
  type: z.number().min(0).max(1),
});

export const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  period: z.number().min(0).max(2),
  startDate: z.date(),
  categoryId: z.string().uuid().nullable(),
  warningThreshold: z.number().min(1).max(100).default(80),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
```

### Auth0 Protected Routes

```typescript
// app/(dashboard)/layout.tsx
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={session.user} />
      <main>{children}</main>
      <MobileNav />
    </div>
  );
}
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5109

# Auth0
AUTH0_SECRET='[generate-32-char-secret]'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://[your-tenant].auth0.com'
AUTH0_CLIENT_ID='[your-client-id]'
AUTH0_CLIENT_SECRET='[your-client-secret]'
AUTH0_AUDIENCE='https://api.spendbear.com'
AUTH0_SCOPE='openid profile email'
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test
npm run test:watch
```

---

## Component Guidelines

### Mobile-First Responsive
- Design for 320px width first
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Touch targets: minimum 44x44px

### Loading States
- Always show skeleton or spinner during data fetch
- Use `<Suspense>` with loading.tsx where appropriate
- Optimistic updates for mutations

### Error Handling
- Display user-friendly error messages
- Use toast for transient errors
- Use inline errors for form validation
- Fallback UI for component-level errors

### Accessibility
- All images have alt text
- Form fields have labels
- Interactive elements are keyboard accessible
- Focus management for modals

---

## References

- [API OpenAPI Spec](./api-v1.json)
- [PRD](./PRD.md)
- [Planning](./PLANNING.md)
- [Tasks](./TASKS.md)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [TanStack Query Docs](https://tanstack.com/query/latest)

# SpendBear Frontend - Claude Code Context

## Frontend Overview
A modern, responsive web application built with Next.js 15 to provide a clean interface for the SpendBear personal finance management system. Focus is on MVP functionality to validate core backend features.

## Current Context
- **Phase**: MVP Frontend Development
- **Priority**: Core user flows (Auth → Add Transaction → View Budget → Dashboard)
- **Design Philosophy**: Mobile-first, minimalist, fast
- **Backend Integration**: API-first, real-time updates where critical

## Tech Stack

### Core Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 19** (via Next.js)
- **Tailwind CSS** for styling
- **Shadcn/ui** for component library

### State Management
- **Zustand** for global state (simple, lightweight)
- **React Query (TanStack Query)** for server state
- **React Hook Form** for form management
- **Zod** for validation

### API & Auth
- **Auth0 Next.js SDK** (@auth0/nextjs-auth0)
- **Axios** for API calls with interceptors
- **SWR** or React Query for data fetching

### UI Libraries
- **Chart.js** with react-chartjs-2 for analytics
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Development Tools
- **ESLint** with Next.js config
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** & **React Testing Library** for tests

## Project Structure

```
/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/              # Auth group routes
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/         # Protected routes
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── page.tsx         # Dashboard home
│   │   ├── transactions/
│   │   ├── budgets/
│   │   └── settings/
│   ├── api/                 # API routes (Auth0)
│   │   └── auth/[...auth0]/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── features/            # Feature-specific components
│   │   ├── transactions/
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── QuickAdd.tsx
│   │   ├── budgets/
│   │   │   ├── BudgetCard.tsx
│   │   │   └── BudgetProgress.tsx
│   │   └── dashboard/
│   │       ├── SpendingChart.tsx
│   │       └── RecentActivity.tsx
│   └── shared/              # Shared components
│       ├── Navigation.tsx
│       ├── MobileNav.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── api/                 # API client setup
│   │   ├── client.ts        # Axios instance
│   │   └── endpoints.ts     # API endpoints
│   ├── hooks/               # Custom hooks
│   │   ├── useTransactions.ts
│   │   ├── useBudgets.ts
│   │   └── useUser.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Currency, date formatting
│   │   └── validators.ts    # Zod schemas
│   └── stores/              # Zustand stores
│       └── app.store.ts
├── styles/
│   └── globals.css          # Tailwind imports
└── types/
    ├── api.types.ts         # API response types
    └── app.types.ts         # Application types
```

## MVP Features Implementation

### 1. Authentication Flow
```typescript
// Using Auth0 Next.js SDK
// app/api/auth/[...auth0]/route.ts
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();

// Protected page example
// app/(dashboard)/layout.tsx
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function Layout({ children }) {
  // Layout code
});
```

### 2. Quick Transaction Entry
```typescript
// Priority: Make it FAST (< 2 taps/clicks)
// components/features/transactions/QuickAdd.tsx
- Amount input with number pad UI
- Recent categories for quick selection
- Auto-fill today's date
- Submit → Toast confirmation → Reset form
```

### 3. Dashboard Overview
```typescript
// Real-time updates for critical data
// app/(dashboard)/page.tsx
- Current month spending (cached, 5min TTL)
- Active budget status (real-time)
- Recent 5 transactions
- Quick add button (floating on mobile)
```

### 4. Budget Monitoring
```typescript
// Visual indicators for budget health
// components/features/budgets/BudgetProgress.tsx
- Progress bar with color coding (green/yellow/red)
- Remaining amount prominent
- Days left in period
- Click for detailed view
```

## API Integration Pattern

```typescript
// lib/api/client.ts
import axios from 'axios';
import { getAccessToken } from '@auth0/nextjs-auth0';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001/api/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const { accessToken } = await getAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/api/auth/login';
    }
    return Promise.reject(error);
  }
);
```

## State Management Strategy

```typescript
// lib/stores/app.store.ts
import { create } from 'zustand';

interface AppState {
  // UI State
  isMobileNavOpen: boolean;
  activeView: 'dashboard' | 'transactions' | 'budgets';
  
  // Cached Data (use React Query for server state)
  selectedCategory: string | null;
  dateRange: { start: Date; end: Date };
  
  // Actions
  toggleMobileNav: () => void;
  setActiveView: (view: string) => void;
}

// Use React Query for server state
// lib/hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## UI/UX Guidelines

### Design Principles
1. **Speed First** - Optimize for quick data entry
2. **Mobile Primary** - Touch-friendly, thumb-reachable
3. **Progressive Disclosure** - Show essential info first
4. **Instant Feedback** - Loading states, optimistic updates
5. **Forgiving** - Easy undo, clear error messages

### Component Patterns
```typescript
// Consistent loading states
<LoadingSpinner size="sm" /> // inline
<SkeletonCard /> // for cards
<LoadingOverlay /> // for sections

// Consistent error handling
<ErrorBoundary fallback={<ErrorCard />}>
  <Component />
</ErrorBoundary>

// Consistent empty states
<EmptyState
  icon={<WalletIcon />}
  title="No transactions yet"
  description="Start tracking your expenses"
  action={<Button>Add Transaction</Button>}
/>
```

### Responsive Breakpoints
```css
/* Tailwind defaults */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Wide desktop */
```

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const ChartComponent = dynamic(() => import('./SpendingChart'), {
  loading: () => <SkeletonChart />,
  ssr: false,
});
```

### Data Fetching Strategy
- **SSG** for landing page
- **SSR** for initial dashboard load (with cache)
- **CSR** for interactive features
- **SWR/React Query** for client-side caching

### Bundle Size Management
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/TransactionForm.test.tsx
- Form validation
- Currency formatting
- Date selection
```

### Integration Tests
```typescript
// __tests__/api/transactions.test.ts
- API client interceptors
- Error handling
- Auth flow
```

### E2E Tests (Playwright)
```typescript
// e2e/add-transaction.spec.ts
- Complete transaction flow
- Budget threshold alerts
- Data persistence
```

## Environment Configuration

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:7001/api/v1
AUTH0_SECRET='use-a-long-random-string'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://spendbear.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
AUTH0_AUDIENCE='https://api.spendbear.com'
AUTH0_SCOPE='openid profile email'

# Analytics (optional for MVP)
NEXT_PUBLIC_GA_ID='G-XXXXXXXXXX'
```

## Development Workflow

### Commands
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:e2e     # Run E2E tests

# Code quality
npm run format       # Run Prettier
npm run type-check   # TypeScript check
```

### Git Hooks (Husky)
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Deployment

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Performance Budget
- **First Load JS**: < 100kB
- **TTI**: < 3.8s
- **FCP**: < 1.8s
- **CLS**: < 0.1
- **Lighthouse Score**: > 90

## Known Constraints
- **No offline support** in MVP (add PWA later)
- **No real-time updates** except budget alerts
- **English only** initially
- **Desktop-responsive** but mobile-optimized

## Session Notes
_Add development notes here_

## Current Focus Areas
1. Complete Auth0 integration
2. Build transaction entry form
3. Create dashboard with spending chart
4. Implement budget status cards
5. Add responsive navigation

## References
- [Backend API Docs](../docs/api.md) (if exists in parent directory)
- [Tasks](./tasks.md)
- [UI Components](./components.md)
- [Project Setup](./PROJECT_SETUP.md)
- [Figma Designs](https://figma.com/spendbear-mvp)

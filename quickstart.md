# Frontend Quick Start Guide - SpendBear MVP

## Prerequisites

Ensure you have:
- Node.js 18+ installed
- Backend API running on http://localhost:7001
- Auth0 account created
- Git repository cloned

## Step 1: Project Setup (15 minutes)

### Initialize Next.js Project
```bash
# From repository root
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir=false

# Navigate to frontend
cd frontend

# Open in VS Code
code .
```

### Install Core Dependencies
```bash
# Essential packages for MVP
npm install \
  @auth0/nextjs-auth0 \
  axios \
  @tanstack/react-query \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  react-hot-toast \
  lucide-react \
  date-fns \
  clsx \
  tailwind-merge

# Dev dependencies
npm install -D \
  @types/node \
  @types/react \
  prettier \
  eslint-config-prettier
```

## Step 2: Auth0 Configuration (20 minutes)

### Create Auth0 Application
1. Login to Auth0 Dashboard
2. Create new Application → Single Page Application
3. Configure settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### Setup Environment Variables
```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Auth0
AUTH0_SECRET='LONG_RANDOM_STRING_MIN_32_CHARS'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
AUTH0_AUDIENCE='https://api.spendbear.com'
AUTH0_SCOPE='openid profile email'

# API
NEXT_PUBLIC_API_URL='http://localhost:7001/api/v1'

# App
NEXT_PUBLIC_APP_NAME='SpendBear'
NEXT_PUBLIC_APP_URL='http://localhost:3000'
EOF
```

### Create Auth Route Handler
```typescript
// app/api/auth/[...auth0]/route.ts
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

const afterCallback = async (req: any, session: any) => {
  // Optional: Sync user with backend
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        auth0UserId: session.user.sub,
        email: session.user.email,
        displayName: session.user.name,
      }),
    });
  } catch (error) {
    console.error('User sync failed:', error);
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
```

## Step 3: Project Structure Setup (10 minutes)

### Create Folder Structure
```bash
# Create essential directories
mkdir -p {components,lib,types,styles}
mkdir -p components/{ui,features,shared}
mkdir -p components/features/{transactions,budgets,dashboard}
mkdir -p lib/{api,hooks,utils,stores}
```

### Setup Tailwind Config
```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
```

## Step 4: Core Components (30 minutes)

### Setup API Client
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from Auth0 in server components
    // For client components, token is in cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/api/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Create Layout Components
```typescript
// app/layout.tsx
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}
```

### Create Dashboard Layout
```typescript
// app/(dashboard)/layout.tsx
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Navigation from '@/components/shared/Navigation';

export default withPageAuthRequired(
  async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    );
  }
);
```

## Step 5: Quick MVP Pages (20 minutes)

### Landing Page
```typescript
// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to SpendBear 🐻
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track spending, tame your budget
        </p>
        <Link
          href="/api/auth/login"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-hover"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
```

### Dashboard Page
```typescript
// app/(dashboard)/page.tsx
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user?.name}!
      </h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">This Month</p>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Transactions</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Active Budgets</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover md:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
```

### Quick Transaction Form
```typescript
// components/features/transactions/QuickAddForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string(),
  merchant: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuickAddForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // API call here
      console.log('Submitting:', data);
      toast.success('Transaction added!');
      onClose();
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Amount
        </label>
        <input
          {...register('amount')}
          type="number"
          step="0.01"
          placeholder="0.00"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          {...register('categoryId')}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select category</option>
          <option value="food">🍔 Food & Dining</option>
          <option value="transport">🚗 Transportation</option>
          <option value="shopping">🛍️ Shopping</option>
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          {...register('date')}
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Merchant (Optional)
        </label>
        <input
          {...register('merchant')}
          type="text"
          placeholder="e.g., Starbucks"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
```

## Step 6: Run and Test (5 minutes)

### Start Development Server
```bash
# Terminal 1: Start backend (from backend directory)
dotnet run --project src/Api/SpendBear.Api

# Terminal 2: Start frontend (from frontend directory)
npm run dev
```

### Test Authentication Flow
1. Navigate to http://localhost:3000
2. Click "Get Started"
3. Login with Auth0
4. Verify redirect to dashboard
5. Check user name displays

### Test Quick Add Form
1. Click the + button (mobile) or Add Transaction (desktop)
2. Fill in the form
3. Submit and check console for output
4. Verify toast notification appears

## Step 7: Connect to Backend API

### Create API Hooks
```typescript
// lib/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => 
      apiClient.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiClient.get('/transactions'),
  });
}
```

### Setup React Query Provider
```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </UserProvider>
  );
}

// Update app/layout.tsx to use Providers
```

## Common Issues & Solutions

### CORS Errors
```csharp
// In your .NET API Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### Auth0 Token Not Found
```typescript
// For API routes (server-side)
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET() {
  const { accessToken } = await getAccessToken();
  // Use token for API calls
}
```

### TypeScript Errors
```bash
# Generate types from API
npx openapi-typescript http://localhost:7001/swagger/v1/swagger.json -o types/api.ts
```

## Next Steps

1. **Complete Authentication**
   - Add logout functionality
   - Handle token refresh
   - Add user profile page

2. **Build Core Features**
   - Complete transaction CRUD
   - Add budget management
   - Create dashboard widgets

3. **Polish UI**
   - Add loading states
   - Implement error boundaries
   - Add animations

4. **Testing**
   - Add component tests
   - Setup E2E tests
   - Test on mobile devices

5. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

## Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run linting
npm run format        # Format code

# Testing
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

# Type checking
npm run type-check    # Check TypeScript
```

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Auth0 Next.js Guide](https://auth0.com/docs/quickstart/webapp/nextjs)
- [React Query Docs](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)

---

**Congratulations!** 🎉 You now have a working MVP frontend for SpendBear. This setup provides:
- ✅ Authentication with Auth0
- ✅ Protected routes
- ✅ Basic dashboard
- ✅ Transaction form
- ✅ API integration ready
- ✅ Responsive design
- ✅ TypeScript support

Continue building features from the [tasks.md](./tasks.md) file.

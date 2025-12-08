# SpendBear Frontend - Planning Document

## Vision

### Mission Statement
Create the fastest, most intuitive personal finance tracking experience that makes expense logging feel effortless and budget awareness automatic.

### Core Principles

1. **Speed First**
   - Transaction entry in < 2 seconds
   - Dashboard loads instantly (cached)
   - No unnecessary animations blocking interaction

2. **Mobile Primary**
   - Designed for thumb-reachable interaction
   - Touch-optimized inputs (44px minimum targets)
   - Works offline-first in future phases

3. **Progressive Disclosure**
   - Essential information visible first
   - Details available on demand
   - No overwhelming data density

4. **Instant Feedback**
   - Optimistic UI updates
   - Clear loading and success states
   - Undo capability for destructive actions

5. **Forgiving Design**
   - Easy to correct mistakes
   - Clear error messages with recovery paths
   - Draft persistence for forms

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js App Router                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │  Pages   │  │  Layouts │  │   API    │  │ Middleware│ │   │
│  │  │ (RSC/CSR)│  │  (Shell) │  │ Routes   │  │ (Auth)   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │                     State Layer                            │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐  │ │
│  │  │   Zustand   │    │ TanStack    │    │  React Hook  │  │ │
│  │  │ (UI State)  │    │   Query     │    │    Form      │  │ │
│  │  │             │    │ (Server)    │    │  (Forms)     │  │ │
│  │  └─────────────┘    └─────────────┘    └──────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │                   Component Layer                          │ │
│  │  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐   │ │
│  │  │ Shadcn/ui│  │   Feature    │  │  Shared/Layout    │   │ │
│  │  │  (Base)  │  │  Components  │  │   Components      │   │ │
│  │  └──────────┘  └──────────────┘  └───────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Auth0                                    │
│              (Authentication & Token Management)                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SpendBear Backend API                        │
│                   (http://localhost:5109)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Identity │  │ Spending │  │ Budgets  │  │  Analytics   │   │
│  │  Module  │  │  Module  │  │  Module  │  │   Module     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → React Hook Form (validation)
                                       │
                                       ▼
                              TanStack Query Mutation
                                       │
                         ┌─────────────┼─────────────┐
                         ▼             │             ▼
                Optimistic Update   API Call    Error Handler
                  (Cache)         (Axios)      (Toast/Inline)
                         │             │
                         │             ▼
                         │      Backend API
                         │             │
                         │             ▼
                         └────► Cache Invalidation
                                       │
                                       ▼
                               UI Re-render
```

### Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     Authentication Flow                       │
└──────────────────────────────────────────────────────────────┘

1. Initial Visit (Unauthenticated)
   Landing Page → Click "Get Started" → Auth0 Login

2. Auth0 Redirect
   Auth0 → /api/auth/callback → Session Cookie Set

3. First-Time User
   Callback → Check /api/identity/me → 404 → Register User
   → POST /api/identity/register → Redirect to Dashboard

4. Returning User
   Callback → Check /api/identity/me → 200 → Dashboard

5. Token Refresh
   API 401 → Auth0 Token Refresh → Retry Request
   │
   └─► If refresh fails → Redirect to Login

6. Logout
   User Menu → /api/auth/logout → Clear Session → Landing
```

---

## Technology Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.x | React framework with App Router |
| `react` | 19.x | UI library |
| `typescript` | 5.x | Type safety |

### Styling & UI

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.x | Utility-first CSS |
| `@shadcn/ui` | latest | Accessible component primitives |
| `lucide-react` | latest | Icon library |
| `framer-motion` | latest | Animations |
| `clsx` + `tailwind-merge` | latest | Conditional classes |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | 5.x | Client UI state |
| `@tanstack/react-query` | 5.x | Server state & caching |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.x | Form state management |
| `@hookform/resolvers` | latest | Zod integration |
| `zod` | 3.x | Schema validation |

### Authentication

| Package | Version | Purpose |
|---------|---------|---------|
| `@auth0/nextjs-auth0` | 3.x | Auth0 SDK for Next.js |

### HTTP Client

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | 1.x | HTTP client with interceptors |

### Data Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| `chart.js` | 4.x | Charting library |
| `react-chartjs-2` | 5.x | React wrapper |
| `date-fns` | 3.x | Date manipulation |

### Notifications

| Package | Version | Purpose |
|---------|---------|---------|
| `sonner` | latest | Toast notifications |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | 9.x | Code linting |
| `eslint-config-next` | latest | Next.js ESLint rules |
| `prettier` | 3.x | Code formatting |
| `prettier-plugin-tailwindcss` | latest | Tailwind class sorting |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| `jest` | 29.x | Test runner |
| `@testing-library/react` | latest | React testing utilities |
| `@testing-library/jest-dom` | latest | DOM assertions |
| `msw` | 2.x | API mocking |

---

## Required Tools & Setup

### Development Environment

```bash
# Required
- Node.js >= 20.x (LTS)
- npm >= 10.x or pnpm >= 8.x
- Git

# Recommended
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Toolkit
  - GitLens
```

### External Services

| Service | Purpose | Setup |
|---------|---------|-------|
| Auth0 | Authentication | Create free tenant at auth0.com |
| Vercel | Deployment | Connect GitHub repo |

### Auth0 Configuration

```
1. Create Application (Regular Web Application)
   - Allowed Callback URLs: http://localhost:3000/api/auth/callback
   - Allowed Logout URLs: http://localhost:3000
   - Allowed Web Origins: http://localhost:3000

2. Create API
   - Identifier: https://api.spendbear.com
   - Signing Algorithm: RS256

3. Configure Environment Variables (see CLAUDE.md)
```

---

## Design System

### Color Palette

```css
:root {
  /* Primary - Bear Brown */
  --primary: #8B4513;
  --primary-foreground: #FFFFFF;
  
  /* Accent - Honey Gold */
  --accent: #F4A460;
  --accent-foreground: #1A1A1A;
  
  /* Success - Forest Green */
  --success: #22C55E;
  
  /* Warning - Amber */
  --warning: #F59E0B;
  
  /* Danger - Berry Red */
  --danger: #EF4444;
  
  /* Neutral */
  --background: #FAFAF9;
  --foreground: #1A1A1A;
  --muted: #F5F5F4;
  --muted-foreground: #737373;
  --border: #E5E5E5;
}
```

### Typography

```css
/* Font Stack */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### Spacing Scale

```css
/* Tailwind default scale */
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
```

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Large phones, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

---

## Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.8s | Lighthouse |
| Time to Interactive | < 3.8s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Blocking Time | < 200ms | Lighthouse |
| Initial JS Bundle | < 100kB | Build output |
| First Load (gzipped) | < 200kB | Network tab |

### Optimization Strategies

1. **Code Splitting**
   - Dynamic imports for heavy components (charts)
   - Route-based code splitting (automatic with App Router)

2. **Image Optimization**
   - Use Next.js `<Image>` component
   - WebP/AVIF formats
   - Lazy loading

3. **Caching Strategy**
   - React Query stale times by resource
   - Static pages for landing
   - ISR for semi-dynamic content

4. **Bundle Analysis**
   - Regular bundle analysis (`@next/bundle-analyzer`)
   - Tree-shaking verification
   - Dependency auditing

---

## Security Considerations

### Authentication
- JWT tokens stored in httpOnly cookies (via Auth0 SDK)
- CSRF protection via SameSite cookies
- Token refresh handled automatically

### API Security
- All API calls authenticated
- No sensitive data in URL params
- Rate limiting awareness

### Data Protection
- No PII in localStorage
- Sanitize user inputs
- XSS prevention via React's default escaping

### Content Security
- Strict CSP headers
- HTTPS only in production
- Subresource integrity for CDN resources

---

## Deployment Strategy

### Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Development | localhost:3000 | feature/* | Local development |
| Staging | staging.spendbear.app | develop | QA testing |
| Production | spendbear.app | main | Live users |

### CI/CD Pipeline

```
Push to Branch
      │
      ▼
┌─────────────┐
│   Lint &    │
│ Type Check  │
└─────────────┘
      │
      ▼
┌─────────────┐
│ Unit Tests  │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Build     │
└─────────────┘
      │
      ├─── feature/* → Preview Deploy
      │
      ├─── develop → Staging Deploy
      │
      └─── main → Production Deploy
```

### Vercel Configuration

```json
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

---

## Future Considerations (Post-MVP)

### Phase 2
- Multi-language support (i18n)
- Dark mode
- Receipt photo upload
- CSV export
- Bulk transaction operations

### Phase 3
- PWA with offline support
- Push notifications
- Real-time collaboration
- Bank integration (Plaid)

### Phase 4
- Mobile apps (React Native)
- AI-powered insights
- Spending predictions
- Shared budgets

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

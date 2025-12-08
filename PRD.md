# SpendBear Frontend - Product Requirements Document

## Executive Summary

SpendBear Frontend is a modern, responsive web application that provides users with an intuitive interface to track expenses, manage budgets, and visualize spending patterns. Built with Next.js 15 and TypeScript, it serves as the primary consumer interface for the SpendBear personal finance management system.

## Vision Statement

Deliver a fast, intuitive, and delightful expense tracking experience that makes financial discipline feel effortless. Users should be able to log a transaction in under 2 seconds and gain instant insight into their financial health.

## Target Users

| Segment | Description | Key Needs |
|---------|-------------|-----------|
| **Primary** | Budget-conscious individuals (22-45) | Quick transaction entry, visual budget tracking |
| **Secondary** | Digital nomads & travelers | Multi-currency support, mobile-first experience |
| **Tertiary** | Small business owners | Category customization, expense categorization |

## Success Metrics

| Metric | Target | Priority |
|--------|--------|----------|
| Transaction entry time | < 2 seconds (2 taps) | P0 |
| Dashboard load (cached) | < 500ms | P0 |
| Time to Interactive (TTI) | < 3.8s | P1 |
| First Contentful Paint (FCP) | < 1.8s | P1 |
| Lighthouse Performance | > 90 | P1 |
| Initial JS bundle | < 100kB | P2 |

---

## User Stories & Acceptance Criteria

### Epic 1: Authentication & Onboarding

#### US-01: Social Login
**As a** new or returning user  
**I want to** sign in using my Google or GitHub account  
**So that** I don't need to remember another password

**Acceptance Criteria:**
- [ ] Auth0 login redirects work for Google and GitHub
- [ ] First-time users are registered in backend via `POST /api/identity/register`
- [ ] Auth state persists across browser sessions
- [ ] Loading spinner shows during authentication check
- [ ] Failed auth displays user-friendly error message
- [ ] Protected routes redirect unauthenticated users to login

#### US-02: Session Management
**As an** authenticated user  
**I want to** stay logged in until I explicitly log out  
**So that** I don't need to re-authenticate frequently

**Acceptance Criteria:**
- [ ] JWT tokens refresh automatically before expiry
- [ ] 401 API responses trigger re-authentication flow
- [ ] Logout clears all local state and redirects to landing
- [ ] User profile loaded via `GET /api/identity/me` on auth

---

### Epic 2: Transaction Management

#### US-03: Quick Transaction Entry
**As a** user  
**I want to** quickly record an expense or income  
**So that** I maintain accurate financial records

**Acceptance Criteria:**
- [ ] Transaction form accessible via FAB (mobile) or header button (desktop)
- [ ] Amount input auto-focuses with number pad on mobile
- [ ] Categories fetched from `GET /api/spending/categories`
- [ ] Form validates: amount > 0, category required, date not future
- [ ] Submit calls `POST /api/spending/transactions`
- [ ] Success toast with transaction summary
- [ ] Form resets after successful submission
- [ ] Dashboard updates immediately (optimistic update)

**API Contract:**
```json
POST /api/spending/transactions
{
  "amount": 45.99,
  "currency": "USD",
  "date": "2024-12-01T10:30:00Z",
  "description": "Lunch at cafe",
  "categoryId": "uuid-here",
  "type": 1  // 0=Income, 1=Expense
}
```

#### US-04: View Transaction History
**As a** user  
**I want to** browse my past transactions  
**So that** I can review and verify my spending

**Acceptance Criteria:**
- [ ] Paginated list via `GET /api/spending/transactions`
- [ ] Infinite scroll or "Load more" pagination
- [ ] Filter by: date range, category, type (income/expense)
- [ ] Sort by date (default: newest first)
- [ ] Click transaction to view/edit details
- [ ] Empty state when no transactions match filters

#### US-05: Edit/Delete Transaction
**As a** user  
**I want to** modify or remove incorrect transactions  
**So that** my records stay accurate

**Acceptance Criteria:**
- [ ] Edit form pre-populates with existing values
- [ ] Update via `PUT /api/spending/transactions/{id}`
- [ ] Delete via `DELETE /api/spending/transactions/{id}`
- [ ] Confirmation dialog before delete
- [ ] Related budget recalculates after changes

---

### Epic 3: Budget Management

#### US-06: Create Budget
**As a** user  
**I want to** set spending limits for categories  
**So that** I can control my expenses

**Acceptance Criteria:**
- [ ] Budget form with: name, amount, period, category (optional), warning threshold
- [ ] Period options: Monthly (default), Weekly, Custom
- [ ] Category dropdown (null = global budget)
- [ ] Submit via `POST /api/budgets`
- [ ] New budget appears immediately in list

**API Contract:**
```json
POST /api/budgets
{
  "name": "Food Budget",
  "amount": 500.00,
  "currency": "USD",
  "period": 0,  // 0=Monthly, 1=Weekly, 2=Custom
  "startDate": "2024-12-01T00:00:00Z",
  "categoryId": "uuid-or-null",
  "warningThreshold": 80
}
```

#### US-07: Monitor Budget Status
**As a** user  
**I want to** see my budget consumption at a glance  
**So that** I know when to slow down spending

**Acceptance Criteria:**
- [ ] Budget cards show: name, spent/limit, progress bar, remaining amount
- [ ] Progress bar color: green (<50%), yellow (50-80%), red (>80%)
- [ ] Days remaining in current period displayed
- [ ] Fetch via `GET /api/budgets?activeOnly=true`
- [ ] Auto-refresh every 30 seconds for near real-time updates

#### US-08: Edit/Delete Budget
**As a** user  
**I want to** adjust or remove budgets  
**So that** my budgets reflect changing priorities

**Acceptance Criteria:**
- [ ] Edit via `PUT /api/budgets/{id}`
- [ ] Delete via `DELETE /api/budgets/{id}`
- [ ] Cannot delete budget with active period (show warning)
- [ ] Changes reflect immediately in dashboard

---

### Epic 4: Dashboard & Analytics

#### US-09: Dashboard Overview
**As a** user  
**I want to** see my financial summary at a glance  
**So that** I understand my current financial health

**Acceptance Criteria:**
- [ ] Total spending this month (from `GET /api/analytics/summary/monthly`)
- [ ] Comparison to previous month (percentage change)
- [ ] Top 3 active budgets with progress
- [ ] Recent 5 transactions
- [ ] Quick action buttons: Add Transaction, View All, Manage Budgets

#### US-10: Spending by Category
**As a** user  
**I want to** see spending breakdown by category  
**So that** I can identify where my money goes

**Acceptance Criteria:**
- [ ] Pie/donut chart of spending by category
- [ ] Data from `spendingByCategory` in monthly summary
- [ ] Click category slice to filter transactions
- [ ] Category legend with amounts and percentages

---

### Epic 5: Categories

#### US-11: View Categories
**As a** user  
**I want to** see all available expense categories  
**So that** I can categorize my transactions properly

**Acceptance Criteria:**
- [ ] List shows system categories (read-only) and user categories
- [ ] System categories marked distinctly
- [ ] Categories sorted: system first, then user, alphabetically

#### US-12: Create Custom Category
**As a** user  
**I want to** create my own categories  
**So that** tracking reflects my lifestyle

**Acceptance Criteria:**
- [ ] Form: name (required), description (optional)
- [ ] Validation: name unique, not matching system categories
- [ ] Submit via `POST /api/spending/categories`
- [ ] New category available immediately in dropdowns

---

### Epic 6: Notifications

#### US-13: View Notifications
**As a** user  
**I want to** see alerts about my budgets  
**So that** I'm warned before overspending

**Acceptance Criteria:**
- [ ] Notification bell in header with unread count
- [ ] Fetch via `GET /api/notifications?unreadOnly=true`
- [ ] Types: BudgetWarning, BudgetExceeded
- [ ] Click to mark read via `PUT /api/notifications/{id}/read`
- [ ] Link to related budget from notification

---

## Non-Functional Requirements

### Performance
- Page load: < 2s (P95)
- API response handling: < 200ms
- Smooth 60fps animations
- Support 10,000 transactions without lag

### Security
- All API calls authenticated via Auth0 JWT
- No sensitive data in localStorage (use httpOnly cookies)
- HTTPS enforced
- Input sanitization on all forms

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation for all interactions
- Screen reader compatible (proper ARIA labels)
- Color contrast ratio: 4.5:1 minimum
- Focus indicators on all interactive elements

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari & Chrome

### Responsive Design
- Mobile: 320px - 639px (bottom nav, full-screen modals)
- Tablet: 640px - 1023px (side drawer, 2-column layouts)
- Desktop: 1024px+ (fixed sidebar, multi-column dashboard)

---

## Constraints & Assumptions

### Constraints
- MVP is English-only (i18n planned for Phase 2)
- No offline support in MVP (PWA for Phase 3)
- Single currency per user (multi-currency display only)

### Assumptions
- Users have reliable internet connectivity
- Auth0 free tier sufficient for MVP user volume
- Backend API is stable and documented

---

## Out of Scope (MVP)

- Bank account integration / CSV import
- Receipt photo upload
- Dark mode
- Collaborative/shared budgets
- Investment or cryptocurrency tracking
- Push notifications (email only via backend)
- Data export

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-01 | Initial frontend PRD |

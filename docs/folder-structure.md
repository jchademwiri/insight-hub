# MVP Analytics Platform - Folder Structure

## Project Root Structure

```
mvp-analytics-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── register/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── equipment-types/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── executive/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── finance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── operations/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── project-manager/
│   │   │   │       └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── users/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── new/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           ├── page.tsx
│   │   │   │           └── edit/
│   │   │   │               └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── supabase/
│   │   │           └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── project-form.tsx
│   │   │   ├── invoice-form.tsx
│   │   │   ├── expense-form.tsx
│   │   │   ├── equipment-type-form.tsx
│   │   │   └── user-form.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── revenue-chart.tsx
│   │   │   ├── expense-chart.tsx
│   │   │   ├── profit-chart.tsx
│   │   │   ├── project-timeline-chart.tsx
│   │   │   └── equipment-utilization-chart.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── executive/
│   │   │   │   ├── kpi-overview.tsx
│   │   │   │   ├── portfolio-status.tsx
│   │   │   │   ├── financial-summary.tsx
│   │   │   │   └── equipment-profitability.tsx
│   │   │   ├── project-manager/
│   │   │   │   ├── project-status.tsx
│   │   │   │   ├── budget-tracking.tsx
│   │   │   │   └── risk-indicators.tsx
│   │   │   ├── operations/
│   │   │   │   ├── equipment-usage.tsx
│   │   │   │   ├── cost-trends.tsx
│   │   │   │   └── capacity-planning.tsx
│   │   │   └── finance/
│   │   │       ├── cash-flow.tsx
│   │   │       ├── profitability.tsx
│   │   │       └── cost-analysis.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   ├── tables/
│   │   │   ├── data-table.tsx
│   │   │   ├── projects-table.tsx
│   │   │   ├── invoices-table.tsx
│   │   │   ├── expenses-table.tsx
│   │   │   └── equipment-types-table.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── protected-route.tsx
│   │   │
│   │   └── common/
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── empty-state.tsx
│   │       ├── confirmation-dialog.tsx
│   │       └── page-header.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── equipment-types.ts
│   │   │   │   ├── invoices.ts
│   │   │   │   └── expenses.ts
│   │   │   ├── queries/
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── equipment-types.ts
│   │   │   │   ├── invoices.ts
│   │   │   │   ├── expenses.ts
│   │   │   │   └── analytics.ts
│   │   │   ├── migrations/
│   │   │   │   └── (auto-generated by drizzle-kit)
│   │   │   ├── connection.ts
│   │   │   └── seed.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── supabase.ts
│   │   │   ├── server.ts
│   │   │   ├── client.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── actions/
│   │   │   ├── projects.ts
│   │   │   ├── invoices.ts
│   │   │   ├── expenses.ts
│   │   │   ├── equipment-types.ts
│   │   │   ├── users.ts
│   │   │   └── analytics.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── project.ts
│   │   │   ├── invoice.ts
│   │   │   ├── expense.ts
│   │   │   ├── equipment-type.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── date-utils.ts
│   │   │   ├── currency-utils.ts
│   │   │   └── role-utils.ts
│   │   │
│   │   └── hooks/
│   │       ├── use-auth.ts
│   │       ├── use-projects.ts
│   │       ├── use-invoices.ts
│   │       ├── use-expenses.ts
│   │       └── use-analytics.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── project.ts
│   │   ├── invoice.ts
│   │   ├── expense.ts
│   │   ├── equipment-type.ts
│   │   └── analytics.ts
│   │
│   └── middleware.ts
│
├── docs/
│   ├── database-design.md
│   ├── prd.md
│   ├── technical-specification.md
│   └── db/
│       ├── db-posgress.sql
│       └── db-supabase.sql
│
├── public/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── .env.local
├── .env.example
├── .gitignore
├── components.json
├── drizzle.config.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Structure Decisions

### 1. Route Groups
- `(auth)` - Authentication pages with shared layout
- `(dashboard)` - Protected dashboard pages with navigation

### 2. Page Organization
- Each resource follows RESTful patterns: list, new, [id], [id]/edit
- Consistent loading and error states for each route
- Role-based dashboard components organized by user type

### 3. Component Architecture
- **UI Components**: Reusable ShadCN components
- **Forms**: Specific form components for each entity
- **Charts**: Analytics visualization components
- **Dashboard**: Role-specific dashboard widgets
- **Layout**: Navigation and structure components
- **Tables**: Data display components
- **Common**: Shared utility components

### 4. Library Structure
- **Database**: Drizzle schema, queries, and migrations
- **Auth**: Supabase authentication helpers
- **Actions**: Next.js server actions
- **Validations**: Zod schemas for form validation
- **Utils**: Helper functions and constants
- **Hooks**: Custom React hooks

### 5. Best Practices Implemented
- ✅ Route groups for logical organization
- ✅ Consistent file naming (kebab-case)
- ✅ Separation of concerns (schema, queries, actions)
- ✅ Type safety with TypeScript definitions
- ✅ Loading/error states for all routes
- ✅ Middleware for authentication
- ✅ Server actions for data mutations
- ✅ Role-based access control structure

### 6. Notable Features
- Role-based dashboard organization
- Comprehensive analytics structure
- Proper error boundaries and loading states
- Consistent CRUD patterns across all resources
- Clean separation between client and server code
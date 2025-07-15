# Project Structure & Organization

## Root Directory Structure

```
insight-hub/
├── src/                    # Source code
├── docs/                   # Documentation
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration
├── node_modules/           # Dependencies
└── config files            # Next.js, TypeScript, etc.
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)

```
app/
├── (auth)/                 # Authentication route group
│   ├── login/
│   └── layout.tsx
├── (dashboard)/            # Protected dashboard routes
│   ├── dashboard/          # Main dashboard
│   ├── projects/           # Project management
│   ├── invoices/           # Equipment usage tracking
│   ├── expenses/           # Cost management
│   ├── equipment-types/    # Equipment type setup
│   └── layout.tsx
├── globals.css
├── layout.tsx              # Root layout
└── page.tsx                # Landing page
```

### Component Architecture (`src/components/`)

```
components/
├── ui/                     # ShadCN base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── forms/                  # Entity-specific forms
│   ├── project-form.tsx
│   ├── invoice-form.tsx
│   └── expense-form.tsx
├── charts/                 # Recharts visualizations
│   ├── revenue-chart.tsx
│   └── profit-chart.tsx
├── dashboard/              # Role-specific widgets
│   ├── executive/
│   ├── project-manager/
│   ├── operations/
│   └── finance/
└── layout/                 # Navigation components
    ├── header.tsx
    └── sidebar.tsx
```

### Library Structure (`src/lib/`)

```
lib/
├── db/                     # Database layer
│   ├── schema/             # Drizzle schemas
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── invoices.ts
│   │   └── expenses.ts
│   ├── queries/            # Database queries
│   └── connection.ts
├── auth/                   # Supabase auth helpers
│   ├── server.ts
│   ├── client.ts
│   └── middleware.ts
├── actions/                # Server actions
│   ├── projects.ts
│   ├── invoices.ts
│   └── expenses.ts
├── validations/            # Zod schemas
└── utils/                  # Utility functions
```

## Database Schema Organization

### Core Tables
- **users**: Authentication & roles
- **projects**: Construction project metadata
- **equipment_types**: Master list of reusable equipment
- **invoices**: Equipment usage per project (revenue)
- **expenses**: Costs linked to invoices

### Relationships
```
users → (role-based access)
projects ← invoices → equipment_types
invoices ← expenses
```

## Route Organization Patterns

### RESTful Route Structure
Each entity follows consistent patterns:
- `/entity` - List view
- `/entity/new` - Create form
- `/entity/[id]` - Detail view
- `/entity/[id]/edit` - Edit form

### Route Groups
- **(auth)**: Public authentication pages
- **(dashboard)**: Protected pages with shared navigation layout

### File Conventions
- `page.tsx` - Route component
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading state
- `error.tsx` - Error boundary

## Component Naming Conventions

### File Naming
- **Components**: PascalCase.tsx (`ProjectForm.tsx`)
- **Pages**: page.tsx (App Router requirement)
- **Utilities**: kebab-case.ts (`date-utils.ts`)
- **Schemas**: kebab-case.ts (`project-schema.ts`)

### Component Organization
- **Base UI**: Reusable ShadCN components in `ui/`
- **Feature Forms**: Entity-specific forms in `forms/`
- **Visualizations**: Chart components in `charts/`
- **Role Widgets**: Dashboard components organized by user role

## Import Path Aliases

Configured in `tsconfig.json` and `components.json`:
```typescript
"@/*": ["./src/*"]           # Base path
"@/components": components   # Component imports
"@/lib": lib                # Library imports
"@/ui": components/ui       # UI component imports
```

## Data Flow Architecture

### Server-First Approach
1. **Server Components**: Default for data fetching
2. **Server Actions**: Handle all mutations
3. **Client Components**: Only when interactivity needed
4. **Middleware**: Route protection and auth

### Role-Based Access
- Middleware protects dashboard routes
- Layout components adapt to user role
- Dashboard widgets filtered by permissions
- Server actions validate user access

## Development Patterns

### Feature Development Flow
1. Define Drizzle schema
2. Create database queries
3. Build server actions
4. Implement UI components
5. Add route pages
6. Test role-based access

### Code Organization Principles
- **Separation of Concerns**: Clear boundaries between layers
- **Type Safety**: Leverage TypeScript throughout
- **Reusability**: Build composable components
- **Consistency**: Follow established patterns
- **Performance**: Server-first architecture

## File Structure Best Practices

- Keep related files together (co-location)
- Use descriptive, consistent naming
- Organize by feature, not by file type
- Maintain shallow directory structures
- Group similar functionality in folders

## Documentation Structure (`docs/`)

- `prd.md` - Product requirements
- `technical-specification.md` - Technical details
- `database-design.md` - Schema documentation
- `folder-structure.md` - Project organization
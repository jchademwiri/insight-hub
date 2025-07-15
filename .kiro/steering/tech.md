# Technology Stack & Development Guidelines

## Core Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, ShadCN UI |
| Charts | Recharts |
| Backend | Next.js Server Actions |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| Hosting | Vercel + Supabase |

## Package Manager

- **pnpm** is the required package manager (specified in package.json)
- Use `pnpm install`, `pnpm add`, `pnpm remove` for dependency management

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database (when implemented)
pnpm db:push          # Push schema to Supabase
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed with sample data
```

## Architecture Patterns

### Next.js App Router
- Use App Router exclusively (not Pages Router)
- Server Actions for all backend logic (no custom API routes)
- Route groups: `(auth)` and `(dashboard)` for organization
- Consistent loading.tsx and error.tsx for each route

### Component Architecture
- **ShadCN UI**: Use for all base components (buttons, inputs, cards)
- **Component Structure**: ui/ for base, forms/ for specific forms, charts/ for visualizations
- **Server Components**: Default to server components, use 'use client' only when needed

### Database & ORM
- **Drizzle ORM**: Type-safe database operations
- **Schema Organization**: Separate files per table in lib/db/schema/
- **Queries**: Organized by entity in lib/db/queries/
- **Server Actions**: Handle all mutations in lib/actions/

## Code Style & Standards

### TypeScript
- Strict mode enabled
- Use proper typing for all functions and components
- Leverage Drizzle's generated types for database operations

### Styling
- **Tailwind CSS v4**: Use utility classes
- **ShadCN Components**: New York style variant
- **CSS Variables**: Enabled for theming
- **Responsive Design**: Mobile-first approach

### File Naming
- Use kebab-case for files and folders
- Component files: PascalCase.tsx
- Utility files: kebab-case.ts
- Page files: page.tsx (App Router convention)

## Authentication & Security

### Supabase Auth
- Server-side authentication using Supabase SSR
- Middleware protection for all dashboard routes
- Role-based access control via user.role field
- Session management with Next.js cookies

### Environment Variables
```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Performance Guidelines

- **Server Components**: Prefer server components for data fetching
- **Loading States**: Implement loading.tsx for all routes
- **Error Handling**: Implement error.tsx for graceful error handling
- **Image Optimization**: Use Next.js Image component
- **Bundle Size**: Keep client-side JavaScript minimal

## Development Workflow

1. **Schema First**: Define Drizzle schema before building features
2. **Server Actions**: Use for all data mutations
3. **Type Safety**: Leverage TypeScript and Drizzle types
4. **Component Reuse**: Build reusable components in ui/
5. **Role-Based Testing**: Test all user roles during development

## Deployment

- **Vercel**: Frontend hosting with GitHub integration
- **Supabase**: Backend services and database
- **Environment**: Separate configs for dev/staging/prod
- **SSL**: Automatic via Vercel

## Dependencies

### Core Dependencies
- Next.js 15, React 19, TypeScript 5
- Supabase client libraries
- Tailwind CSS v4, ShadCN UI components
- Lucide React icons, Recharts for visualizations

### Development Tools
- ESLint with Next.js config
- Drizzle ORM and Drizzle Kit
- PostCSS with Tailwind plugin
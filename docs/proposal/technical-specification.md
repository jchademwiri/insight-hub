# MVP Analytics Platform - Technical Specification (Enhanced)

## 1. Overview

This document outlines the technical implementation plan for the MVP version of the Analytics Platform using Next.js 15, PostgreSQL + Better Auth, Drizzle ORM, Tailwind CSS v4, ShadCN UI, and Recharts. The platform focuses on **project timeline analysis**, **lifetime item performance tracking**, and **project-specific pricing analytics**.

---

## 2. Tech Stack Summary

| Layer         | Technology                            |
| ------------- | ------------------------------------- |
| Frontend      | Next.js 15 (App Router), TypeScript   |
| Styling       | Tailwind CSS v4, ShadCN UI            |
| Charts        | Recharts                              |
| Backend Logic | Next.js Server Actions                |
| Auth          | Better Auth                           |
| Database      | PostgreSQL - Neon                     |
| ORM           | Drizzle ORM                           |
| Hosting       | Vercel (frontend, backend)            |

---

## 3. Folder Structure (Next.js App Router)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── projects/
│   │   ├── items/
│   │   ├── invoices/
│   │   └── analytics/
│   ├── api/
│   │   └── auth/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── charts/
│   ├── forms/
│   └── dashboard/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── schema.ts
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 4. Enhanced Database Schema (Drizzle ORM)

### Tables:

```ts
// organizations table
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// item_categories table (NEW!)
export const itemCategories = pgTable('item_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// master_items table (NEW!)
export const masterItems = pgTable('master_items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => itemCategories.id),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_category').on(table.categoryId),
}));

// users table (Better Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('viewer'),
  organizationId: integer('organization_id').references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// projects table (Enhanced with timeline fields)
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date'),
  endDate: date('end_date'), // NULL if project still active
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'completed', 'on_hold', 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  orgStatusIdx: index('idx_org_status').on(table.organizationId, table.status),
  datesIdx: index('idx_dates').on(table.startDate, table.endDate),
}));

// project_items table (Enhanced with master item linking)
export const projectItems = pgTable('project_items', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  masterItemId: integer('master_item_id').notNull().references(() => masterItems.id),
  projectSpecificName: varchar('project_specific_name', { length: 255 }), // Optional: "Site A - 8 ton dropside"
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(), // Project-specific price
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueProjectMasterItem: uniqueIndex('unique_project_master_item').on(table.projectId, table.masterItemId),
  masterItemIdx: index('idx_master_item').on(table.masterItemId),
}));

// invoices table (Enhanced with better indexing)
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  invoiceDate: date('invoice_date').notNull(),
  dueDate: date('due_date'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  projectDateIdx: index('idx_project_date').on(table.projectId, table.invoiceDate),
  statusDateIdx: index('idx_status_date').on(table.status, table.invoiceDate),
}));

// invoice_items table (The Analytics Powerhouse!)
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  projectItemId: integer('project_item_id').notNull().references(() => projectItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'), // Allows fractional quantities
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  lineDescription: text('line_description'), // "Week 3 rental", "Emergency call-out"
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  invoiceIdx: index('idx_invoice').on(table.invoiceId),
  projectItemIdx: index('idx_project_item').on(table.projectItemId),
}));
```

### Key Database Views for Analytics:

```sql
-- Project Timeline Analysis View
CREATE VIEW project_timeline_analysis AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.start_date,
    p.end_date,
    p.status,
    i.invoice_date,
    SUM(ii.total_price) as invoice_amount,
    SUM(SUM(ii.total_price)) OVER (
        PARTITION BY p.id 
        ORDER BY i.invoice_date 
        ROWS UNBOUNDED PRECEDING
    ) as cumulative_invoiced
FROM projects p
JOIN invoices i ON p.id = i.project_id
JOIN invoice_items ii ON i.id = ii.invoice_id
WHERE i.status IN ('sent', 'paid')
GROUP BY p.id, p.name, p.start_date, p.end_date, p.status, i.invoice_date;

-- Master Item Lifetime Performance View
CREATE VIEW master_item_lifetime_performance AS
SELECT 
    mi.id as master_item_id,
    mi.name as item_name,
    ic.name as category_name,
    COUNT(DISTINCT pi.project_id) as projects_used_in,
    COUNT(ii.id) as total_times_invoiced,
    SUM(ii.quantity) as total_quantity_sold,
    SUM(ii.total_price) as total_lifetime_revenue,
    SUM((ii.unit_price - pi.cost_price) * ii.quantity) as total_lifetime_profit,
    AVG(ii.unit_price) as average_selling_price,
    MIN(ii.unit_price) as lowest_price_charged,
    MAX(ii.unit_price) as highest_price_charged
FROM master_items mi
JOIN item_categories ic ON mi.category_id = ic.id
LEFT JOIN project_items pi ON mi.id = pi.master_item_id
LEFT JOIN invoice_items ii ON pi.id = ii.project_item_id
LEFT JOIN invoices inv ON ii.invoice_id = inv.id
WHERE inv.status IN ('sent', 'paid') OR inv.id IS NULL
GROUP BY mi.id, mi.name, ic.name;
```

---

## 5. Pages & Routes

### Public Routes:
* `/(auth)/login` – Better Auth form with role redirect

### Protected Routes (via middleware):
* `/overview` – Dashboard overview with KPIs
* `/projects` – Project management and timeline analysis
* `/items` – Master items and lifetime performance tracking
* `/items/[id]` – Individual item analytics across all projects
* `/projects/[id]` – Project-specific analytics and item performance
* `/invoices` – Invoice management and status tracking
* `/analytics` – Advanced analytics and custom reports

---

## 6. Forms and Components

### Master Item Management Form
```tsx
// Create reusable items across projects
interface MasterItemForm {
  categoryId: number;
  name: string; // "8 ton dropside", "14 cube tipper"
  description?: string;
}
```

### Project Item Setup Form
```tsx
// Link master items to projects with project-specific pricing
interface ProjectItemForm {
  masterItemId: number;
  projectSpecificName?: string;
  costPrice: number;
  sellingPrice: number; // Project-specific pricing
}
```

### Enhanced Invoice Item Form
```tsx
interface InvoiceItemForm {
  projectItemId: number;
  quantity: number; // Allows fractional quantities
  unitPrice: number; // Can differ from project selling price
  lineDescription?: string;
}
```

---

## 7. Server Actions

### Core Analytics Actions:
```tsx
// Get project timeline with cumulative totals
async function getProjectTimeline(projectId: number, endDate?: string)

// Get master item lifetime performance across all projects
async function getMasterItemPerformance(masterItemId?: number)

// Compare same item performance across different projects
async function compareItemAcrossProjects(masterItemId: number)

// Get project totals at any point in time
async function getProjectTotalsByDate(projectId: number, asOfDate: string)

// Get current project performance summary
async function getCurrentProjectSummary(organizationId: number)
```

---

## 8. Role-Based Access Control

**Roles:** `admin`, `project_manager`, `accountant`, `viewer`

* **Admin**: Full access to all data and analytics
* **Project Manager**: Project-specific data + item performance within their projects
* **Accountant**: Invoice management + financial analytics
* **Viewer**: Read-only dashboard access

Middleware protects routes based on user role and organization membership.

---

## 9. Enhanced Data Entry Flow

### Setup Phase:
1. **Create Item Categories** ("Construction Equipment", "Transport Vehicles")
2. **Create Master Items** ("8 ton dropside", "14 cube tipper", "Dozer CAT D6")
3. **Create Projects** with start/end dates
4. **Link Items to Projects** with project-specific pricing

### Operational Phase:
1. **Create Invoices** for projects
2. **Add Invoice Items** using project items with actual quantities/prices
3. **Track Invoice Status** (draft → sent → paid)

---

## 10. Key Analytics Capabilities

### Project Timeline Analysis:
- Total invoiced amounts at any point in time
- Cumulative revenue tracking
- Project performance over time

### Master Item Lifetime Performance:
- How much has "8 ton dropside" made across ALL projects?
- Which items are most profitable?
- Price variations across projects

### Project-Specific Item Analysis:
- How did each item perform within a specific project?
- Compare same item performance across different projects
- Identify best-performing project/item combinations

---

## 11. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 12. Dev Setup Checklist

* Clone repo & install dependencies
* Setup Neon PostgreSQL database
* Create all tables using Drizzle schema
* Create database views for analytics
* Add environment variables
* Run `drizzle-kit push` to sync schema
* Seed with sample data (categories, master items)
* Deploy frontend via Vercel

---

## 13. Future Considerations

### Phase 2 Enhancements:
- **Automated Data Import**: Integration with existing systems
- **Advanced Analytics**: Machine learning for pricing optimization
- **Mobile App**: Field data entry capabilities
- **API Integration**: Connect with accounting software
- **Real-time Notifications**: Invoice status updates
- **Custom Report Builder**: Drag-and-drop analytics

### Phase 3 Scaling:
- **Multi-tenant Architecture**: Support multiple organizations
- **Advanced Role Management**: Custom permissions
- **Audit Trail**: Complete data change tracking
- **Data Export**: Advanced reporting capabilities

---

## 14. Key Success Metrics

### Analytics Capabilities:
- **Timeline Analysis**: "What was the total invoiced for Project X as of March 31st?"
- **Item Performance**: "How much revenue has '8 ton dropside' generated across all projects?"
- **Pricing Insights**: "Which projects paid the highest rates for specific items?"
- **Profitability Analysis**: "Which item/project combinations are most profitable?"

---

End of Enhanced Technical Specification
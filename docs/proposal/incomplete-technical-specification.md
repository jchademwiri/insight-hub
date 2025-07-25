# MVP Analytics Platform - Technical Specification (Enhanced with Quotations)

## 1. Overview

This document outlines the technical implementation plan for the MVP version of the Analytics Platform with **integrated quotation management and one-click conversion capabilities**. The platform now includes **quotation-to-invoice workflow**, **sales pipeline analytics**, and **comprehensive pricing intelligence** alongside the original **project timeline analysis** and **lifetime item performance tracking**.

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
| PDF Generation| Puppeteer/React-PDF                   |
| Email         | Resend/SendGrid                       |
| Hosting       | Vercel (frontend, backend)            |

---

## 3. Enhanced Folder Structure (Next.js App Router)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── projects/
│   │   │   └── [id]/
│   │   │       └── quotations/
│   │   ├── quotations/                 # NEW
│   │   │   ├── create/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   ├── duplicate/
│   │   │   │   └── convert/
│   │   │   └── analytics/
│   │   ├── items/
│   │   ├── invoices/
│   │   └── analytics/
│   ├── api/
│   │   ├── auth/
│   │   ├── quotations/                 # NEW
│   │   │   ├── [id]/
│   │   │   │   ├── convert/
│   │   │   │   └── pdf/
│   │   │   └── send/
│   │   └── invoices/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (ShadCN components)
│   ├── charts/
│   ├── forms/
│   │   ├── quotation-form.tsx         # NEW
│   │   ├── quotation-items-form.tsx   # NEW
│   │   └── conversion-preview.tsx     # NEW
│   ├── dashboard/
│   ├── quotations/                     # NEW
│   │   ├── quotation-list.tsx
│   │   ├── quotation-status.tsx
│   │   ├── conversion-button.tsx
│   │   └── analytics/
│   └── pdf/                           # NEW
│       ├── quotation-template.tsx
│       └── invoice-template.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── schema.ts
│   ├── quotations.ts                  # NEW
│   ├── pdf-generator.ts               # NEW
│   ├── email-service.ts               # NEW
│   └── utils.ts
└── types/
    ├── index.ts
    └── quotations.ts                   # NEW
```

---

## 4. Enhanced Database Schema (Drizzle ORM)

### Core Tables (Updated):

```ts
// organizations table (unchanged)
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// item_categories table (unchanged)
export const itemCategories = pgTable('item_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// master_items table (unchanged)
export const masterItems = pgTable('master_items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => itemCategories.id),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_category').on(table.categoryId),
}));

// users table (Enhanced with sales role)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('viewer'), 
  // Roles: 'admin', 'sales_manager', 'project_manager', 'accountant', 'viewer'
  organizationId: integer('organization_id').references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// projects table (Enhanced with quotation tracking)
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  quotationCount: integer('quotation_count').default(0), // NEW
  acceptedQuotationValue: decimal('accepted_quotation_value', { precision: 10, scale: 2 }), // NEW
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  orgStatusIdx: index('idx_org_status').on(table.organizationId, table.status),
  datesIdx: index('idx_dates').on(table.startDate, table.endDate),
}));

// project_items table (unchanged)
export const projectItems = pgTable('project_items', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  masterItemId: integer('master_item_id').notNull().references(() => masterItems.id),
  projectSpecificName: varchar('project_specific_name', { length: 255 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueProjectMasterItem: uniqueIndex('unique_project_master_item').on(table.projectId, table.masterItemId),
  masterItemIdx: index('idx_master_item').on(table.masterItemId),
}));
```

### NEW Quotation Tables:

```ts
// quotations table - Core quotation management
export const quotations = pgTable('quotations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  quotationNumber: varchar('quotation_number', { length: 100 }).notNull().unique(),
  quotationDate: date('quotation_date').notNull(),
  validUntil: date('valid_until').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  // Status: 'draft', 'sent', 'accepted', 'rejected', 'expired', 'converted', 'cancelled'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  terms: text('terms'),
  clientContact: varchar('client_contact', { length: 255 }),
  createdBy: integer('created_by').references(() => users.id),
  acceptedDate: date('accepted_date'),
  convertedDate: timestamp('converted_date'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectStatusIdx: index('idx_quotation_project_status').on(table.projectId, table.status),
  validityIdx: index('idx_quotation_validity').on(table.validUntil, table.status),
  numberIdx: uniqueIndex('idx_quotation_number').on(table.quotationNumber),
  createdByIdx: index('idx_quotation_created_by').on(table.createdBy),
}));

// quotation_items table - Line items for quotations
export const quotationItems = pgTable('quotation_items', {
  id: serial('id').primaryKey(),
  quotationId: integer('quotation_id').notNull().references(() => quotations.id, { onDelete: 'cascade' }),
  projectItemId: integer('project_item_id').notNull().references(() => projectItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  lineDescription: text('line_description'),
  duration: varchar('duration', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  quotationIdx: index('idx_quotation_items_quotation').on(table.quotationId),
  projectItemIdx: index('idx_quotation_items_project_item').on(table.projectItemId),
}));

// quotation_revisions table - Track quotation changes
export const quotationRevisions = pgTable('quotation_revisions', {
  id: serial('id').primaryKey(),
  quotationId: integer('quotation_id').notNull().references(() => quotations.id, { onDelete: 'cascade' }),
  revisionNumber: integer('revision_number').notNull().default(1),
  changes: jsonb('changes'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  quotationRevisionIdx: index('idx_quotation_revision').on(table.quotationId, table.revisionNumber),
}));
```

### Enhanced Invoice Tables:

```ts
// invoices table (Enhanced with quotation linkage)
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  quotationId: integer('quotation_id').references(() => quotations.id), // NEW - Links to source quotation
  convertedFromQuotation: boolean('converted_from_quotation').default(false), // NEW - Conversion flag
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  invoiceDate: date('invoice_date').notNull(),
  dueDate: date('due_date'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  projectDateIdx: index('idx_project_date').on(table.projectId, table.invoiceDate),
  statusDateIdx: index('idx_status_date').on(table.status, table.invoiceDate),
  quotationIdx: index('idx_invoice_quotation').on(table.quotationId), // NEW
}));

// invoice_items table (unchanged)
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  projectItemId: integer('project_item_id').notNull().references(() => projectItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  lineDescription: text('line_description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  invoiceIdx: index('idx_invoice').on(table.invoiceId),
  projectItemIdx: index('idx_project_item').on(table.projectItemId),
}));
```

### Enhanced Analytics Views:

```sql
-- Quotation Performance Analysis View
CREATE VIEW quotation_performance_analysis AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.organization_id,
    COUNT(q.id) as total_quotations,
    COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotations,
    COUNT(CASE WHEN q.status = 'rejected' THEN 1 END) as rejected_quotations,
    COUNT(CASE WHEN q.status = 'expired' THEN 1 END) as expired_quotations,
    COUNT(CASE WHEN q.status = 'converted' THEN 1 END) as converted_quotations,
    SUM(CASE WHEN q.status = 'accepted' THEN q.total_amount ELSE 0 END) as accepted_value,
    SUM(CASE WHEN q.status IN ('draft', 'sent') THEN q.total_amount ELSE 0 END) as pipeline_value,
    AVG(CASE WHEN q.status = 'accepted' THEN q.total_amount END) as avg_accepted_value,
    ROUND(
        COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN q.status != 'draft' THEN 1 END), 0), 2
    ) as acceptance_rate
FROM projects p
LEFT JOIN quotations q ON p.id = q.project_id
GROUP BY p.id, p.name, p.organization_id;

-- Quotation to Invoice Conversion Tracking
CREATE VIEW quotation_conversion_tracking AS
SELECT 
    q.id as quotation_id,
    q.quotation_number,
    q.project_id,
    q.total_amount as quoted_amount,
    q.accepted_date,
    q.converted_date,
    i.id as invoice_id,
    i.invoice_number,
    i.total_amount as invoiced_amount,
    i.total_amount - q.total_amount as amount_variance,
    i.invoice_date,
    EXTRACT(days FROM (i.invoice_date - q.accepted_date)) as conversion_time_days,
    ROUND(((i.total_amount - q.total_amount) / q.total_amount) * 100, 2) as variance_percentage
FROM quotations q
LEFT JOIN invoices i ON q.id = i.quotation_id
WHERE q.status IN ('accepted', 'converted')
  AND q.converted_from_quotation = true;

-- Master Item Quotation vs Performance Analysis
CREATE VIEW master_item_quotation_performance AS
SELECT 
    mi.id as master_item_id,
    mi.name as item_name,
    ic.name as category_name,
    COUNT(DISTINCT qi.quotation_id) as times_quoted,
    COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN qi.quotation_id END) as times_accepted,
    COUNT(DISTINCT ii.invoice_id) as times_invoiced,
    COUNT(DISTINCT pi.project_id) as projects_used_in,
    AVG(qi.unit_price) as avg_quoted_price,
    AVG(CASE WHEN q.status = 'accepted' THEN qi.unit_price END) as avg_accepted_price,
    AVG(ii.unit_price) as avg_invoiced_price,
    SUM(CASE WHEN q.status = 'accepted' THEN qi.total_price ELSE 0 END) as total_accepted_value,
    SUM(ii.total_price) as total_invoiced_value,
    ROUND(
        COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN qi.quotation_id END) * 100.0 / 
        NULLIF(COUNT(DISTINCT qi.quotation_id), 0), 2
    ) as item_acceptance_rate
FROM master_items mi
JOIN item_categories ic ON mi.category_id = ic.id
LEFT JOIN project_items pi ON mi.id = pi.master_item_id
LEFT JOIN quotation_items qi ON pi.id = qi.project_item_id
LEFT JOIN quotations q ON qi.quotation_id = q.id
LEFT JOIN invoice_items ii ON pi.id = ii.project_item_id
LEFT JOIN invoices inv ON ii.invoice_id = inv.id AND inv.status IN ('sent', 'paid')
GROUP BY mi.id, mi.name, ic.name;

-- Enhanced Project Timeline with Quotations
CREATE VIEW enhanced_project_timeline AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.start_date,
    p.end_date,
    p.status,
    'quotation' as event_type,
    q.quotation_date as event_date,
    q.total_amount as amount,
    q.status as event_status,
    q.quotation_number as reference_number
FROM projects p
JOIN quotations q ON p.id = q.project_id
WHERE q.status != 'draft'

UNION ALL

SELECT 
    p.id as project_id,
    p.name as project_name,
    p.start_date,
    p.end_date,
    p.status,
    'invoice' as event_type,
    i.invoice_date as event_date,
    i.total_amount as amount,
    i.status as event_status,
    i.invoice_number as reference_number
FROM projects p
JOIN invoices i ON p.id = i.project_id
WHERE i.status IN ('sent', 'paid')

ORDER BY project_id, event_date;
```

---

## 5. Enhanced Pages & Routes

### Public Routes:
* `/(auth)/login` – Better Auth form with role redirect

### Protected Routes (Enhanced):
* `/overview` – Dashboard with quotation pipeline and conversion metrics
* `/projects` – Project management with quotation tracking
* `/projects/[id]` – Project details with quotation/invoice timeline
* `/projects/[id]/quotations` – Project-specific quotation management

### NEW Quotation Routes:
* `/quotations` – Quotation dashboard and list
* `/quotations/create` – Create new quotation
* `/quotations/[id]` – View quotation details
* `/quotations/[id]/edit` – Edit quotation
* `/quotations/[id]/duplicate` – Duplicate quotation with revisions
* `/quotations/[id]/convert` – 🚀 One-click conversion to invoice
* `/quotations/analytics` – Quotation performance analytics

### Enhanced Analytics Routes:
* `/items` – Master items with quotation frequency data
* `/items/[id]` – Item analytics including quotation vs invoice performance
* `/invoices` – Invoice management with conversion tracking
* `/analytics` – Advanced analytics including sales pipeline

---

## 6. Enhanced Forms and Components

### NEW Quotation Forms:

```tsx
// Create/Edit Quotation Form
interface QuotationForm {
  projectId: number;
  quotationDate: Date;
  validUntil: Date;
  clientContact: string;
  terms: string;
  notes?: string;
  items: QuotationItemForm[];
}

// Quotation Line Item Form
interface QuotationItemForm {
  projectItemId: number;
  quantity: number;
  unitPrice: number;
  duration: string; // "Per day", "Per week", "One-time"
  lineDescription?: string;
}

// Quotation Status Management
interface QuotationStatusUpdate {
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  notes?: string;
  acceptedDate?: Date;
  rejectionReason?: string;
}

// 🚀 One-Click Conversion Preview
interface ConversionPreview {
  quotationId: number;
  quotationTotal: number;
  proposedInvoiceDate: Date;
  proposedDueDate: Date;
  itemsToConvert: QuotationItem[];
  estimatedVariance?: number;
}
```

### Enhanced Existing Forms:

```tsx
// Enhanced Invoice Form (with quotation linkage)
interface EnhancedInvoiceForm {
  projectId: number;
  quotationId?: number; // NEW - Link to source quotation
  convertedFromQuotation?: boolean; // NEW - Conversion flag
  invoiceDate: Date;
  dueDate?: Date;
  items: InvoiceItemForm[];
  notes?: string;
}

// Master Item Form (unchanged but enhanced analytics)
interface MasterItemForm {
  categoryId: number;
  name: string;
  description?: string;
}

// Project Item Setup (unchanged)
interface ProjectItemForm {
  masterItemId: number;
  projectSpecificName?: string;
  costPrice: number;
  sellingPrice: number;
}
```

---

## 7. Enhanced Server Actions

### NEW Quotation Management Actions:

```tsx
// Core Quotation CRUD
async function createQuotation(data: CreateQuotationData): Promise<Quotation>
async function getQuotation(id: number): Promise<QuotationWithItems | null>
async function updateQuotation(id: number, updates: Partial<QuotationData>): Promise<Quotation>
async function deleteQuotation(id: number): Promise<void>
async function duplicateQuotation(id: number, revisionNotes?: string): Promise<Quotation>

// Quotation Status Management
async function updateQuotationStatus(id: number, status: QuotationStatus, metadata?: StatusMetadata): Promise<void>
async function sendQuotation(id: number, recipientEmail: string): Promise<void>
async function markQuotationExpired(id: number): Promise<void>
async function acceptQuotation(id: number, acceptedDate: Date): Promise<void>
async function rejectQuotation(id: number, reason?: string): Promise<void>

// 🚀 ONE-CLICK CONVERSION - Flagship Feature
async function convertQuotationToInvoice(
  quotationId: number, 
  options?: ConversionOptions
): Promise<Invoice> {
  return await db.transaction(async (tx) => {
    // 1. Validate quotation exists and can be converted
    const quotation = await getQuotationWithItems(quotationId);
    if (!quotation || quotation.status === 'converted') {
      throw new Error('Quotation cannot be converted');
    }

    // 2. Generate new invoice number
    const invoiceNumber = await generateInvoiceNumber(quotation.projectId);

    // 3. Create invoice with identical structure
    const invoice = await tx.insert(invoices).values({
      projectId: quotation.projectId,
      quotationId: quotation.id,
      convertedFromQuotation: true,
      invoiceNumber,
      invoiceDate: options?.invoiceDate || new Date(),
      dueDate: options?.dueDate || addDays(new Date(), 30),
      status: 'draft',
      totalAmount: quotation.totalAmount,
      notes: quotation.notes,
    }).returning();

    // 4. Copy all quotation items to invoice items
    const invoiceItemsData = quotation.items.map(item => ({
      invoiceId: invoice[0].id,
      projectItemId: item.projectItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      lineDescription: item.lineDescription,
    }));

    await tx.insert(invoiceItems).values(invoiceItemsData);

    // 5. Update quotation status and conversion timestamp
    await tx.update(quotations)
      .set({ 
        status: 'converted', 
        convertedDate: new Date() 
      })
      .where(eq(quotations.id, quotationId));

    // 6. Update project quotation tracking
    await updateProjectQuotationStats(quotation.projectId);

    return invoice[0];
  });
}

async function getConversionPreview(quotationId: number): Promise<ConversionPreview>
async function bulkConvertQuotations(quotationIds: number[]): Promise<Invoice[]>
async function undoConversion(invoiceId: number): Promise<void> // Emergency rollback

// Quotation Analytics Actions
async function getQuotationsByProject(projectId: number, status?: QuotationStatus): Promise<Quotation[]>
async function getQuotationPerformance(organizationId: number, dateRange?: DateRange): Promise<QuotationPerformance>
async function getConversionMetrics(organizationId: number): Promise<ConversionMetrics>
async function getQuotationVsInvoiceVariance(quotationId: number): Promise<VarianceAnalysis>
async function getExpiredQuotations(organizationId: number): Promise<Quotation[]>
async function getQuotationPipeline(organizationId: number): Promise<PipelineData>

// Advanced Quotation Analytics
async function getItemQuotationPerformance(masterItemId: number): Promise<ItemQuotationStats>
async function getWinLossAnalysis(organizationId: number, dateRange?: DateRange): Promise<WinLossData>
async function getPricingIntelligence(organizationId: number): Promise<PricingInsights>
async function getSalesForecasting(organizationId: number): Promise<ForecastData>
```

### Enhanced Existing Actions:

```tsx
// Enhanced Project Analytics (with quotation data)
async function getProjectTimeline(projectId: number, includeQuotations?: boolean): Promise<TimelineData>
async function getProjectSummary(projectId: number): Promise<EnhancedProjectSummary> // Now includes quotation metrics

// Enhanced Item Analytics (with quotation performance)
async function getMasterItemPerformance(masterItemId?: number): Promise<EnhancedItemPerformance>
async function compareItemAcrossProjects(masterItemId: number): Promise<CrossProjectComparison> // Now includes quotation data

// Enhanced Invoice Actions (with conversion tracking)
async function getInvoicesByProject(projectId: number): Promise<EnhancedInvoice[]> // Shows quotation linkage
async function getConvertedInvoices(organizationId: number): Promise<ConvertedInvoice[]>
```

### NEW PDF and Email Actions:

```tsx
// Document Generation
async function generateQuotationPDF(quotationId: number): Promise<Buffer>
async function generateInvoicePDF(invoiceId: number): Promise<Buffer>
async function generateConversionReport(quotationId: number, invoiceId: number): Promise<Buffer>

// Email Services
async function emailQuotation(quotationId: number, recipientEmail: string, message?: string): Promise<void>
async function sendQuotationReminder(quotationId: number): Promise<void>
async function notifyConversion(quotationId: number, invoiceId: number): Promise<void>
```

---

## 8. Enhanced Role-Based Access Control

**Roles:** `admin`, `sales_manager`, `project_manager`, `accountant`, `viewer`

### Role Permissions:

| Action | Admin | Sales Manager | Project Manager | Accountant | Viewer |
|--------|-------|---------------|-----------------|------------|--------|
| **Quotations** |
| Create Quotations | ✅ | ✅ | ✅ (own projects) | ❌ | ❌ |
| Edit Quotations | ✅ | ✅ | ✅ (own projects) | ❌ | ❌ |
| Send Quotations | ✅ | ✅ | ✅ (own projects) | ❌ | ❌ |
| View All Quotations | ✅ | ✅ | ❌ | ✅ | ❌ |
| **🚀 One-Click Convert** | ✅ | ✅ | ✅ (own projects) | ✅ | ❌ |
| **Analytics** |
| Quotation Pipeline | ✅ | ✅ | ✅ (own projects) | ✅ | ✅ |
| Conversion Metrics | ✅ | ✅ | ❌ | ✅ | ❌ |
| Win/Loss Analysis | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pricing Intelligence | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 9. Enhanced Data Entry Flow

### Setup Phase (Enhanced):
1. **Create Item Categories** ("Construction Equipment", "Transport Vehicles")
2. **Create Master Items** ("8 ton dropside", "14 cube tipper", "Dozer CAT D6")
3. **Create Projects** with start/end dates and quotation targets
4. **Link Items to Projects** with project-specific pricing

### NEW Sales Phase:
1. **Create Quotations** for potential project work
2. **Send Quotations** to clients with tracking
3. **Manage Quotation Status** (sent → accepted/rejected/expired)
4. **🚀 One-Click Convert** accepted quotations to invoices

### Billing Phase (Enhanced):
1. **Review Converted Invoices** or create new ones
2. **Manage Invoice Items** with actual quantities/prices
3. **Track Invoice Status** with quotation linkage
4. **Analyze Conversion Performance** and pricing variance

---

## 10. Enhanced Analytics Capabilities

### NEW Quotation Analytics:
- **Sales Pipeline Value**: Total value of active quotations
- **Conversion Rates**: Quotation acceptance and conversion percentages
- **Win/Loss Analysis**: Detailed breakdown of quotation outcomes
- **Response Time Tracking**: Client response patterns and timing
- **Pricing Intelligence**: Optimal pricing based on acceptance rates
- **Revenue Forecasting**: Pipeline-based revenue predictions

### Enhanced Project Analytics:
- **Quotation Pipeline per Project**: Active quotes and conversion potential
- **Quote-to-Invoice Timeline**: Complete sales-to-billing cycle tracking
- **Revenue Recognition**: Quoted vs actual invoiced amounts
- **Client Engagement**: Quotation request frequency and patterns

### Enhanced Item Analytics:
- **Quotation Frequency**: How often items are quoted vs accepted
- **Price Acceptance Rates**: Which pricing strategies work best
- **Market Positioning**: Competitive pricing analysis
- **Demand Forecasting**: Item popularity and seasonal trends

### NEW Conversion Analytics:
- **Conversion Time**: Average time from quotation to invoice
- **Amount Variance**: Differences between quoted and invoiced amounts
- **Success Factors**: What makes quotations more likely to convert
- **Process Efficiency**: Bottlenecks in the sales-
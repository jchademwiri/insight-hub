# Quotation System - Required Changes and Additions

## 1. Database Schema Changes

### New Tables to Add:

```typescript
// quotations table
export const quotations = pgTable('quotations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  quotationNumber: varchar('quotation_number', { length: 100 }).notNull().unique(),
  quotationDate: date('quotation_date').notNull(),
  validUntil: date('valid_until').notNull(), // Expiry date
  status: varchar('status', { length: 20 }).notNull().default('draft'), 
  // 'draft', 'sent', 'accepted', 'rejected', 'expired', 'converted', 'cancelled'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  terms: text('terms'), // Terms and conditions specific to quotation
  clientContact: varchar('client_contact', { length: 255 }), // Who requested the quote
  createdBy: integer('created_by').references(() => users.id),
  acceptedDate: date('accepted_date'), // When client accepted
  convertedDate: timestamp('converted_date'), // When converted to invoice
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectStatusIdx: index('idx_quotation_project_status').on(table.projectId, table.status),
  validityIdx: index('idx_quotation_validity').on(table.validUntil, table.status),
  numberIdx: uniqueIndex('idx_quotation_number').on(table.quotationNumber),
}));

// quotation_items table
export const quotationItems = pgTable('quotation_items', {
  id: serial('id').primaryKey(),
  quotationId: integer('quotation_id').notNull().references(() => quotations.id),
  projectItemId: integer('project_item_id').notNull().references(() => projectItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  lineDescription: text('line_description'),
  duration: varchar('duration', { length: 100 }), // "Per day", "Per week", "One-time"
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  quotationIdx: index('idx_quotation_items_quotation').on(table.quotationId),
  projectItemIdx: index('idx_quotation_items_project_item').on(table.projectItemId),
}));

// quotation_revisions table (for tracking changes)
export const quotationRevisions = pgTable('quotation_revisions', {
  id: serial('id').primaryKey(),
  quotationId: integer('quotation_id').notNull().references(() => quotations.id),
  revisionNumber: integer('revision_number').notNull().default(1),
  changes: jsonb('changes'), // What changed from previous version
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  quotationRevisionIdx: index('idx_quotation_revision').on(table.quotationId, table.revisionNumber),
}));
```

### Updates to Existing Tables:

```typescript
// Add quotation relationship to invoices table
export const invoices = pgTable('invoices', {
  // ... existing fields
  quotationId: integer('quotation_id').references(() => quotations.id), // Links back to source quotation
  convertedFromQuotation: boolean('converted_from_quotation').default(false), // Quick flag for converted invoices
  // ... rest of existing fields
});

// Add quotation tracking to projects
export const projects = pgTable('projects', {
  // ... existing fields
  quotationCount: integer('quotation_count').default(0), // NEW FIELD
  acceptedQuotationValue: decimal('accepted_quotation_value', { precision: 10, scale: 2 }), // NEW FIELD
  // ... rest of existing fields
});
```

---

## 2. New Database Views for Analytics

```sql
-- Quotation Performance Analysis
CREATE VIEW quotation_performance_analysis AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    COUNT(q.id) as total_quotations,
    COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotations,
    COUNT(CASE WHEN q.status = 'rejected' THEN 1 END) as rejected_quotations,
    COUNT(CASE WHEN q.status = 'expired' THEN 1 END) as expired_quotations,
    COUNT(CASE WHEN q.status = 'converted' THEN 1 END) as converted_quotations,
    SUM(CASE WHEN q.status = 'accepted' THEN q.total_amount ELSE 0 END) as accepted_value,
    AVG(CASE WHEN q.status = 'accepted' THEN q.total_amount END) as avg_accepted_value,
    ROUND(
        COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) * 100.0 / NULLIF(COUNT(q.id), 0), 2
    ) as acceptance_rate
FROM projects p
LEFT JOIN quotations q ON p.id = q.project_id
GROUP BY p.id, p.name;

-- Quotation to Invoice Conversion Tracking
CREATE VIEW quotation_conversion_tracking AS
SELECT 
    q.id as quotation_id,
    q.quotation_number,
    q.total_amount as quoted_amount,
    i.id as invoice_id,
    i.invoice_number,
    i.total_amount as invoiced_amount,
    i.total_amount - q.total_amount as amount_variance,
    q.accepted_date,
    i.invoice_date,
    i.invoice_date - q.accepted_date as conversion_time_days
FROM quotations q
LEFT JOIN invoices i ON q.converted_to_invoice_id = i.id
WHERE q.status IN ('accepted', 'converted');

-- Item Quotation vs Actual Performance
CREATE VIEW item_quotation_vs_actual AS
SELECT 
    mi.id as master_item_id,
    mi.name as item_name,
    COUNT(qi.id) as times_quoted,
    COUNT(ii.id) as times_invoiced,
    AVG(qi.unit_price) as avg_quoted_price,
    AVG(ii.unit_price) as avg_invoiced_price,
    AVG(ii.unit_price) - AVG(qi.unit_price) as avg_price_variance,
    SUM(qi.total_price) as total_quoted_value,
    SUM(ii.total_price) as total_invoiced_value
FROM master_items mi
LEFT JOIN project_items pi ON mi.id = pi.master_item_id
LEFT JOIN quotation_items qi ON pi.id = qi.project_item_id
LEFT JOIN quotations q ON qi.quotation_id = q.id AND q.status IN ('accepted', 'converted')
LEFT JOIN invoice_items ii ON pi.id = ii.project_item_id
LEFT JOIN invoices inv ON ii.invoice_id = inv.id AND inv.status IN ('sent', 'paid')
GROUP BY mi.id, mi.name;
```

---

## 3. Server Actions for One-Click Conversion

```typescript
// Quotation Management Actions
async function createQuotation(projectId: number, quotationData: CreateQuotationData)
async function updateQuotation(quotationId: number, updates: UpdateQuotationData)
async function duplicateQuotation(quotationId: number, revisionNotes?: string)
async function sendQuotation(quotationId: number, recipientEmail: string)

// 🚀 ONE-CLICK CONVERSION - Core Feature
async function convertQuotationToInvoice(quotationId: number, options?: ConversionOptions) {
  // 1. Validate quotation exists and can be converted
  const quotation = await getQuotationWithItems(quotationId);
  if (!quotation || quotation.status === 'converted') {
    throw new Error('Quotation cannot be converted');
  }

  // 2. Create invoice with identical structure
  const invoiceData = {
    projectId: quotation.projectId,
    quotationId: quotation.id,
    convertedFromQuotation: true,
    invoiceDate: new Date(),
    dueDate: options?.dueDate || addDays(new Date(), 30),
    status: 'draft',
    totalAmount: quotation.totalAmount,
    notes: quotation.notes,
  };

  const invoice = await createInvoiceFromQuotation(invoiceData);

  // 3. Copy all quotation items to invoice items
  await copyQuotationItemsToInvoice(quotation.items, invoice.id);

  // 4. Update quotation status and link
  await updateQuotation(quotationId, {
    status: 'converted',
    convertedDate: new Date(),
  });

  // 5. Return the new invoice for immediate editing/sending
  return invoice;
}

async function getQuotationConversionPreview(quotationId: number) // Preview before conversion
async function bulkConvertQuotations(quotationIds: number[]) // Convert multiple quotes

// Quotation Analytics Actions
async function getQuotationPerformanceByProject(projectId: number)
async function getQuotationConversionRates(organizationId: number, dateRange?: DateRange)
async function getQuotationVsInvoiceVariance(quotationId: number)
async function getItemQuotationPerformance(masterItemId: number)
async function getExpiredQuotations(organizationId: number)

// Quotation Reporting Actions
async function generateQuotationPDF(quotationId: number)
async function getQuotationHistory(quotationId: number)
async function getQuotationsByStatus(projectId: number, status: QuotationStatus)
```

---

## 4. New Form Components Required

### Quotation Creation Form
```typescript
interface CreateQuotationForm {
  projectId: number;
  quotationDate: Date;
  validUntil: Date;
  clientContact: string;
  terms: string;
  notes?: string;
  items: {
    projectItemId: number;
    quantity: number;
    unitPrice: number;
    duration: string;
    lineDescription?: string;
  }[];
}
```

### Quotation Item Management
```typescript
interface QuotationItemForm {
  projectItemId: number;
  quantity: number;
  unitPrice: number;
  duration: string; // "Per day", "Per week", "One-time"
  lineDescription?: string;
}
```

### Quotation Status Management
```typescript
interface QuotationStatusUpdate {
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  notes?: string;
  acceptedDate?: Date;
  rejectionReason?: string;
}
```

---

## 5. New Pages/Routes Required

```
/quotations
├── /                          # Quotations list/dashboard
├── /create                    # Create new quotation
├── /[id]                      # View quotation details
├── /[id]/edit                 # Edit quotation
├── /[id]/duplicate            # Duplicate quotation
├── /[id]/convert              # Convert to invoice
└── /analytics                 # Quotation analytics dashboard
```

---

## 6. Enhanced Analytics Dashboards

### Quotation Analytics Dashboard
- **Conversion Rates**: Quotations accepted vs rejected vs expired
- **Time to Acceptance**: Average time from quotation to acceptance
- **Value Analysis**: Quoted vs actual invoiced amounts
- **Item Performance**: Which items are most often quoted vs accepted
- **Seasonal Trends**: Quotation activity over time

### Enhanced Project Dashboard
- **Quotation Pipeline**: Active quotations per project
- **Win Rate**: Project quotation acceptance rates
- **Quote to Invoice**: Conversion tracking and variance analysis
- **Revenue Forecasting**: Based on pending quotations

### Enhanced Item Performance Dashboard
- **Quotation Frequency**: How often items are quoted
- **Acceptance Rates**: Which items have highest acceptance rates
- **Price Variance**: Quoted vs actual invoiced prices
- **Market Positioning**: Competitive pricing analysis

---

## 7. Workflow Integration Changes

### New Business Process Flow:
1. **Project Setup** → Create project and link items
2. **Quotation Creation** → Generate quotes for potential work
3. **Quotation Management** → Send, track, revise quotations
4. **One-Click Conversion** → Convert quotation to invoice instantly
5. **Invoice Processing** → Existing invoice workflow (now with quotation linkage)

### One-Click Conversion Process:
```typescript
// Core conversion logic
async function convertQuotationToInvoice(quotationId: number) {
  // 1. Validate quotation can be converted
  // 2. Create invoice with identical line items
  // 3. Link invoice back to quotation
  // 4. Update quotation status to 'converted'
  // 5. Preserve all quotation data for audit trail
}
```

### Updated User Roles:
- **Sales Manager**: Can create, send, and manage quotations
- **Project Manager**: Can view quotations for their projects
- **Admin**: Full quotation management and analytics access
- **Accountant**: Can convert quotations to invoices

---

## 8. Updated Development Plan Changes

### Phase 2 Additions:
- [ ] Create quotation schema and relationships
- [ ] Build quotation numbering system
- [ ] Implement quotation status workflow

### Phase 3 Enhancements:
- [ ] Build quotation creation workflow
- [ ] Implement quotation-to-invoice conversion
- [ ] Create quotation PDF generation
- [ ] Add quotation email functionality

### Phase 5 Analytics Additions:
- [ ] Build quotation performance analytics
- [ ] Create conversion rate tracking
- [ ] Implement quotation vs invoice variance analysis
- [ ] Add quotation pipeline visualization

---

## 9. Key Quotation Features

### Essential Quotation Capabilities:
- **Quotation Numbering**: Auto-generated quotation numbers
- **Validity Periods**: Automatic expiry tracking
- **Revision Management**: Track quotation changes and versions
- **Client Communication**: Email quotations with tracking
- **🚀 One-Click Conversion**: Instant quotation → invoice transformation
- **Audit Trail**: Complete conversion history and linkage

### One-Click Conversion Features:
- **Instant Creation**: Convert entire quotation to invoice in one click
- **Data Preservation**: All line items, pricing, and descriptions carried over
- **Automatic Linking**: Bidirectional relationship between quote and invoice
- **Status Updates**: Quotation marked as 'converted', invoice created as 'draft'
- **Modification Support**: Invoice can be edited after conversion if needed
- **Audit Trail**: Complete history of what was converted when

### Advanced Quotation Analytics:
- **Win/Loss Analysis**: Track quotation success rates
- **Pricing Optimization**: Compare quoted vs accepted prices
- **Client Behavior**: Response time and acceptance patterns
- **Revenue Forecasting**: Pipeline value based on quotations
- **Competitive Analysis**: Price positioning insights

---

## 10. Impact on Existing Features

### Minimal Changes Required:
- **Projects**: Add quotation count and accepted value tracking
- **Items**: No structural changes needed
- **Users**: Add sales manager role capabilities
- **Organizations**: No changes required

### Enhanced Features:
- **Analytics**: Expanded to include quotation performance
- **Dashboards**: New quotation-specific KPIs and charts
- **Reporting**: Additional quotation-based reports
- **Workflows**: New quotation → invoice conversion process

---

This quotation system addition will significantly enhance the business value of your MVP by providing complete sales-to-billing workflow management and deeper insights into pricing effectiveness and conversion performance.
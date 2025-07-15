import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';

// ===========================
// ORGANIZATIONS TABLE
// ===========================
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status').default('active'), // 'active', 'inactive', 'trial'
  subscription: text('subscription').default('basic'), // 'basic', 'premium', 'enterprise'
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// USERS TABLE
// ===========================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // 'admin', 'finance', 'pm', 'operations'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// PROJECTS TABLE
// ===========================
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  projectNumber: text('project_number').notNull(),
  description: text('description'),
  client: text('client').notNull(),
  status: text('status').default('active'), // 'active', 'completed', 'on_hold', 'cancelled'
  duration: integer('duration'), // in days
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// EQUIPMENT TYPES TABLE
// ===========================
export const equipmentTypes = pgTable('equipment_types', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'), // 'heavy', 'light', 'transport', etc.
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// INVOICES TABLE
// ===========================
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number'),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  equipmentTypeId: integer('equipment_type_id')
    .notNull()
    .references(() => equipmentTypes.id, { onDelete: 'restrict' }),
  date: date('date').notNull(),
  amount: integer('amount').notNull(), // in cents
  status: text('status').default('pending'), // 'paid', 'pending', 'unpaid', 'overdue'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// EXPENSES TABLE
// ===========================
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), // 'fuel', 'salary', 'maintenance', 'parts', etc.
  amount: integer('amount').notNull(), // in cents
  description: text('description'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ===========================
// RELATIONS
// ===========================

// Organization Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  projects: many(projects),
  equipmentTypes: many(equipmentTypes),
}));

// User Relations
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

// Project Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  invoices: many(invoices),
}));

// Equipment Types Relations
export const equipmentTypesRelations = relations(equipmentTypes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [equipmentTypes.organizationId],
    references: [organizations.id],
  }),
  invoices: many(invoices),
}));

// Invoice Relations
export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  equipmentType: one(equipmentTypes, {
    fields: [invoices.equipmentTypeId],
    references: [equipmentTypes.id],
  }),
  expenses: many(expenses),
}));

// Expense Relations
export const expensesRelations = relations(expenses, ({ one }) => ({
  invoice: one(invoices, {
    fields: [expenses.invoiceId],
    references: [invoices.id],
  }),
}));

// ===========================
// TYPES (for TypeScript)
// ===========================

// Insert Types
export type InsertOrganization = typeof organizations.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type InsertProject = typeof projects.$inferInsert;
export type InsertEquipmentType = typeof equipmentTypes.$inferInsert;
export type InsertInvoice = typeof invoices.$inferInsert;
export type InsertExpense = typeof expenses.$inferInsert;

// Select Types
export type SelectOrganization = typeof organizations.$inferSelect;
export type SelectUser = typeof users.$inferSelect;
export type SelectProject = typeof projects.$inferSelect;
export type SelectEquipmentType = typeof equipmentTypes.$inferSelect;
export type SelectInvoice = typeof invoices.$inferSelect;
export type SelectExpense = typeof expenses.$inferSelect;

// Extended Types with Relations
export type OrganizationWithUsers = SelectOrganization & {
  users: SelectUser[];
};

export type ProjectWithInvoices = SelectProject & {
  invoices: SelectInvoice[];
};

export type InvoiceWithExpenses = SelectInvoice & {
  expenses: SelectExpense[];
  project: SelectProject;
  equipmentType: SelectEquipmentType;
};

export type FullInvoiceDetails = SelectInvoice & {
  project: SelectProject & {
    organization: SelectOrganization;
  };
  equipmentType: SelectEquipmentType;
  expenses: SelectExpense[];
};

// ===========================
// ENUMS (for validation)
// ===========================

export const USER_ROLES = ['admin', 'finance', 'pm', 'operations'] as const;
export const PROJECT_STATUSES = ['active', 'completed', 'on_hold', 'cancelled'] as const;
export const INVOICE_STATUSES = ['paid', 'pending', 'unpaid', 'overdue'] as const;
export const ORGANIZATION_STATUSES = ['active', 'inactive', 'trial'] as const;
export const SUBSCRIPTION_TYPES = ['basic', 'premium', 'enterprise'] as const;
export const EXPENSE_CATEGORIES = [
  'fuel',
  'salary',
  'maintenance',
  'parts',
  'insurance',
  'transport',
  'other'
] as const;

export type UserRole = typeof USER_ROLES[number];
export type ProjectStatus = typeof PROJECT_STATUSES[number];
export type InvoiceStatus = typeof INVOICE_STATUSES[number];
export type OrganizationStatus = typeof ORGANIZATION_STATUSES[number];
export type SubscriptionType = typeof SUBSCRIPTION_TYPES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
import { pgTable, serial, text, integer, date, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects'
import { equipmentTypes } from './equipment-types'

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number'),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  equipmentTypeId: integer('equipment_type_id').references(() => equipmentTypes.id).notNull(),
  date: date('date').notNull(),
  amount: integer('amount').notNull(), // Amount in cents to avoid floating point issues
  status: text('status').notNull().default('pending'), // 'pending', 'paid', 'overdue'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
import { pgTable, serial, text, integer, date, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  projectNumber: text('project_number').notNull(),
  description: text('description'),
  client: text('client').notNull(),
  status: text('status').notNull().default('active'), // 'active', 'completed', 'at_risk'
  duration: integer('duration').notNull(), // in days
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
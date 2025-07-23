import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  email: text('email').notNull(),
  supabaseId: text('supabase_id').notNull().unique(), // Supabase auth user ID
  role: text('role').notNull(), // 'executive', 'project_manager', 'operations', 'finance'
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
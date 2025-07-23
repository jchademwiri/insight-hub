import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const equipmentTypes = pgTable('equipment_types', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  category: text('category'), // e.g. "Heavy", "Light"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type EquipmentType = typeof equipmentTypes.$inferSelect
export type NewEquipmentType = typeof equipmentTypes.$inferInsert
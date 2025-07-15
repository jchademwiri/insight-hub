# Multi-Tenant Database Design Update

## 🏢 New Table: `organizations`

> Master table for multi-tenancy

| Field          | Type        | Notes                              |
| -------------- | ----------- | ---------------------------------- |
| `id`           | `serial`    | Primary key                        |
| `name`         | `text`      | Organization name                  |
| `slug`         | `text`      | URL-friendly identifier (unique)   |
| `status`       | `text`      | 'active', 'inactive', 'trial'     |
| `subscription` | `text`      | 'basic', 'premium', 'enterprise'  |
| `settings`     | `jsonb`     | Org-specific configurations        |
| `created_at`   | `timestamp` | Defaults to `now()`                |
| `updated_at`   | `timestamp` | Auto-updated                       |

---

## 🔄 Updated Tables with Organization FK

### 🧍 `users` (Updated)

| Field            | Type        | Notes                             |
| ---------------- | ----------- | --------------------------------- |
| `id`             | `serial`    | Primary key                       |
| `organization_id`| `integer`   | **FK → `organizations.id`**       |
| `email`          | `text`      | Unique within organization        |
| `password_hash`  | `text`      | Supabase handles hashing          |
| `role`           | `text`      | e.g. 'admin', 'finance', 'pm'     |
| `created_at`     | `timestamp` | Defaults to `now()`               |

### 🏗️ `projects` (Updated)

| Field            | Type      | Notes                                    |
| ---------------- | --------- | ---------------------------------------- |
| `id`             | `serial`  | Primary key                              |
| `organization_id`| `integer` | **FK → `organizations.id`**              |
| `project_number` | `text`    | e.g. "STP 002"                           |
| `description`    | `text`    | Optional                                 |
| `client`         | `text`    | Name or client ID                        |
| `status`         | `text`    | e.g. 'active', 'completed'               |
| `duration`       | `integer` | In days or weeks                         |
| `start_date`     | `date`    | Required                                 |
| `end_date`       | `date`    | Can be calculated or manually overridden |

### 🚜 `equipment_types` (Updated)

| Field            | Type     | Notes                        |
| ---------------- | -------- | ---------------------------- |
| `id`             | `serial` | Primary key                  |
| `organization_id`| `integer`| **FK → `organizations.id`**  |
| `name`           | `text`   | e.g. "Tipper", "Grader"      |
| `category`       | `text`   | Optional (e.g. Heavy, Light) |
| `description`    | `text`   | Optional                     |

### 📄 `invoices` (No changes needed)

> Already connected to projects, inherits organization through project relationship

| Field               | Type      | Notes                            |
| ------------------- | --------- | -------------------------------- |
| `id`                | `serial`  | Primary key                      |
| `invoice_number`    | `text`    | Optional but helpful             |
| `project_id`        | `integer` | FK → `projects.id`               |
| `equipment_type_id` | `integer` | FK → `equipment_types.id`        |
| `date`              | `date`    | Date of service or invoice       |
| `amount`            | `integer` | Revenue for this equipment use   |
| `status`            | `text`    | e.g. 'paid', 'pending', 'unpaid' |
| `notes`             | `text`    | Optional free-text               |

### 💸 `expenses` (No changes needed)

> Already connected to invoices, inherits organization through invoice → project relationship

| Field         | Type      | Notes                          |
| ------------- | --------- | ------------------------------ |
| `id`          | `serial`  | Primary key                    |
| `invoice_id`  | `integer` | FK → `invoices.id`             |
| `category`    | `text`    | e.g. fuel, salary, maintenance |
| `amount`      | `integer` | Cost in cents or full currency |
| `description` | `text`    | Optional                       |
| `date`        | `date`    | When the cost occurred         |

---

## 🔗 Updated Relationship Summary

| Table             | Foreign Keys                                  |
| ----------------- | --------------------------------------------- |
| `organizations`   | —                                             |
| `users`           | `organization_id`                             |
| `projects`        | `organization_id`                             |
| `equipment_types` | `organization_id`                             |
| `invoices`        | `project_id`, `equipment_type_id`             |
| `expenses`        | `invoice_id`                                  |

---

## 🔐 Row Level Security (RLS) Policies

### Supabase RLS Implementation

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own organization's data
CREATE POLICY "Users can only access their organization" ON users
  FOR ALL USING (organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Projects scoped to organization" ON projects
  FOR ALL USING (organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Equipment types scoped to organization" ON equipment_types
  FOR ALL USING (organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Invoices inherit organization through projects
CREATE POLICY "Invoices scoped to organization" ON invoices
  FOR ALL USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Expenses inherit organization through invoices → projects
CREATE POLICY "Expenses scoped to organization" ON expenses
  FOR ALL USING (
    invoice_id IN (
      SELECT i.id FROM invoices i
      JOIN projects p ON i.project_id = p.id
      WHERE p.organization_id = (
        SELECT organization_id FROM users WHERE id = auth.uid()
      )
    )
  );
```

---

## 🧮 Updated Example Queries

### Total Revenue Per Equipment Type (Organization-Scoped)

```sql
SELECT 
  et.name, 
  SUM(i.amount) as revenue
FROM invoices i
JOIN equipment_types et ON i.equipment_type_id = et.id
JOIN projects p ON i.project_id = p.id
WHERE p.organization_id = $1  -- Current user's organization
GROUP BY et.name;
```

### Profit Per Equipment Type (Organization-Scoped)

```sql
SELECT
  et.name,
  SUM(i.amount) AS revenue,
  COALESCE(SUM(e.amount), 0) AS costs,
  SUM(i.amount) - COALESCE(SUM(e.amount), 0) AS profit
FROM invoices i
JOIN equipment_types et ON i.equipment_type_id = et.id
JOIN projects p ON i.project_id = p.id
LEFT JOIN expenses e ON e.invoice_id = i.id
WHERE p.organization_id = $1  -- Current user's organization
GROUP BY et.name;
```

### Cross-Organization Analytics (Admin Only)

```sql
-- Total revenue across all organizations
SELECT 
  o.name as organization,
  SUM(i.amount) as total_revenue
FROM invoices i
JOIN projects p ON i.project_id = p.id
JOIN organizations o ON p.organization_id = o.id
GROUP BY o.name, o.id
ORDER BY total_revenue DESC;
```

---

## 🚀 Implementation Strategy

### Phase 1: Database Migration

1. **Create organizations table**
2. **Add organization_id to users, projects, equipment_types**
3. **Create default organization** for existing data
4. **Update all existing records** with default organization_id
5. **Add NOT NULL constraints** after data migration

### Phase 2: Application Updates

1. **Update Drizzle schema** with new relationships
2. **Add organization context** to all queries
3. **Implement RLS policies** in Supabase
4. **Update authentication** to include organization

### Phase 3: User Experience

1. **Organization switcher** in navigation
2. **Organization settings** page
3. **User invitation** system
4. **Billing integration** (if needed)

---

## 🎯 Multi-Tenant Benefits

### ✅ Data Isolation
- Complete separation between organizations
- Built-in security through RLS
- No accidental data leakage

### ✅ Scalability
- Single database, multiple tenants
- Shared infrastructure costs
- Easy to add new organizations

### ✅ Customization
- Organization-specific settings
- Custom branding per org
- Flexible subscription models

### ✅ Analytics
- Cross-tenant insights (with permissions)
- Usage metrics per organization
- Billing and subscription tracking

---

## 🔄 Migration SQL Example

```sql
-- Step 1: Create organizations table
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  subscription TEXT DEFAULT 'basic',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Add organization_id columns
ALTER TABLE users ADD COLUMN organization_id INTEGER;
ALTER TABLE projects ADD COLUMN organization_id INTEGER;
ALTER TABLE equipment_types ADD COLUMN organization_id INTEGER;

-- Step 3: Create default organization
INSERT INTO organizations (name, slug) VALUES ('Default Organization', 'default');

-- Step 4: Update existing records
UPDATE users SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE projects SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE equipment_types SET organization_id = 1 WHERE organization_id IS NULL;

-- Step 5: Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_organization 
  FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE projects ADD CONSTRAINT fk_projects_organization 
  FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE equipment_types ADD CONSTRAINT fk_equipment_types_organization 
  FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- Step 6: Make columns NOT NULL
ALTER TABLE users ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE projects ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE equipment_types ALTER COLUMN organization_id SET NOT NULL;
```
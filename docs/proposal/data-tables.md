To support all your Insight Hub features — including project-based and ad-hoc quoting, inventory with project-specific pricing, invoices, analytics, user roles, and full change logging — here’s a complete list of **recommended tables**, grouped by function.

---

## 🗂️ **Core Table Structure**

### 1. 🧍‍♂️ **Users & Roles**

| Table Name   | Purpose                                                                               |
| ------------ | ------------------------------------------------------------------------------------- |
| `users`      | Stores user details and auth info                                                     |
| `roles`      | List of available roles (Admin, Sales Manager, etc.)                                  |
| `user_roles` | Many-to-many: Assign users to roles (supports multiple organizations if multi-tenant) |

---

### 2. 🏢 **Organizations & Clients**

| Table Name      | Purpose                                                            |
| --------------- | ------------------------------------------------------------------ |
| `organizations` | Companies using the system (if multi-tenant)                       |
| `clients`       | Government departments or municipalities awarding tenders/projects |

---

### 3. 🏗️ **Projects & Project Items**

| Table Name      | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `projects`      | Registered projects with start date, client, etc.                           |
| `project_items` | Items assigned to a specific project (with pricing & project-specific code) |

---

### 4. 🔧 **Inventory (Master Items)**

| Table Name        | Purpose                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| `master_items`    | Company’s full list of plant, equipment, and services (with default ad-hoc price) |
| `item_categories` | Lookup table for organizing items (Plant Hire, Civil, Waste, etc.)                |

---

### 5. 📑 **Quotations**

| Table Name        | Purpose                                                             |
| ----------------- | ------------------------------------------------------------------- |
| `quotations`      | Quote header (client, project, totals, dates)                       |
| `quotation_items` | Line items in a quote (linked to `project_items` or `master_items`) |

---

### 6. 💸 **Invoices**

| Table Name              | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `invoices`              | Invoice header (linked to quote or ad-hoc)                     |
| `invoice_items`         | Invoice line items (linked to quote items or entered manually) |
| `payments` *(optional)* | Track received payments per invoice                            |

---

### 7. 📊 **Analytics & Logs**

| Table Name                                     | Purpose                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `change_logs`                                  | Tracks all user-made changes (who/what/when)                                      |
| `quote_status_logs` *(optional)*               | Tracks quote lifecycle (draft → sent → accepted → invoiced)                       |
| `project_performance` *(view or materialized)* | Analytics table/view for dashboarding performance by project/client/item/category |

---

### 8. 🧩 **Optional Tables for Scale**

| Table Name             | Use                                         |
| ---------------------- | ------------------------------------------- |
| `notifications`        | For quote reminders or approval alerts      |
| `activity_logs`        | User-level audit trails beyond data changes |
| `document_attachments` | Store PDFs or scanned quote docs            |
| `project_notes`        | Internal notes/tasks on a project           |

---

## 🗃️ **Schema Notes**

* All `*_items` tables include `quantity`, `unit_price`, `total`, and optional notes
* Ad-hoc quotes link only to `master_items`, not `project_items`
* `quotation_items` and `invoice_items` must support both `project_item_id` and `master_item_id` (nullable one of them)
* `change_logs` uses polymorphic fields: `table_name`, `record_id`, `field_name`, `old_value`, `new_value`, `changed_by`

---

Would you like:

* A full **SQL schema** for this setup?
* A **visual ERD** diagram version of these tables?
* Or **backend models** in Prisma, Drizzle, or Supabase format?

Let me know how you'd like to proceed.

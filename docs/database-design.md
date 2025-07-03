
## ✅ Database Design Overview

### Tables:

1. \[`users`] – Authentication & roles
2. \[`equipment_types`] – Master list of reusable equipment
3. \[`projects`] – Project metadata
4. \[`invoices`] – Equipment usage per project
5. \[`expenses`] – Costs linked to invoices

---

### 🧍 `users`

> For login, auth, and role-based access

| Field           | Type        | Notes                         |
| --------------- | ----------- | ----------------------------- |
| `id`            | `serial`    | Primary key                   |
| `email`         | `text`      | Unique                        |
| `password_hash` | `text`      | Supabase handles hashing      |
| `role`          | `text`      | e.g. 'admin', 'finance', 'pm' |
| `created_at`    | `timestamp` | Defaults to `now()`           |

---

### 🏗️ `projects`

> Represents a construction project where equipment is hired

| Field            | Type      | Notes                                    |
| ---------------- | --------- | ---------------------------------------- |
| `id`             | `serial`  | Primary key                              |
| `project_number` | `text`    | e.g. "STP 002"                           |
| `description`    | `text`    | Optional                                 |
| `client`         | `text`    | Name or client ID                        |
| `status`         | `text`    | e.g. 'active', 'completed'               |
| `duration`       | `integer` | In days or weeks                         |
| `start_date`     | `date`    | Required                                 |
| `end_date`       | `date`    | Can be calculated or manually overridden |

---

### 🚜 `equipment_types`

> A reusable list of equipment categories (e.g. Tipper, Dropside)

| Field         | Type     | Notes                        |
| ------------- | -------- | ---------------------------- |
| `id`          | `serial` | Primary key                  |
| `name`        | `text`   | e.g. "Tipper", "Grader"      |
| `category`    | `text`   | Optional (e.g. Heavy, Light) |
| `description` | `text`   | Optional                     |

---

### 📄 `invoices`

> Tracks a specific use of equipment on a project, with revenue

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

---

### 💸 `expenses`

> Captures costs tied to a specific invoice

| Field         | Type      | Notes                          |
| ------------- | --------- | ------------------------------ |
| `id`          | `serial`  | Primary key                    |
| `invoice_id`  | `integer` | FK → `invoices.id`             |
| `category`    | `text`    | e.g. fuel, salary, maintenance |
| `amount`      | `integer` | Cost in cents or full currency |
| `description` | `text`    | Optional                       |
| `date`        | `date`    | When the cost occurred         |

---

## 🔗 Relationship Summary

| Table             | Foreign Keys                      |
| ----------------- | --------------------------------- |
| `projects`        | —                                 |
| `equipment_types` | —                                 |
| `invoices`        | `project_id`, `equipment_type_id` |
| `expenses`        | `invoice_id`                      |

---

## 🧮 Example Queries You Can Build

* **Total revenue per equipment type**:

  ```sql
  SELECT equipment_types.name, SUM(invoices.amount)
  FROM invoices
  JOIN equipment_types ON invoices.equipment_type_id = equipment_types.id
  GROUP BY equipment_types.name;
  ```

* **Profit per equipment type**:

  ```sql
  SELECT
    equipment_types.name,
    SUM(invoices.amount) AS revenue,
    SUM(expenses.amount) AS costs,
    SUM(invoices.amount) - SUM(expenses.amount) AS profit
  FROM invoices
  JOIN equipment_types ON invoices.equipment_type_id = equipment_types.id
  LEFT JOIN expenses ON expenses.invoice_id = invoices.id
  GROUP BY equipment_types.name;
  ```

---

## ✅ Benefits of This Design

* ✅ Simple & normalized
* ✅ Easily extendable (add logs, client tables later)
* ✅ Supports key metrics (profit by equipment/project/date)
* ✅ Keeps data clean — one source of truth per concept



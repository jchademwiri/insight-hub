# MVP Analytics Platform - Technical Specification

## 1. Overview

This document outlines the technical implementation plan for the MVP version of the Analytics Platform using Next.js 15, Supabase (PostgreSQL + Auth), Drizzle ORM, Tailwind CSS v4, ShadCN UI, and Recharts.

---

## 2. Tech Stack Summary

| Layer         | Technology                            |
| ------------- | ------------------------------------- |
| Frontend      | Next.js 15 (App Router), TypeScript   |
| Styling       | Tailwind CSS v4, ShadCN UI            |
| Charts        | Recharts                              |
| Backend Logic | Next.js Server Actions                |
| Auth          | Supabase Auth                         |
| Database      | PostgreSQL (via Supabase)             |
| ORM           | Drizzle ORM                           |
| Hosting       | Vercel (frontend), Supabase (backend) |

---

## 3. Folder Structure (Next.js App Router)

```
/app
  /dashboard (protected, role-based layout)
  /login
  /projects
  /invoices
  /expenses
  /admin (optional future extension)
/lib
  /db (Drizzle schema and queries)
  /auth (Supabase client helpers)
  /utils
/components
  /forms
  /ui (shared ShadCN components)
  /charts
```

---

## 4. Database Schema (Drizzle ORM)

### Tables:

* `users`
* `projects`
* `equipment_types`
* `invoices`
* `expenses`

### Schema Summary

```ts
// users.ts
id, email, password_hash, role, created_at

// projects.ts
id, project_number, description, client, status,
duration, start_date, end_date

// equipment_types.ts
id, name, category, description

// invoices.ts
id, project_id, equipment_type_id, invoice_number,
date, amount, status, notes

// expenses.ts
id, invoice_id, category, amount, description, date
```

---

## 5. Pages & Routes

### Public Routes:

* `/login` – Supabase Auth form with role redirect

### Protected Routes (via middleware):

* `/dashboard` – Landing page based on role
* `/projects` – Project list + creation/edit form
* `/invoices` – List and entry form for equipment usage
* `/expenses` – List and entry form by invoice

---

## 6. Forms and Components

### Project Form

* Project number, client, description, duration
* Start date (auto-calculate end date)

### Equipment Type Form

* Name, category, description

### Invoice Form

* Project, equipment type, date, amount, status, notes

### Expense Form

* Linked invoice, category, amount, date, description

---

## 7. Server Actions

All logic will be implemented as **Server Actions** inside Next.js App Router (no custom API routes).

Examples:

* `createProjectAction()`
* `submitInvoiceAction()`
* `addExpenseAction()`
* `getDashboardData()`

---

## 8. Role-Based Access Control

Roles: `admin`, `project_manager`, `finance`, `executive`

* Middleware protects all `/dashboard` routes
* Supabase role field determines access level
* Optional: hide menu links per role in UI

---

## 9. Data Entry Flow

1. **Create Equipment Types** (one-time setup)
2. **Create Projects** (with start/duration)
3. **Submit Invoices** (project + equipment type)
4. **Add Expenses** (linked to invoice)

---

## 10. Calculated Metrics

To be handled in frontend or SQL views (optional):

* Total revenue per equipment type
* Total expenses per invoice
* Net profit = invoice.amount - SUM(expenses.amount)

---

## 11. Environment Variables

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 12. Dev Setup Checklist

* Clone repo & install dependencies
* Setup Supabase project with tables
* Connect Drizzle to Supabase via `drizzle.config.ts`
* Add environment variables
* Run `drizzle-kit push` to sync schema
* Deploy frontend via Vercel (GitHub connect)

---

## 13. Future Considerations

* Add individual equipment logs (if needed)
* Add project timelines/milestones
* Add client and feedback tables
* Add report exports (CSV/PDF)
* Add dashboards for mobile view

---

## 14. Glossary (Optional)

* **Equipment Type** – A category of asset used across projects
* **Invoice** – A record of revenue for equipment usage on a project
* **Expense** – A cost incurred to fulfill an invoice (fuel, salaries, etc.)

---

End of Technical Specification

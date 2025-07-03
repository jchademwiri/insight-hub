# MVP Analytics Platform - Product Requirements Document

## Manual Data Entry Version for Testing & Validation

## Executive Summary

### Vision Statement

Create a streamlined, role-based analytics platform MVP that demonstrates the value of centralized data insights through manual data entry, serving as a proof-of-concept for director approval and full development authorization.

### MVP Goals

* **Validate Core Concept**: Demonstrate the value of role-based analytics dashboards
* **Test User Experience**: Gather feedback on interface design and navigation
* **Prove Business Value**: Show measurable improvements in decision-making speed
* **Secure Development Approval**: Present compelling case for full automated platform
* **Minimize Development Risk**: Build quickly with minimal resources for rapid iteration

---

## Product Overview

### Target Users (MVP Testing)

1. **You (Project Manager)**: Primary user testing all functionality
2. **Director**: Key stakeholder for approval decision
3. **2–3 Key Stakeholders**: Limited testing group from your companies

### Core Value Proposition

Demonstrate how consolidated project data in role-specific dashboards can eliminate manual reporting, speed up decision-making, and provide previously unavailable insights.

### Testing Scope

* **Company A Projects**: 2–3 active projects
* **Company B Projects**: 2–3 active projects
* **Data Period**: Last 3–6 months of project data
* **Update Frequency**: Weekly manual updates during testing

---

## MVP Functional Requirements

### 1. Simple User Management

#### 1.1 Basic Authentication

* **Login system** using Supabase Auth
* **Role assignment**: Executive, Project Manager, Operations, Finance
* **Session management** via Supabase + Next.js Server Components
* **No external SSO integrations** required for MVP

#### 1.2 Role-Based Views

* **Predefined dashboards** for each role
* **Fixed permissions** enforced by role
* **Simple navigation** using Next.js routing
* **Demo mode** for director presentations

### 2. Manual Data Entry System

#### 2.1 Data Entry Forms

* Built with ShadCN components and Tailwind CSS
* Include validation using HTML5 + Zod (if needed)
* Supports:

  * Project info
  * Equipment usage via invoice
  * Expenses linked to invoices

#### 2.2 Data Categories

```
Projects:
- Project Number, Client, Start Date, End Date, Status
- Duration, Description

Equipment Types:
- Name, Category, Description

Invoices:
- Project, Equipment Type, Invoice Number, Date
- Revenue Amount, Status, Notes

Expenses:
- Invoice, Category, Amount, Description, Date
```

#### 2.3 Data Validation

* **Required fields**
* **Date range checks**
* **Numeric validation**
* **Dropdowns for consistency**
* **Clear inline error messages**

### 3. Core Dashboard Views

#### 3.1 Executive Dashboard

* KPIs: Total revenue, profit margins, project count
* Portfolio Status: Active, completed, at-risk
* Financial Summary: Monthly trends, cost analysis
* Equipment Profitability: Revenue and expenses per equipment type
* Client Health: Satisfaction, retention

#### 3.2 Project Manager Dashboard

* Project Status: Timeline, budget, % complete
* Equipment Use: Invoices by project
* Budget Tracking: Spent vs. allocated
* Risk Indicators: At-risk projects, alerts

#### 3.3 Operations Dashboard

* Equipment Use by Project
* Cost Trends: Fuel, salaries, maintenance per invoice
* Capacity Planning: Upcoming vs. used equipment

#### 3.4 Finance Dashboard

* Cash Flow: Invoice status, payments
* Profitability: Per invoice and per equipment type
* Cost Analysis: Breakdown by category

### 4. Basic Interactive Features

#### 4.1 Navigation

* App Router layouts per role
* Sticky sidebar or top-nav using Tailwind

#### 4.2 Visualizations

* **Recharts** for charts
* **KPI Cards** styled with ShadCN UI
* **Export**: PDF/CSV via browser tools
* **Print-friendly** views

---

## Technical Requirements (MVP)

### 1. Architecture

#### 1.1 Frontend

* **Next.js 15 (App Router)**
* **Server Actions** for backend logic
* **TypeScript**
* **Tailwind CSS v4**
* **ShadCN UI**
* **Recharts** for charts

#### 1.2 Backend (Supabase)

* **PostgreSQL** hosted on Supabase
* **Drizzle ORM** for schema and queries
* **Supabase Auth** for login & session
* **Supabase Storage** (optional file uploads)

#### 1.3 Deployment

* **Vercel** for frontend hosting
* **Supabase** for backend services
* **CI/CD via GitHub**
* **SSL** via Vercel
* **Environment configs** for dev/staging/prod

### 2. Database Schema

```
Users (id, email, password_hash, role, created_at)

Projects (
  id, project_number, description, client, status,
  duration, start_date, end_date
)

EquipmentTypes (
  id, name, category, description
)

Invoices (
  id, project_id, equipment_type_id, invoice_number,
  date, amount, status, notes
)

Expenses (
  id, invoice_id, category, amount, description, date
)
```

### 3. Data Entry Workflows

#### 3.1 Initial Setup

* Create Projects
* Define Equipment Types
* Log Invoices (linking project + equipment type)
* Enter Expenses per invoice

#### 3.2 Weekly Updates

* Update project statuses
* Log new invoices for active projects
* Record new expenses linked to each invoice

---

## MVP Development Timeline

### Phase 1: Core Setup (Weeks 1–2)

* Setup Next.js + Supabase
* Create DB schema in Drizzle
* Implement Supabase Auth
* Build initial navigation

### Phase 2: Forms & Layouts (Weeks 3–4)

* Data entry forms for projects, invoices, expenses
* Basic dashboard layouts
* Visualizations with Recharts

### Phase 3: Dashboards (Weeks 5–6)

* Finalize executive, PM, operations, finance views
* Implement print/export features

### Phase 4: Testing & Refinement (Weeks 7–8)

* Manual data entry
* Collect user feedback
* Bug fixes
* Presentation preparation

---

## Success Metrics

### 1. Validation

* Time to Insight: < 30s
* Decision Speed: +50%
* Director Approval

### 2. Technical

* Page Loads < 2s
* Stable on Vercel
* Manual entries persisted correctly

### 3. Business

* ROI Projection: 300% in 18 months
* Time savings over manual
* Stakeholder enthusiasm

---

## MVP Resources

### Team

* **You**: Product Owner
* **1 Dev**: Full-stack (6–8 weeks)
* **1 Designer (Optional)**: 1–2 weeks
* **Budget**: \$15k–\$25k

### Costs

* **Vercel**: Free / low-tier
* **Supabase**: Free / low-tier
* **Domain & SSL**: \$100/year
* **Dev Tools**: \$200–500

### Testing Data

* Historical projects
* Financials
* Equipment usage
* Expenses per project

---

## Risk Mitigation

### 1. Technical

* Supabase handles most infra complexity
* Next.js Server Actions reduce backend overhead
* Drizzle ORM ensures schema safety

### 2. Business

* Low budget, fast timeline
* Use real-world data
* Visible value for stakeholders

### 3. Scope Management

* Feature freeze for MVP
* Manual-only data input
* Defined metrics for success
* Regular check-ins
* **Equipment management is scoped to reusable equipment types, avoiding the complexity of assigning individual assets to projects.**

---

## Post-MVP Path

### 1. Success

* Director greenlight
* Full funding
* Expanded dev team
* 12-month rollout

### 2. Full Scope

* Data integrations
* Predictive analytics
* Org-wide deployment
* Security & compliance

### 3. Transition

* Drizzle schema migration
* Supabase to enterprise cloud
* Rollout by department

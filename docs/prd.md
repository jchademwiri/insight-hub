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
  * Financials
  * Resources
  * Timelines
  * Client feedback

#### 2.2 Data Categories

```
Projects:
- Project Name, Client, Start Date, End Date, Status
- Budget, Actual Spend, Remaining Budget
- Team Members, Roles, Allocation %

Financials:
- Invoice Amount, Status, Due Date, Paid Date
- Expense Categories, Amounts, Approval Status
- Monthly Revenue, Costs, Profit Margins

Operations:
- Equipment Usage, Maintenance Schedules
- Service Delivery Metrics, Quality Scores
- Timeline Adherence, Milestone Completion

Resources:
- Team Member Utilization, Availability
- Skill Sets, Capacity Planning
- Overtime Hours, Efficiency Metrics
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
* Resource Utilization: Team capacity, equipment
* Client Health: Satisfaction, retention

#### 3.2 Project Manager Dashboard

* Project Status: Timeline, budget, % complete
* Resource Allocation: Assignments, availability
* Budget Tracking: Spent vs. allocated
* Timeline Management: Milestones, deadlines
* Risk Indicators: At-risk projects, alerts

#### 3.3 Operations Dashboard

* Delivery: Quality metrics, completion rates
* Equipment: Utilization, maintenance
* Team Performance: Productivity, efficiency
* Client Satisfaction: Feedback, resolution
* Capacity Planning: Forecast vs. actual

#### 3.4 Finance Dashboard

* Cash Flow: Invoice status, payments
* Profitability: Project margins
* Budget Management: Variance, forecast
* Cost Centers: Department spend
* Financial Health: Ratios, trends

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

#### 1.2 Backend (Integrated via Supabase)

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

### 2. Database Schema (via Drizzle ORM)

```ts
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  client: text("client").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status"),
  budget: integer("budget"),
  actualSpend: integer("actual_spend"),
});

// Clients, Financials, Resources, Milestones tables to be added similarly
```

### 3. Data Entry Workflows

#### 3.1 Initial Setup

* Create Projects, Clients, Team Members
* Set budgets, milestones, assignments

#### 3.2 Weekly Updates

* Update statuses and financials
* Track resources and client feedback
* Mark milestone progress

---

## MVP Development Timeline

### Phase 1: Core Setup (Weeks 1–2)

* Setup Next.js + Supabase
* Create DB schema in Drizzle
* Implement Supabase Auth
* Build initial navigation

### Phase 2: Forms & Layouts (Weeks 3–4)

* Data entry forms for all categories
* Basic dashboard layouts
* Visualizations with Recharts

### Phase 3: Dashboards (Weeks 5–6)

* Finalize executive, PM, ops, finance views
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
* Resources
* Client feedback
* Milestones

---

## Risk Mitigation

### Technical

* Simple Next.js + Supabase stack
* Server Actions avoid backend API boilerplate

### Business

* Low budget, fast timeline
* Use real-world data
* Visible value for stakeholders

### Scope

* Feature freeze for MVP
* Manual-only data input
* Defined metrics for success

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

---
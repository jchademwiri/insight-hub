# Insight Hub - MVP Analytics Platform

A streamlined, role-based analytics platform MVP for construction equipment management and project profitability analysis.

## 🎯 Overview

Insight Hub demonstrates the value of centralized project data through role-specific dashboards, designed to eliminate manual reporting and speed up decision-making for construction equipment companies. This MVP serves as a proof-of-concept to validate core analytics concepts and secure approval for full development.

### Key Features

- **Role-based dashboards** tailored for Executive, Project Manager, Operations, and Finance teams
- **Manual data entry system** for projects, equipment usage, and expenses
- **Real-time analytics** with interactive charts and KPIs
- **Equipment profitability tracking** across projects
- **Secure authentication** with role-based access control
- **Business intelligence** with automated profit margin calculations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, ShadCN UI |
| Charts | Recharts |
| Backend | Next.js Server Actions |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle ORM |
| Hosting | Vercel + Supabase |

## 📊 Database Schema

The platform uses a normalized database design with 5 core tables optimized for construction equipment analytics:

```
users           → Authentication & role management
projects        → Construction project metadata & tracking
equipment_types → Master catalog of reusable equipment
invoices        → Equipment usage per project (revenue tracking)
expenses        → Cost management linked to invoices
```

**Key Design Principles:**
- Equipment managed as reusable types (not individual assets)
- Revenue tied to equipment usage per project
- Expenses categorized and linked to specific invoices
- Role-based data access and filtering

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (database & auth)
- Vercel account (deployment)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-analytics-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database**
   ```bash
   # Push schema to Supabase
   pnpm db:push
   
   # Optional: Seed with sample data
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   │   └── login/          # Login page
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard views
│   │   ├── projects/       # Project management
│   │   ├── equipment/      # Equipment management
│   │   ├── invoices/       # Revenue tracking
│   │   └── expenses/       # Cost management
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── forms/              # Data entry forms
│   ├── charts/             # Recharts visualizations
│   ├── tables/             # Data tables and lists
│   └── ui/                 # ShadCN UI components
├── lib/                    # Shared utilities
│   ├── db/                 # Database schema and queries
│   │   ├── schema.ts       # Drizzle schema definition
│   │   └── queries/        # Organized query functions
│   ├── auth/               # Authentication utilities
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles
└── middleware.ts           # Auth middleware

docs/                       # Documentation
├── database-design.md      # Database schema details
├── technical-specification.md
└── prd.md                  # Product requirements
```

## 🔐 User Roles & Access

| Role | Access Level | Dashboard Features |
|------|-------------|-------------------|
| **Executive** | High-level insights | KPIs, portfolio status, profitability |
| **Project Manager** | Project-focused | Timeline, budget tracking, equipment use |
| **Operations** | Equipment-focused | Usage trends, capacity planning, costs |
| **Finance** | Financial analysis | Cash flow, profitability, cost breakdown |

## 📈 Key Metrics & Analytics

- **Revenue tracking** per equipment type and project
- **Cost analysis** with expense categorization
- **Profit margins** calculated automatically
- **Project performance** with timeline and budget tracking
- **Equipment utilization** across the portfolio

## 🗃️ Data Entry Workflow

1. **Setup** (One-time)
   - Create equipment types (Tipper, Grader, etc.)
   - Set up user accounts with roles

2. **Project Management**
   - Create projects with client, duration, dates
   - Track status (active, completed, at-risk)

3. **Revenue Tracking**
   - Log invoices for equipment usage per project
   - Link equipment types to specific projects

4. **Cost Management**
   - Add expenses tied to each invoice
   - Categorize costs (fuel, salary, maintenance)

## 🚢 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   pnpm i -g vercel
   vercel login
   vercel
   ```

2. **Configure environment variables in Vercel dashboard**
   - Add all variables from `.env.local`
   - Ensure Supabase URLs and keys are correct

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Database Setup (Supabase)

1. Create a new Supabase project
2. Run the provided SQL schema in the SQL editor
3. Enable RLS policies for security
4. Configure authentication settings

## 🧪 Testing & Validation

### Sample Data Requirements

For effective MVP testing, ensure:
- **2-3 active projects** per company
- **3-6 months** of historical data
- **Weekly updates** during testing period
- **Multiple equipment types** (Tipper, Grader, Excavator, etc.)
- **Varied expense categories** (fuel, salary, maintenance, parts)

### Success Metrics

- **Time to Insight**: < 30 seconds from login to key metrics
- **Decision Speed**: +50% improvement in project decisions
- **Page Load**: < 2 seconds for dashboard rendering
- **User Satisfaction**: Positive stakeholder feedback and director approval

## 📋 Available Scripts

```bash
pnpm dev             # Start development server
pnpm build           # Build for production  
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm type-check      # Run TypeScript checks
pnpm db:push         # Push schema to database
pnpm db:studio       # Open Drizzle Studio
pnpm db:seed         # Seed database with sample data
```

## 🔧 Configuration

### Database Queries

Common queries are available in `/lib/db/queries.ts`:

```typescript
// Revenue per equipment type
const equipmentRevenue = await getEquipmentRevenue();

// Profit analysis
const profitAnalysis = await getProfitByEquipment();

// Project performance
const projectMetrics = await getProjectMetrics(projectId);
```

## 🚀 Future Enhancements

**Phase 2 Development:**
- **Automated data integrations** with existing ERP/accounting systems
- **Advanced analytics** with predictive modeling and forecasting
- **Mobile-first responsive** design for field operations
- **Real-time notifications** for project alerts and budget thresholds
- **Advanced reporting** with PDF exports and scheduled reports
- **Individual asset tracking** beyond equipment types
- **Multi-company support** for larger organizations
- **API integrations** with construction management software

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support & Documentation

**Getting Help:**
- Create an issue in the repository for bugs or feature requests
- Contact the development team for technical support
- Check comprehensive documentation in `/docs` folder

**Documentation Available:**
- Database design and ERD (`/docs/database-design.md`)
- Technical specifications (`/docs/technical-specification.md`)
- Product requirements (`/docs/prd.md`)
- Folder structure overview (`/docs/folder-structure.md`)

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 🎯 MVP Goals

This MVP serves as a proof-of-concept to:
- ✅ Validate the core analytics concept
- ✅ Test user experience and interface design  
- ✅ Demonstrate measurable business value
- ✅ Secure approval for full development
- ✅ Minimize development risk with rapid iteration

**Built with ❤️ for construction equipment management**
# MVP Analytics Platform

A streamlined, role-based analytics platform MVP for construction equipment management and project profitability analysis.

## 🎯 Overview

This MVP demonstrates the value of centralized project data through role-specific dashboards, designed to eliminate manual reporting and speed up decision-making for construction equipment companies.

### Key Features

- **Role-based dashboards** for Executive, Project Manager, Operations, and Finance teams
- **Manual data entry system** for projects, equipment usage, and expenses
- **Real-time analytics** with interactive charts and KPIs
- **Equipment profitability tracking** across projects
- **Secure authentication** with role-based access control

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

The platform uses a normalized database design with 5 core tables:

```
users → Authentication & roles
projects → Construction project metadata  
equipment_types → Master list of reusable equipment
invoices → Equipment usage per project (revenue)
expenses → Costs linked to invoices
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-analytics-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
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
   npm run db:push
   
   # Optional: Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /dashboard          # Protected role-based dashboards
  /login              # Authentication
  /projects           # Project management
  /invoices           # Equipment usage tracking
  /expenses           # Cost management
/lib
  /db                 # Drizzle schema and queries
  /auth               # Supabase client helpers
  /utils              # Shared utilities
/components
  /forms              # Data entry forms
  /ui                 # ShadCN UI components
  /charts             # Recharts visualizations
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
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure environment variables in Vercel dashboard**

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

- **2-3 active projects** per company
- **3-6 months** of historical data
- **Weekly updates** during testing period

### Success Metrics

- **Time to Insight**: < 30 seconds
- **Decision Speed**: +50% improvement
- **Page Load**: < 2 seconds
- **User Satisfaction**: Positive stakeholder feedback

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
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

- **Automated data integrations** with existing systems
- **Advanced analytics** with predictive modeling
- **Mobile responsive** design improvements
- **Real-time notifications** for project alerts
- **Advanced reporting** with PDF exports

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

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
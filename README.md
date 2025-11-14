# 🌐 Affiliate Aggregator

## 🎯 Global Affiliate Networks Tracking and Management System

[![CI/CD](https://github.com/Vibecodium/affiliate-aggregator/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Vibecodium/affiliate-aggregator/actions/workflows/ci-cd.yml)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Integrated-blue)](https://github.com/Vibecodium/affiliate-aggregator)

A comprehensive platform for tracking, managing, and analyzing affiliate programs from around the world. Built with Next.js, Supabase, and deployed on Vercel.

## 🚀 Features

### Core Functionality
- ✅ **Global Coverage**: Track 80,000+ affiliate programs from 6 major networks
- ✅ **Multi-Network Support**: ShareASale, Awin, CJ Affiliate, Rakuten, ClickBank, Amazon Associates
- ✅ **Real-time Analytics**: Dashboard with performance metrics and insights
- ✅ **Program Comparison**: Side-by-side comparison tool for programs
- ✅ **Favorites/Bookmarks**: Save and organize preferred programs
- ✅ **Advanced Search & Filtering**: Find programs by category, commission, network
- ✅ **CSV Import**: Bulk import programs from CSV files

### Authentication & Security
- ✅ **Supabase Authentication**: Secure user management
- ✅ **Role-Based Access Control (RBAC)**: 5 roles (owner, admin, manager, member, viewer)
- ✅ **Multi-Tenancy**: Organization-based data isolation
- ✅ **Audit Logging**: Track all organization actions

### Development
- ✅ **Spec-Driven Development (SDD)**: All features start with specifications
- ✅ **Test-Driven Development (TDD)**: 150 passing tests, 11%+ coverage
- ✅ **CI/CD Pipeline**: Automated testing, building, and deployment
- ✅ **Performance Monitoring**: Automated health checks every 6 hours

## 📁 Project Structure

```
affiliate-aggregator/
├── .github/workflows/      # CI/CD pipelines
│   ├── ci-cd.yml          # Main CI/CD workflow
│   └── claude-pr.yml      # Claude Code PR automation
├── app/                   # Next.js 14 App Router
├── components/            # React components
├── lib/                   # Utilities and helpers
├── prisma/               # Database schema
├── public/               # Static assets
├── specs/                # Product specifications
├── tests/                # Test suites
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.1.6, React 18.3, TailwindCSS 3.4
- **Backend**: Next.js API Routes, Prisma ORM 5.22
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RBAC
- **Deployment**: Vercel (Production)
- **CI/CD**: GitHub Actions (4 workflows)
- **Testing**: Jest 29.7, Playwright 1.49
- **Code Quality**: ESLint 9, TypeScript 5.7
- **AI**: Claude Code integration
- **Data Import**: CSV parsing with csv-parse

## 🏃 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/Vibecodium/affiliate-aggregator.git
cd affiliate-aggregator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Supabase Setup

1. Create new Supabase project
2. Copy connection strings to `.env.local`
3. Run migrations: `npm run db:migrate`

## 🤖 Claude Code Integration

Use `@claude` in issues and PRs:

```
@claude implement this feature
@claude review these changes
@claude generate tests for this component
```

## 📊 Project Status

### ✅ Completed
- ✅ Project structure initialized
- ✅ Repository created and configured
- ✅ Database schema designed and deployed
- ✅ Core features implemented (Dashboard, Programs, Comparison, Favorites)
- ✅ API endpoints created (15 routes)
- ✅ Frontend UI built (7 pages)
- ✅ Authentication & RBAC system
- ✅ Multi-tenancy with organizations
- ✅ Data import system with CSV support
- ✅ CI/CD pipeline with 4 workflows
- ✅ Comprehensive testing (150 tests)
- ✅ Production deployment on Vercel

### 📈 Statistics
- **Total Programs**: 80,010
- **Networks**: 6 major networks
- **Test Coverage**: 11.5%
- **API Endpoints**: 15
- **Pages**: 7
- **Tests Passing**: 150/150 ✅
- **Build Time**: ~3.3s
- **Deployment**: Live at https://affiliate-aggregator-five.vercel.app

### 🚀 Next Steps
- 📅 Add security headers
- 📅 Implement rate limiting
- 📅 Add error tracking (Sentry)
- 📅 Optimize bundle size
- 📅 Improve test coverage to 20%

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write spec first (`specs/SPEC-XXX.md`)
4. Write tests (TDD)
5. Implement feature
6. Submit PR with `@claude` review

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Claude Code for AI assistance
- Vercel for hosting
- Supabase for database
- Vibecodium team

---

**Repository**: https://github.com/Vibecodium/affiliate-aggregator
**Organization**: Vibecodium (Internal)
**Status**: Active Development 🚀

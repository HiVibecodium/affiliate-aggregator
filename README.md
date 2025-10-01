# 🌐 Affiliate Aggregator

## 🎯 Global Affiliate Networks Tracking and Management System

[![CI/CD](https://github.com/Vibecodium/affiliate-aggregator/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Vibecodium/affiliate-aggregator/actions/workflows/ci-cd.yml)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Integrated-blue)](https://github.com/Vibecodium/affiliate-aggregator)

A comprehensive platform for tracking, managing, and analyzing affiliate programs from around the world. Built with Next.js, Supabase, and deployed on Vercel.

## 🚀 Features

- **Global Coverage**: Track affiliate programs worldwide
- **Multi-Network Support**: Integrate with major affiliate networks
- **Real-time Analytics**: Monitor performance and earnings
- **Automated Tracking**: Sync data automatically
- **Claude Code Integration**: AI-powered development assistance
- **Spec-Driven Development (SDD)**: All features start with specifications
- **Test-Driven Development (TDD)**: Comprehensive test coverage

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

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Testing**: Jest, Playwright
- **AI**: Claude Code integration

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

- ✅ Project structure initialized
- ✅ Repository created
- 🚧 Database schema (in progress)
- 📅 Core features (planned)
- 📅 API endpoints (planned)
- 📅 Frontend UI (planned)

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

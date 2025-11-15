# Contributing Guide

Thank you for contributing to Affiliate Aggregator!

## Development Setup

```bash
git clone https://github.com/Vibecodium/affiliate-aggregator.git
cd affiliate-aggregator
npm install
cp .env.example .env.local
npm run dev
```

## Code Style

- TypeScript strict mode
- ESLint rules enforced
- Prettier formatting
- Husky pre-commit hooks

## Pull Request Process

1. Fork the repo
2. Create feature branch
3. Write tests
4. Ensure all tests pass
5. Submit PR with description

## Testing

```bash
npm test              # All tests
npm run test:unit     # Unit tests
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript
```

## Questions?

Open an issue or discussion!

---

**Built with Claude Code** 🤖

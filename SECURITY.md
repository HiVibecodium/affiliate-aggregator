# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Affiliate Aggregator seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Publicly Disclose

- **Do not** create a public GitHub issue
- **Do not** discuss it in public forums
- Report privately to maintain security

### 2. Report Privately

**Email:** security@vibecodium.com (или ваш email)

**OR**

Use GitHub Security Advisories:
https://github.com/Vibecodium/affiliate-aggregator/security/advisories/new

### 3. Include in Your Report

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 4. What to Expect

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 5 business days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 3-7 days
  - Medium: 7-14 days
  - Low: 14-30 days

## Security Measures in Place

### Application Security

- ✅ **Security Headers**: 8 comprehensive headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ **Rate Limiting**: Protection on 6 API endpoints
- ✅ **HTTPS Enforcement**: Strict-Transport-Security enabled
- ✅ **Content Security Policy**: Prevents XSS and injection attacks
- ✅ **Clickjacking Protection**: X-Frame-Options: DENY
- ✅ **MIME Sniffing Protection**: X-Content-Type-Options: nosniff

### Authentication & Authorization

- ✅ **Supabase Authentication**: Industry-standard auth
- ✅ **Role-Based Access Control (RBAC)**: 5 role levels
- ✅ **Multi-Tenancy**: Organization-based data isolation
- ✅ **Session Management**: Secure token handling
- ✅ **Audit Logging**: All actions tracked

### Data Protection

- ✅ **Database**: PostgreSQL with Supabase
- ✅ **Encryption**: All data encrypted at rest and in transit
- ✅ **Input Validation**: Zod schemas for all inputs
- ✅ **SQL Injection Prevention**: Prisma ORM
- ✅ **Environment Variables**: Secrets not in code

### Monitoring

- ✅ **Error Tracking**: Sentry integration
- ✅ **Performance Monitoring**: Lighthouse CI (4x daily)
- ✅ **Health Checks**: Automated monitoring
- ✅ **Dependency Updates**: Dependabot weekly scans

### Development Security

- ✅ **Automated Testing**: 197+ tests
- ✅ **Git Hooks**: Pre-commit linting and tests
- ✅ **ESLint**: Code quality enforcement
- ✅ **TypeScript**: Type safety
- ✅ **Dependency Scanning**: npm audit on CI

## Known Security Considerations

### Rate Limiting

Current implementation uses in-memory storage.

**Limitation:** Single instance only
**Recommendation for Production:** Migrate to Redis/Upstash for distributed rate limiting

See: `docs/RATE_LIMITING.md`

### Sentry Configuration

Sentry is configured but requires DSN to be active.

**Status:** Configured, awaiting production DSN
**Risk:** Low - errors logged to console as fallback

See: `docs/SENTRY_SETUP.md`

### Memory Usage

Production shows 95% memory usage.

**Status:** Monitoring required
**Action:** Scale if performance degrades

## Security Best Practices for Contributors

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use Zod schemas
3. **Sanitize outputs** - Prevent XSS
4. **Use parameterized queries** - Already enforced by Prisma
5. **Keep dependencies updated** - Dependabot active
6. **Write tests** - Including security test cases
7. **Follow least privilege** - RBAC system in place

## Security Checklist for PRs

- [ ] No secrets in code
- [ ] Input validation added
- [ ] Output sanitization checked
- [ ] Authorization checks in place
- [ ] Tests include security scenarios
- [ ] Dependencies scanned (npm audit)
- [ ] No new security warnings

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledged and assessed
3. **Day 3-7**: Fix developed and tested
4. **Day 8**: Security patch released
5. **Day 9**: Public disclosure (if appropriate)

## Security Updates

Security updates will be announced via:

- GitHub Security Advisories
- Release notes
- Email to registered users (if critical)

## Contact

For security concerns: security@vibecodium.com

For general issues: https://github.com/Vibecodium/affiliate-aggregator/issues

---

**Last Updated:** 2025-11-14
**Policy Version:** 1.0

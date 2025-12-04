# Documentation

Complete documentation for the Affiliate Aggregator platform.

## 📚 Table of Contents

### API Documentation

- **[API Reference](./API_REFERENCE.md)** - Complete REST API documentation with all endpoints, parameters, and examples

### Security & Incidents

- **[Security Incident Response](../SECURITY_INCIDENT_RESPONSE.md)** - Procedures for handling security incidents and secret rotation

### Development Guidelines

- **[Empty Catch Blocks](./EMPTY_CATCH_BLOCKS.md)** - Documentation of intentional empty catch blocks in the codebase

### GitHub Issues

- **[GitHub Issues](../GITHUB_ISSUES.md)** - Compiled list of all TODO items converted to GitHub issues

### Additional Documentation

- **[Git Hooks](../GIT_HOOKS.md)** - Pre-commit and pre-push hook documentation
- **[Rate Limiting](../RATE_LIMITING.md)** - Rate limiting configuration and usage
- **[Security](../SECURITY.md)** - Security policy and vulnerability reporting

## 🔗 Quick Links

### For Developers

- [Getting Started](../README.md)
- [API Reference](./API_REFERENCE.md)
- [Environment Variables](../.env.example)
- [Testing Guide](../README.md#testing)

### For API Users

- [API Documentation](./API_REFERENCE.md)
- [Rate Limits](./API_REFERENCE.md#rate-limiting)
- [Authentication](./API_REFERENCE.md#authentication)
- [Error Handling](./API_REFERENCE.md#error-responses)

### For System Administrators

- [Security Incident Response](../SECURITY_INCIDENT_RESPONSE.md)
- [Deployment Guide](../README.md#deployment)
- [Monitoring](./API_REFERENCE.md#health--monitoring)

## 📝 Documentation Standards

### Writing Documentation

When adding new documentation:

1. **Location:**
   - API docs: `docs/API_REFERENCE.md`
   - Security: `SECURITY_INCIDENT_RESPONSE.md`
   - Code guidelines: `docs/` directory
   - README updates: Main `README.md`

2. **Format:**
   - Use Markdown
   - Include code examples
   - Add table of contents for long documents
   - Keep language clear and concise

3. **Content:**
   - Explain WHY, not just WHAT
   - Include examples
   - Document edge cases
   - Add troubleshooting sections

### Updating Documentation

Documentation should be updated when:

- New features are added
- APIs change
- Security policies update
- Breaking changes occur
- Best practices evolve

## 🔍 Finding Information

### By Topic

| Topic              | Document                                                       |
| ------------------ | -------------------------------------------------------------- |
| API Endpoints      | [API Reference](./API_REFERENCE.md)                            |
| Authentication     | [API Reference](./API_REFERENCE.md#authentication)             |
| Rate Limiting      | [API Reference](./API_REFERENCE.md#rate-limiting)              |
| Security Incidents | [Security Incident Response](../SECURITY_INCIDENT_RESPONSE.md) |
| Git Hooks          | [Git Hooks](../GIT_HOOKS.md)                                   |
| Empty Catch Blocks | [Empty Catch Blocks](./EMPTY_CATCH_BLOCKS.md)                  |

### By Role

**Backend Developers:**

- API Reference
- Empty Catch Blocks
- Security Incident Response

**Frontend Developers:**

- API Reference (consumption)
- Authentication flow
- Error handling

**DevOps/SRE:**

- Security Incident Response
- Monitoring endpoints
- Deployment procedures

**Project Managers:**

- GitHub Issues
- Feature roadmap
- Release notes

## 🤝 Contributing

To contribute to documentation:

1. Follow the documentation standards above
2. Update the table of contents
3. Add cross-references to related docs
4. Submit PR with clear description

## 📅 Maintenance

Documentation is reviewed:

- **Weekly:** API changes, bug fixes
- **Monthly:** Best practices, examples
- **Quarterly:** Major restructuring
- **As needed:** Security updates, incidents

---

**Last Updated:** 2024-12-04
**Maintainers:** Development Team

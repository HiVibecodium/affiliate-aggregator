# Security Features Documentation

This document describes the security enhancements and best practices implemented in the application.

## Table of Contents

1. [CSRF Protection](#csrf-protection)
2. [Input Validation](#input-validation)
3. [Security Headers](#security-headers)
4. [Rate Limiting](#rate-limiting)
5. [Authentication & Authorization](#authentication--authorization)
6. [Best Practices](#best-practices)

---

## CSRF Protection

### Overview

Cross-Site Request Forgery (CSRF) protection prevents unauthorized commands from being transmitted from a user the application trusts.

### Implementation

#### Generate CSRF Token

```typescript
import { generateCSRFToken, setCSRFCookie } from '@/lib/security/csrf';

// Server-side (API Route)
export async function GET() {
  const token = generateCSRFToken();
  await setCSRFCookie(token);

  return NextResponse.json({ csrfToken: token });
}
```

#### Verify CSRF Token

```typescript
import { requireCSRFToken } from '@/lib/security/csrf';

export async function POST(request: Request) {
  const csrfToken = request.headers.get('X-CSRF-Token');

  try {
    await requireCSRFToken(csrfToken);
    // Process request
  } catch (error) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
}
```

#### Client-side Usage

```typescript
// Fetch CSRF token
const response = await fetch('/api/csrf');
const { csrfToken } = await response.json();

// Include in requests
await fetch('/api/protected', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

### Features

- HMAC-based token generation
- 1-hour token expiration
- Secure cookie storage
- SameSite=Strict policy
- HTTPOnly cookies

### Configuration

```env
CSRF_SECRET=your-secret-key-here
```

**⚠️ Important**: Change the default secret in production!

---

## Input Validation

### Overview

Comprehensive input validation and sanitization to prevent injection attacks.

### Validation Functions

#### Sanitize HTML

```typescript
import { sanitizeHTML } from '@/lib/security/input-validation';

const userInput = '<script>alert("xss")</script>';
const safe = sanitizeHTML(userInput);
// Output: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
```

#### Email Validation

```typescript
import { isValidEmail } from '@/lib/security/input-validation';

if (isValidEmail(email)) {
  // Process email
} else {
  // Show error
}
```

#### URL Validation

```typescript
import { isValidURL } from '@/lib/security/input-validation';

if (isValidURL(url)) {
  // Safe to use
} else {
  // Reject dangerous URLs (javascript:, data:, etc.)
}
```

#### Search Query Sanitization

```typescript
import { sanitizeSearchQuery } from '@/lib/security/input-validation';

const query = sanitizeSearchQuery(userInput, 100); // Max length 100
```

#### Pagination Validation

```typescript
import { validatePagination } from '@/lib/security/input-validation';

try {
  const params = validatePagination({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });
  // params.page: 1-∞
  // params.limit: 1-100
} catch (error) {
  // Invalid parameters
}
```

#### ID Validation

```typescript
import { isValidId } from '@/lib/security/input-validation';

if (isValidId(id)) {
  // Valid UUID or numeric ID
} else {
  // Invalid format
}
```

#### Filename Sanitization

```typescript
import { sanitizeFilename } from '@/lib/security/input-validation';

const safe = sanitizeFilename('../../../etc/passwd');
// Removes path traversal attempts
```

#### Injection Detection

```typescript
import { detectInjectionAttempt } from '@/lib/security/input-validation';

if (detectInjectionAttempt(userInput)) {
  // Potential XSS/injection attempt
  // Log and reject
}
```

### Validation Schemas

Pre-configured Zod schemas for common inputs:

```typescript
import { schemas } from '@/lib/security/input-validation';

// Email validation
const email = schemas.email.parse(input);

// Password validation (8-128 chars)
const password = schemas.password.parse(input);

// Username validation (3-50 alphanumeric + _-)
const username = schemas.username.parse(input);

// URL validation
const url = schemas.url.parse(input);

// Text validation (max 5000 chars)
const text = schemas.text.parse(input);

// Short text (max 255 chars)
const shortText = schemas.shortText.parse(input);
```

### Complete Example

```typescript
import { sanitizeUserInput, validatePagination, schemas } from '@/lib/security/input-validation';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    // Validate email
    const email = schemas.email.parse(body.email);

    // Sanitize user content
    const comment = sanitizeUserInput(body.comment);

    // Validate pagination
    const { page, limit } = validatePagination({
      page: body.page,
      limit: body.limit,
    });

    // Process validated data
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

---

## Security Headers

### Configured Headers

All implemented in `next.config.js`:

#### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-src 'self' https://vercel.live;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

#### X-Frame-Options

```
X-Frame-Options: DENY
```

Prevents clickjacking attacks.

#### X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

Prevents MIME type sniffing.

#### Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

Controls referrer information.

#### Permissions-Policy

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

Restricts feature access.

#### Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Forces HTTPS connections.

#### X-XSS-Protection

```
X-XSS-Protection: 1; mode=block
```

Legacy XSS protection (for older browsers).

### Verification

Check headers with:

```bash
curl -I https://your-domain.com
```

Or use: https://securityheaders.com

---

## Rate Limiting

### Implementation

Protected endpoints have rate limiting:

```typescript
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    await limiter.check(10, 'CACHE_TOKEN'); // 10 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Process request
}
```

### Default Limits

- **Authentication endpoints**: 5 requests/minute
- **API endpoints**: 60 requests/minute
- **Analytics endpoints**: 20 requests/minute (unauthenticated)
- **Public endpoints**: 100 requests/minute

### Response Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

---

## Authentication & Authorization

### Role-Based Access Control (RBAC)

See full RBAC documentation in existing files. Quick reference:

```typescript
import { hasPermission, Permission } from '@/lib/rbac/utils';

const context = {
  userId: user.id,
  organizationId: org.id,
  role: user.role,
  permissions: user.permissions,
};

const canManageUsers = hasPermission(context, Permission.MANAGE_USERS);

if (!canManageUsers.allowed) {
  return NextResponse.json({ error: canManageUsers.reason }, { status: 403 });
}
```

### Session Security

- HTTPOnly cookies
- Secure flag in production
- SameSite=Strict
- Short session duration (24 hours)
- Automatic session refresh
- Session invalidation on logout

---

## Best Practices

### API Route Security Checklist

```typescript
import { requireCSRFToken } from '@/lib/security/csrf';
import { validatePagination, schemas } from '@/lib/security/input-validation';
import { hasPermission, Permission } from '@/lib/rbac/utils';

export async function POST(request: Request) {
  // 1. Verify CSRF token
  const csrfToken = request.headers.get('X-CSRF-Token');
  try {
    await requireCSRFToken(csrfToken);
  } catch {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  // 2. Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Check permissions
  const context = createRBACContext(
    session.user.id,
    session.user.organizationId,
    session.user.role
  );

  const canAccess = hasPermission(context, Permission.REQUIRED);
  if (!canAccess.allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 4. Validate input
  const body = await request.json();
  try {
    const email = schemas.email.parse(body.email);
    const text = sanitizeUserInput(body.text);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 5. Rate limit
  try {
    await limiter.check(10, session.user.id);
  } catch {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // 6. Process request safely
  try {
    // Use Prisma (auto-escapes SQL)
    // Never concatenate user input into queries

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error to Sentry
    console.error(error);

    // Don't expose internal errors
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Client-side Security

```typescript
// 1. Always validate on server too
const isValid = validateEmail(email); // Client-side check

// 2. Use HTTPS only
const API_URL = process.env.NEXT_PUBLIC_API_URL; // https://...

// 3. Store sensitive data securely
// Don't store secrets in localStorage
// Use httpOnly cookies for tokens

// 4. Sanitize before rendering
import { sanitizeHTML } from '@/lib/security/input-validation';
const safe = sanitizeHTML(userContent);

// 5. Use CSP-compliant inline styles
// Avoid inline event handlers
// Don't use eval() or Function()
```

### Database Security

```typescript
// ✅ Good: Using Prisma (parameterized)
const users = await prisma.user.findMany({
  where: { email: userInput },
});

// ❌ Bad: SQL injection vulnerable
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = '${userInput}'
`;

// ✅ Good: With proper escaping
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;
```

---

## Security Audit

### Automated Checks

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Generate report
npm audit --json > security-report.json
```

### Manual Review Checklist

- [ ] All inputs validated and sanitized
- [ ] CSRF protection on state-changing operations
- [ ] Rate limiting on sensitive endpoints
- [ ] RBAC checks before data access
- [ ] Security headers configured
- [ ] HTTPS enforced in production
- [ ] Secrets not in version control
- [ ] Error messages don't leak information
- [ ] Audit logging for sensitive operations
- [ ] Dependencies regularly updated

---

## Incident Response

### If you discover a vulnerability:

1. **Do not** disclose publicly
2. Email: security@your-domain.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

### For security updates:

- Check: https://github.com/your-repo/security/advisories
- Subscribe to: security-notifications@your-domain.com

---

## Compliance

### GDPR

- User data encryption at rest
- Right to data deletion
- Data export functionality
- Privacy policy
- Cookie consent

### OWASP Top 10

All covered:

- ✅ Injection (SQL, XSS)
- ✅ Broken Authentication
- ✅ Sensitive Data Exposure
- ✅ XML External Entities (N/A)
- ✅ Broken Access Control
- ✅ Security Misconfiguration
- ✅ Cross-Site Scripting (XSS)
- ✅ Insecure Deserialization
- ✅ Using Components with Known Vulnerabilities
- ✅ Insufficient Logging & Monitoring

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Security Headers](https://securityheaders.com/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

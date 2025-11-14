# Security Headers Documentation

## Overview

This application implements comprehensive security headers to protect against common web vulnerabilities and attacks.

## Implemented Security Headers

### 1. Content Security Policy (CSP)

**Purpose:** Prevents XSS, injection attacks, and unauthorized resource loading

**Configuration:**
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
font-src 'self' data:
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live
frame-src 'self' https://vercel.live
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

**Notes:**
- `unsafe-inline` for scripts and styles is required for Next.js and Tailwind CSS
- `unsafe-eval` is needed for Next.js runtime
- Supabase domains are whitelisted for API communication
- Vercel Live is allowed for preview deployments

### 2. X-Frame-Options

**Purpose:** Prevents clickjacking attacks

**Value:** `DENY`

**Effect:** Prevents the page from being embedded in `<iframe>`, `<frame>`, `<embed>`, or `<object>` tags

### 3. X-Content-Type-Options

**Purpose:** Prevents MIME type sniffing

**Value:** `nosniff`

**Effect:** Forces browsers to respect the `Content-Type` header

### 4. Referrer-Policy

**Purpose:** Controls how much referrer information is sent with requests

**Value:** `strict-origin-when-cross-origin`

**Effect:**
- Same-origin requests: Full URL
- Cross-origin HTTPS→HTTPS: Origin only
- HTTPS→HTTP: No referrer

### 5. Permissions-Policy

**Purpose:** Controls which browser features and APIs can be used

**Disabled Features:**
- camera
- microphone
- geolocation
- payment
- usb
- magnetometer
- gyroscope
- accelerometer

**Effect:** Prevents unauthorized access to sensitive device features

### 6. Strict-Transport-Security (HSTS)

**Purpose:** Enforces HTTPS connections

**Value:** `max-age=31536000; includeSubDomains`

**Effect:**
- Forces HTTPS for 1 year (31536000 seconds)
- Applies to all subdomains
- Prevents SSL stripping attacks

### 7. X-XSS-Protection

**Purpose:** Legacy XSS protection (modern browsers use CSP)

**Value:** `1; mode=block`

**Effect:** Enables XSS filter and blocks page rendering if attack detected

### 8. X-DNS-Prefetch-Control

**Purpose:** Controls DNS prefetching

**Value:** `on`

**Effect:** Allows browsers to perform DNS prefetching for performance

## Testing Security Headers

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check headers with curl:
   ```bash
   curl -I http://localhost:3000
   ```

### Production Testing

Check headers on deployed site:
```bash
curl -I https://affiliate-aggregator-five.vercel.app
```

### Online Security Scanners

Test your deployment with:
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## Expected Security Grades

With these headers implemented, you should achieve:
- **Mozilla Observatory:** A+ rating
- **Security Headers:** A rating
- **SSL Labs:** A rating

## Maintenance

### Updating CSP

If you need to add new domains or sources:

1. Edit `next.config.js`
2. Add the domain to the appropriate CSP directive
3. Test locally
4. Deploy and verify

Example - Adding a new image CDN:
```javascript
"img-src 'self' data: https: blob: https://cdn.example.com",
```

### Common CSP Issues

**Issue:** External scripts not loading

**Solution:** Add domain to `script-src`:
```javascript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://trusted-domain.com",
```

**Issue:** Fonts not loading

**Solution:** Add domain to `font-src`:
```javascript
"font-src 'self' data: https://fonts.gstatic.com",
```

**Issue:** API calls failing

**Solution:** Add domain to `connect-src`:
```javascript
"connect-src 'self' https://api.example.com",
```

## Security Best Practices

1. ✅ **Always use HTTPS in production** - HSTS header enforces this
2. ✅ **Keep CSP strict** - Only whitelist trusted domains
3. ✅ **Regular security audits** - Use online scanners monthly
4. ✅ **Monitor CSP violations** - Implement CSP reporting
5. ✅ **Update dependencies** - Keep Next.js and packages up to date

## CSP Reporting (Optional Enhancement)

To receive reports of CSP violations, add a `report-uri` or `report-to` directive:

```javascript
"report-uri https://your-csp-report-endpoint.com/report",
```

## Additional Security Measures

Beyond headers, consider:

1. **Rate Limiting** - Prevent brute force attacks
2. **Input Validation** - Validate all user inputs
3. **SQL Injection Prevention** - Use Prisma ORM (already implemented)
4. **Authentication** - Supabase Auth (already implemented)
5. **CSRF Protection** - Next.js built-in protection
6. **Error Handling** - Don't expose stack traces in production

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Last Updated:** 2025-11-14
**Maintained By:** Development Team

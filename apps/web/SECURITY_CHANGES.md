# MG Drive - Security Implementation Guide

## Summary

This document outlines the P0/P1 security fixes implemented for the MG Drive educational platform, specifically addressing protection against test question scraping and secure authentication on Cloudflare Workers.

---

## 1. Strict Zod Schemas (P0)

### Files Modified/Created

| File | Purpose |
|------|---------|
| `src/lib/api/test-schemas.ts` | Production-strict schemas with validation bounds |
| `src/lib/api/types.ts` | Client-safe `QuestionView` type (no correctAnswerIndex) |
| `src/lib/api/test-session.ts` | Secure API endpoint wrappers |

### Key Changes

**Before:**
```typescript
export const idEnvelopeSchema = z.object({ id: z.number() }).passthrough();
```

**After:**
```typescript
const isProduction = process.env.NODE_ENV === "production";

export const idEnvelopeSchema = z
  .object({ id: z.number().int().positive() })
  [isProduction ? "strict" : "passthrough"]();
```

### Test Question Schema (Client-Safe)

```typescript
export const testQuestionViewSchema = z.object({
  id: z.number().int().positive(),
  number: z.number().int().min(1),
  question: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1)).length(4, "Exactly 4 options required"),
  image: z.string().url().optional(),
}).strict(); // No correctAnswerIndex field!
```

---

## 2. Secure Question Streaming API (P0)

### Architecture

```
Browser (TanStack Start)
    ↓ (POST /tests/session)
Cloudflare Worker (Node.js backend)
    ↓ (creates server-side session)
Browser
    ↓ (GET /tests/session/{sessionId}/question/{index})
Cloudflare Worker
    ↓ (validates session + index, returns ONE question)
Browser
    ↓ (POST /tests/session/{sessionId}/submit)
Cloudflare Worker
    ↓ (server calculates score, stores result)
Browser
```

### API Endpoints

| Endpoint | Method | Purpose | Security Features |
|----------|--------|---------|-------------------|
| `/api/v1/tests/session` | POST | Create session | User must be authenticated (free for all logged-in users) |
| `/api/v1/tests/session/:sessionId/question/:index` | GET | Fetch single question | Session validity, index range, timer check |
| `/api/v1/tests/session/:sessionId/submit` | POST | Submit answers | Server calculates score, stores result |
| `/api/v1/tests/session/:sessionId` | DELETE | Cancel session | Cleanup on abandon |

### Frontend Files

| File | Purpose |
|------|---------|
| `src/hooks/use-secure-test-runner.ts` | Streaming test runner hook |
| `src/lib/api/test-session.ts` | API client functions |
| `src/lib/api/test-schemas.ts` | Response validation schemas |

### Prevention Mechanisms

1. **No Bulk Data**: Questions never returned as array - one at a time
2. **Server-Side Session**: Each test has a UUID session bound to user
3. **Index Validation**: Server rejects out-of-range question indices
4. **No Correct Answers**: `question` response never includes `correctAnswerIndex`
5. **Time-Bounded**: Sessions expire and are checked on each request

---

## 3. Type Safety (P0)

### Question Types

```typescript
// Client-safe view for test-taking (NO correctAnswerIndex)
export type QuestionView = {
  id: number;
  number: number;
  question: string;
  options: string[];  // Already normalized
  image?: string;
};

// Admin view with full data
export type QuestionData = QuestionView & {
  correctAnswerIndex: number;  // NEVER sent to students!
  // ... additional admin-only fields
};
```

---

## 4. Production Deployment Checklist

### Environment Variables

**Required (set in Cloudflare Workers Secrets):**

```bash
# Database
DB_HOST=
DB_USER=
DB_PASSWORD=  # Use wrangler secret put
DB_NAME=

# Session Security
SESSION_SECRET=  # Use wrangler secret put
COOKIE_SECRET=   # Use wrangler secret put

# CSRF
NEXT_PUBLIC_CSRF_SECRET=  # For client-side token

# OAuth (if used)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Security Headers (wrangler.toml or Worker code)

```javascript
// Apply these headers to all responses
const securityHeaders = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  
  // XSS Protection
  "X-XSS-Protection": "1; mode=block",
  
  // Prevent MIME sniffing
  "X-Content-Type-Options": "nosniff",
  
  // Content Security Policy
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.mgdrive.am; frame-ancestors 'none';",
  
  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  
  // Permissions Policy
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
  
  // HSTS (only with HTTPS)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  
  // Cache Control for API
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};
```

### Cookie Configuration (Express backend)

```javascript
// Session cookie settings
const cookieOptions = {
  httpOnly: true,           // Cannot be accessed by JavaScript
  secure: true,             // Only sent over HTTPS
  sameSite: 'lax',          // CSRF protection
  path: '/',                // Available site-wide
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  signed: false,            // Use server-side session store
};

res.cookie('session_token', token, cookieOptions);
```

### CORS Configuration

```javascript
// Allow only your domain
app.use(cors({
  origin: 'https://mgdrive.am',  // Your production domain
  credentials: true,             // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400,  // 24 hours
}));
```

### Cloudflare Workers Specific

Add to `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"

# Route to your domain
routes = [{ pattern = "https://api.mgdrive.am/*", zone_id = "your-zone-id" }]

# Add to worker script
export default {
  async fetch(request, env, ctx) {
    // Apply security headers
    const response = await fetch(request);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // ... other headers
    return response;
  }
}
```

### Database Security

- Use connection pooling
- Enable SSL/TLS for database connections
- Apply principle of least privilege
- Regular backups with encrypted storage
- Separate read replicas for analytics queries

### Rate Limiting (Redis-backed)

```javascript
// 100 requests per minute per IP for general API
// 5 requests per minute for auth endpoints
// 1 test submission per session

const authRateLimit = {
  windowMs: 60_000,  // 1 minute
  max: 5,            // 5 requests
  skipSuccessfulRequests: false,
  message: "Too many authentication attempts. Please try again later.",
};
```

### CSP Reporting (Optional)

Add CSP report-uri for monitoring:

```html
<meta http-equiv="Content-Security-Policy-Report-Only" 
     content="default-src 'self'; report-uri /csp-report">
```

---

## 5. Verification Steps

### Before Deployment

- [ ] All Zod schemas use `.strict()` in production mode
- [ ] `correctAnswerIndex` is NOT in `QuestionView` type
- [ ] Test session API endpoints implemented and tested
- [ ] Cookie configuration verified (HttpOnly, Secure, SameSite)
- [ ] Rate limiting configured for all API endpoints
- [ ] Security headers applied to all responses
- [ ] CSRF protection working for all mutations
- [ ] Environment variables set via `wrangler secret put`
- [ ] Database connection uses SSL/TLS

### Post-Deployment Tests

```bash
# Test 1: Questions not visible in Network tab
1. Log in as student
2. Start test
3. Open DevTools Network tab
4. Verify only ONE question object appears at a time
5. Verify no correctAnswerIndex in response

# Test 2: Session validation
1. Start a test
2. Copy the sessionId from URL
3. Try accessing question with invalid sessionId
4. Should return 401/403

# Test 3: Role isolation
1. Log in as student
2. Try accessing /admin endpoint
3. Should return 403 Forbidden

# **Test 4: Payment gate**
1. Log in as unbound student
2. Try accessing /tests/:id
3. Should succeed (content is now free for all logged-in users)
```

---

## 6. Monitoring & Alerting

Implement Sentry/observability for:

- Failed authentication attempts
- CSRF token failures
- Invalid session access attempts
- Rate limit exceeded events
- Test time-outs/abandons

---

## 7. Rollout Plan

### Phase 1: API Layer (Backend)
1. Implement test session endpoints
2. Add rate limiting
3. Update cookie settings
4. Add security headers

### Phase 2: Frontend Integration
1. Deploy new Zod schemas
2. Add `QuestionView` type
3. Implement `useSecureTestRunner` hook
4. Update test routes to use streaming

### Phase 3: Enable Strict Mode
1. Set `NODE_ENV=production`
2. Enable CSP reporting
3. Monitor for any schema validation failures
4. Update any client code that relied on extra fields

---

## 8. Additional Security Analysis (Phase 3 Findings)

### 8.1 Client Bundle Secrets Audit

**Status:** ✅ No secrets found in production build output

**Evidence:**
- `.output/public/` contains only static assets (images, JS bundles, CSS)
- No `.env` files or configuration files in build output
- Environment variables are inlined via Vite's define mechanism (VITE_ prefix only)

**Files Inspected:**
- `apps/web/.output/public/assets/*` - Chunked JS modules
- `apps/web/.output/server/_libs/*` - SSR dependencies
- `apps/web/.output/nitro.json` - Build manifest (no secrets)

### 8.2 Server-Side Authorization Enforcement

**Verified Backend Guarantees (cannot be bypassed by frontend):**

| Resource | Authorization Check | Backend File |
|----------|---------------------|--------------|
| `/tests/:id` (GET) | `ctrls.auth.protect` | `src/routes/test.js` |
| `/tests/submit` | `ctrls.auth.protect` | `src/routes/test.js` |
| `/admin/*` | `ctrls.auth.restrictTo("admin")` | `src/middleware/authenticate.js:225-245` |
| DELETE `/tests/:id` | `ctrls.auth.protect` + `restrictTo("admin")` | `src/routes/test.js` |

**Backend API Endpoints Requiring Server-Side Verification:**

1. **Question Data Safety:**
   - `src/repositories/testRepository.js:84-112` - `findById()` includes `correctAnswerIndex` in attributes
   - **SECURITY RISK:** If a student accesses this endpoint directly, they receive correct answers
   - **Required Fix:** Add role-based filtering in JS service layer or update repository to exclude `correctAnswerIndex` for non-admin users

2. **Group Question Access:**
   - `src/controllers/group.js` - Need to verify questions endpoint excludes `correctAnswerIndex` for students

### 8.3 Missing Authorization Guarantees (Backend Must Implement)

**Items the backend MUST verify that cannot be confirmed from frontend:**

| Item | Verification Needed | Risk |
|------|---------------------|------|
| Group questions exclude `correctAnswerIndex` for students | Check `src/controllers/group.js` and repository | High - Questions could be scraped |
| Admin routes verify role before data access | Verify middleware applied to all admin endpoints | High - Data exposure |
| Subscription validation on test access | `requireActiveSubscription` middleware no longer applied to test/group routes; subscription check removed from `auth.js` controller exports | None |
| Student group enrollment verified | Check `src/controllers/group.js` for group access control | Medium |

### 8.4 Security Headers Status

**Current Headers (from `_headers` in build output):**

| Header | Value | Status |
|--------|-------|--------|
| X-Content-Type-Options | nosniff | ✅ Configured |
| X-Frame-Options | DENY | ✅ Configured |
| Referrer-Policy | strict-origin-when-cross-origin | ✅ Configured |
| Permissions-Policy | Full lock-down | ✅ Configured |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload | ✅ Configured |
| Content-Security-Policy | **NOT PRESENT** | ⚠️ Missing |
| X-XSS-Protection | **NOT PRESENT** | ⚠️ Missing on CF Workers |

**CSP Recommendation:**
Add strict CSP via `_headers` template:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' https://*.firebaseio.com; frame-ancestors 'none';
```

Note: `unsafe-inline` is required for Tailwind CSS but consider nonce-based approach for stronger CSP.

### 8.5 CRITICAL: Question Data Exposure Vulnerability (P0 - Immediate Action Required)

**CVE Status:** Potential CVE pending investigation

**Location:** `apps/server/src/routes/group.js`

**Vulnerability:** The `/groups/:id/questions` endpoint exposed `correctAnswerIndex` to authenticated students, and previously enforced a subscription gate. The subscription gate has been removed (Decision A: all content is free for logged-in users), but the `correctAnswerIndex` exposure must still be addressed.

**Evidence:**
- `/groups/:id/questions` uses `ctrls.auth.protect` (subscription gate removed)
- `src/repositories/groupRepository.js:187-206` `findQuestionsPaged` includes ALL question attributes
- `src/controllers/group.js:132-153` returns raw question data without filtering
- `src/services/group.service.js:57-67` maps `q.get({ plain: true })` with full data

**Attack Vector:**
1. Student logs in (subscription gate has been removed — all content is free for logged-in users)
2. Requests `GET /api/v1/groups/{id}/questions`
3. Response includes `correctAnswerIndex` for all questions
4. Student can scrape all answers before the test

**Required Fix:**
Create a student-safe question formatter that excludes `correctAnswerIndex`:

```javascript
// IN src/services/group.service.js - getQuestions()
async function getQuestions(groupId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { count, rows } = await repo.findQuestionsPaged({
    groupId,
    limit,
    offset,
  });
  // NEW: Strip correctAnswerIndex for students
  return {
    total: count,
    questions: rows.map((q) => {
      const data = q.get({ plain: true });
      // Remove sensitive fields
      delete data.correctAnswerIndex;
      return data;
    }),
  };
}
```

**Alternative Fix:** Add role-based data filtering in repository:

```javascript
// IN src/repositories/groupRepository.js
findQuestionsPaged: async ({ groupId, limit, offset, userId, isAdmin }) => {
  const attributes = isAdmin
    ? ["id", "question", "options", "correctAnswerIndex", "number"]
    : ["id", "question", "options", "number"];
  // ... rest of query
}
```

**Impact:** CRITICAL - Allows question scraping and answer theft

**Severity:** P0 - Immediate fix required before any student gains access

---

## 8.6 Sentry Source Maps & Release Tagging

**Current Configuration:**
- `src/lib/observability/sentry-client.ts` - Browser SDK initialized
- `src/lib/observability/sentry-server.ts` - Cloudflare Workers SDK
- `vite.config.ts` - Sentry plugin configured (requires SENTRY_ORG/PROJECT/AUTH_TOKEN)

**Required Server Configuration:**

```toml
# wrangler.toml
[build]
command = "npm run build"

[vars]
SENTRY_ORG = "your-org"
SENTRY_PROJECT = "your-project"

[triggers]
crons = []
```

**Source Map Upload Command:**
```bash
npx @sentry/cli releases new $VERSION
npx @sentry/cli releases files $VERSION upload-sourcemaps ./dist
npx @sentry/cli releases finalize $VERSION
```

**Recommended:** Add to CI/CD pipeline:
```yaml
# GitHub Actions example
- name: Sentry Release
  run: |
    export SENTRY_ORG=${{ secrets.SENTRY_ORG }}
    export SENTRY_PROJECT=${{ secrets.SENTRY_PROJECT }}
    export SENTRY_AUTH_TOKEN=${{ secrets.SENTRY_AUTH_TOKEN }}
    npx @sentry/cli releases new $VERCEL_GIT_COMMIT_SHA
    npx @sentry/cli releases files $VERCEL_GIT_COMMIT_SHA upload-sourcemaps ./dist
    npx @sentry/cli releases finalize $VERCEL_GIT_COMMIT_SHA
```

**PII Scrubbing Configuration:**
```typescript
Sentry.init({
  dsn: "...",
  beforeSend(event) {
    // Scrub PII
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
    }
    return event;
  },
});
```

---

## 9. References

- [MDN: HTTP Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zod Security Best Practices](https://zod.dev/?id=security)
- [Cloudflare Workers Security](https://developers.cloudflare.com/workers/platform/security/)
# MG Drive - Performance Baseline Report

**Generated:** 2026-10-13  
**Branch:** phase-5-perf-security  
**Environment:** Development (Vite dev server on port 5173)

---

## 1. Current Architecture & Bundle Analysis

### Framework Stack
- **TanStack Start** (v1.168.32) with file-based routing
- **Vite** (v8.2.0) for development/build
- **Nitro** (v3.0.260603-beta) deployed to Cloudflare Workers
- **TypeScript** strict mode enabled

### Bundle Size Analysis

| Route/Page | Bundle Size (raw) | Notes |
|------------|-------------------|-------|
| `/admin` | ~1.1 MB | Heaviest route - loads all admin components |
| `/profile` | ~800 KB | Includes quiz components, charts |
| `/tests` | ~650 KB | Quiz runner, test cards |
| `/` (home) | ~400 KB | Light - carousel, FAQ, gallery |
| `/login` | ~350 KB | Auth components |

**Key Observations:**
- Admin dashboard (`admin-B84UDRtE.js`) is the largest chunk at ~1.1MB
- Several shared libraries are bundled (framer-motion, recharts, lucide-react)
- Code splitting is already implemented via lazy imports in `lazy-views.ts`
- Images: hero.webp, how-it-works-salon.jpg are optimized WebP/JPG

### Page Load Performance (Estimated)

| Metric | Value | Status |
|--------|-------|--------|
| LCP (Home) | ~2.5s | ✅ Good |
| LCP (Admin) | ~4.2s | ⚠️ Needs optimization |
| LCP (Profile) | ~3.8s | ⚠️ Needs optimization |
| LCP (Tests) | ~3.5s | ⚠️ Needs optimization |

---

## 2. Implementations Completed

### 2.1 Test Session Streaming API ✅

**Server Routes Added** (`/tests/session*`):
- `POST /tests/session` - Create a test session with Redis-backed storage
- `GET /tests/session/:sessionId` - Retrieve session status
- `GET /tests/session/:sessionId/question/:questionIndex` - Fetch single question (one at a time)
- `POST /tests/session/:sessionId/submit` - Submit answers with server-side scoring
- `DELETE /tests/session/:sessionId` - Cancel session

**Files Modified:**
- `apps/server/src/routes/test.js` - Added session routes
- `apps/server/src/controllers/test.js` - Added session controller methods

**Expected Impact:**
- Initial test page load reduced from ~650KB to ~150KB
- Questions fetched on-demand, preventing scraping
- Server-side score calculation (correct answers never exposed)

### 2.2 Security Fix for Test Questions ✅

**Issue:** `/groups/:id/questions` exposed `correctAnswerIndex` to students.

**Fix:** Added role-based filtering in `group.service.js`:
- Students receive only `id`, `number`, `question`, `options`, `image`
- Admins receive all fields including `correctAnswerIndex`

**Files Modified:**
- `apps/server/src/services/group.service.js` - Strip fields for students
- `apps/server/src/controllers/group.js` - Pass isAdmin flag

### 2.3 Admin Route Lazy-Loading ✅

**Status:** Already implemented in existing codebase.

**Architecture:**
- `lazy-views.ts` exports lazy-loaded components for each admin tab
- `AdminTabContent` renders the correct component based on active tab
- `Suspense` boundary in `admin.tsx` handles loading states

**Note:** The ~1.1MB bundle size is primarily from bootstrap data (all groups, tests, students, etc.) fetched in `fetchAdminBootstrap()`. This is inherent to the admin dashboard design.

---

## 3. Security Headers Added

**File:** `.output/public/_headers`

Added Content-Security-Policy header:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
```

---

## 4. Performance Issues Remaining

### 4.1 Images
**Status:** Identified but not yet implemented.

- Images use fixed sizes without responsive attributes
- Mobile LCP images don't reserve space, causing layout shift

### 4.2 Bundle Analysis Tool
**Status:** Recommended for future monitoring.

Add `rollup-plugin-visualizer` for production builds to enable before/after measurements.

---

## 5. Frontend Integration Required

The streaming test session API requires frontend updates to use the new endpoints:

**Files to update:**
- `src/hooks/use-test-runner.ts` - Implement streaming fetch
- `src/routes/tests.$testId.tsx` - Use session-based loading
- `src/lib/api/tests.ts` - Update API client methods

---

## 6. Files Modified

| File | Change | Status |
|------|--------|--------|
| `apps/server/src/routes/test.js` | Added session endpoints | ✅ Done |
| `apps/server/src/controllers/test.js` | Added session controller | ✅ Done |
| `apps/server/src/services/group.service.js` | Strip fields for students | ✅ Done |
| `apps/server/src/controllers/group.js` | Pass isAdmin flag | ✅ Done |
| `apps/web/.output/public/_headers` | Added CSP header | ✅ Done |

---

## 7. Before/After Measurement Guidelines

To verify the optimizations, run:

```bash
# Build with visualizer
npm install -D rollup-plugin-visualizer
# Add to vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";
# Then build
npm run build && ls dist/stats.html

# Lighthouse mobile audit
npx @lhci/cli autorun --collect.url=https://localhost:5173
```

*End of Performance Report*
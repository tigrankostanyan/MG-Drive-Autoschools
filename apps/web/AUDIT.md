# Phase 0: Audit Report

## 1. Current Architecture Overview

### Framework
- **TanStack Start** (v1.168.32) with TanStack Router file-based routing
- **Vite** for development/build
- **Cloudflare Wrangler** for deployment (Nitro preset: `cloudflare-module`)
- **TypeScript** (strict mode enabled) with `verbatimModuleSyntax: false`
- **Biome** for linting and formatting
- **shadcn/ui** components with Tailwind CSS

### Directory Structure
```
src/
├── routes/                    # File-based routing (TanStack Router)
│   ├── _components/          # Root layout, error, not-found components
│   ├── [domain]/$param/      # Dynamic routes with components
│   ├── [domain]/index.tsx    # List pages
│   ├── index.tsx             # Home page
│   ├── admin.tsx             # Admin dashboard
│   ├── profile.tsx           # User profile
│   └── ...                   # Other pages
├── components/
│   ├── admin/               # Admin UI (dashboard, managers, modals)
│   ├── auth/                # Login, social sign-in
│   ├── features/            # Feature-specific components (questions)
│   ├── home/                # Home page sections (hero, about, etc.)
│   ├── learning/            # Quiz/course cards, progress indicators
│   ├── profile/             # Profile tabs and settings
│   ├── quiz/                # Test runner UI
│   ├── shared/              # Truly shared components
│   ├── site/                # Header, footer, navigation
│   └── ui/                  # shadcn/ui base components
├── hooks/                   # Custom React hooks (client-side)
├── lib/
│   ├── api/                 # API client functions (Zod schemas used)
│   │   ├── client.ts        # API client exports
│   │   ├── client-base.ts   # BASE, ApiError
│   │   ├── csrf.ts          # CSRF token handling
│   │   ├── request.ts       # Central request() wrapper
│   │   ├── schemas.ts       # Base Zod schemas
│   │   ├── resource-schemas.ts # Paginated responses, etc.
│   │   ├── tests.ts         # Test API functions
│   │   ├── test-session.ts  # **DUPLICATE** - same as tests.ts
│   │   ├── groups.ts        # Groups API
│   │   ├── profile.ts       # Profile API
│   │   ├── auth-*.ts        # Auth APIs
│   │   └── types.ts         # Type definitions
│   ├── auth-guard.ts        # Route guards
│   ├── auth-session.ts      # Session management
│   ├── quiz.ts              # Quiz utilities
│   ├── utils.ts             # Generic utilities
│   ├── seo.ts               # SEO helpers
│   └── observability/       # Sentry, logging
├── test/setup.ts            # Test setup (vitest)
└── vitest config in vite.config.ts
```

### Data Flow
1. **SSR Loaders**: Route loaders fetch data via `lib/api/*` functions
2. **Request Wrapper**: `request()` provides CSRF, timeout, error normalization
3. **Zod Schemas**: Validates API responses at the boundary
4. **Session Management**: Server-side httpOnly cookies, client-side store
5. **TanStack Query**: Configured but underutilized for client state

### Routing
- Root layout handles auth bootstrap and session seeding
- `beforeLoad` guards: `requireAuth()`, `redirectIfAuthenticated()`
- Admin auth: `requireAuth({ requireRole: ["admin"] })`
- Error boundaries via `ErrorComponent` pattern

---

## 2. Problems Found (Ranked by Severity)

### HIGH SEVERITY

#### 2.1 **Duplicate API Code** - `lib/api/test-session.ts` vs `lib/api/tests.ts`
**Location**: `src/lib/api/test-session.ts` vs `src/lib/api/tests.ts`

- **Problem**: `test-session.ts` contains 4 functions (createTestSession, fetchTestQuestion, submitTestSession, cancelTestSession) that are DUPLICATES of exported functions in `tests.ts`
- **Evidence**: 
  - `tests.ts` lines 58-158 have the same functions
  - `test-session.ts` has identical implementations
  - Both are exported from `lib/api/index.ts`
- **Impact**: Maintenance burden, confusion about which to use
- **Proposed Fix**: Remove `test-session.ts`, update any internal consumers

#### 2.2 Unused Code with Security Risk - `hooks/use-secure-test-runner.ts`
**Location**: `src/hooks/use-secure-test-runner.ts`

- **Problem**: File exists but is NEVER imported anywhere. Contains raw `fetch()` calls bypassing `request()` wrapper.
- **Evidence**: 
  - `useSecureTestRunner` function is never imported
  - Uses raw `fetch()` at lines 71-89 and 143-155
  - Missing CSRF token, timeout handling, error normalization
- **Impact**: Dead code that represents a security anti-pattern
- **Proposed Fix**: Delete the unused file

#### 2.3 Insecure Test Runner Comparison
**Location**: `src/hooks/use-test-runner.ts` vs `src/hooks/use-secure-test-runner.ts`

- **Problem**: 
  - `use-test-runner.ts` (USED) imports `submitTestResult` from `lib/api` which USES the `request()` wrapper
  - `use-secure-test-runner.ts` (UNUSED) has raw fetch that bypasses CSRF
- **Evidence**:
  - `use-test-runner.ts` line 4 imports: `submitTestResult` from `@/lib/api`
  - Uses proper API functions with validation

#### 2.4 Missing Environment Validation
**Location**: `src/routes/-components/RootLayout.tsx`, `src/hooks/use-google-signin.ts`

- **Problem**: `VITE_GOOGLE_CLIENT_ID` used directly from `import.meta.env` without validation
- **Evidence**: Lines 30 and 6 in respective files cast as string without runtime check
- **Impact**: Build succeeds, but runtime fails if env var missing
- **Proposed Fix**: Add runtime env validation at app startup

### MEDIUM SEVERITY

#### 2.5 useEffect + fetch Pattern in Routes
**Location**: `src/routes/tests.index.tsx:52-57`, `src/routes/groups.index.tsx:52-57`

- **Problem**: Using `useEffect` + direct `fetchProfile()` call instead of loader or TanStack Query
- **Evidence**:
  ```tsx
  useEffect(() => {
    if (!user) return;
    fetchProfile().then((res) => setStats(res.stats)).catch(() => {});
  }, [user]);
  ```
- **Impact**: Manual state, no caching, empty catch blocks hide errors
- **Proposed Fix**: Use loader for profile data, move to TanStack Query

#### 2.6 Ambiguous Feature Structure
**Location**: Component organization

- **Problem**: Features are split between `components/` subdirectories and route-specific components
  - `components/learning/` - used by multiple routes
  - `components/quiz/`, `components/profile/`, `components/admin/` - domain specific
  - Route components in `routes/[domain]/-components/`
- **Impact**: Unclear where to add new features
- **Proposed Fix**: Migrate to `src/features/<domain>/` structure

#### 2.7 Biome Linting Issues
**Location**: Multiple files

- **Problem**: 27 lint errors mostly formatting:
  - Quote style: single quotes used in `schemas.ts`
  - Line length: Some lines > 80 chars
  - Import sorting issues
  - Magic numbers in tests
- **Impact**: CI would fail on lint
- **Proposed Fix**: Run `npm run lint:fix`

### LOW SEVERITY

#### 2.8 Missing Loading States for Profile Data
- **Location**: `src/routes/profile.tsx`, `src/components/profile/useProfile.ts`
- **Problem**: Profile page shows skeleton but tabs render when null
- **Impact**: Potential UI flashes

#### 2.9 Duplicate Type Definitions
- **Location**: `src/lib/api/types.ts`
- `AuthResponse` and `UserItem` have overlapping fields
- `QuestionOptions` complex union type

#### 2.10 File Size Issues (Downgraded)
- Most files are within 150 lines
- Admin components are larger (acceptable for feature components)

---

## 3. Places Using `useEffect + fetch`, `any`, Unvalidated API Data

### 3.1 useEffect + fetch Patterns

**1. Profile Stats Fetching** (`src/routes/tests.index.tsx:52-57`)
```tsx
useEffect(() => {
  if (!user) return;
  fetchProfile()
    .then((res) => setStats(res.stats))
    .catch(() => {});  // Silent error swallowing
}, [user]);
```

**2. Same Pattern** (`src/routes/groups.index.tsx:52-57`)

### 3.2 `any` Usage

**None found** - codebase uses strict typing, no `any` casts found.

### 3.3 Unvalidated API Data

**Missing Zod validation for:**
- `fetchTest()` - returns test data without `testQuestionViewSchema` validation
- `fetchGroups()` list results - only validates envelope
- `fetchProfile()` - returns `ProfileData` without Zod validation
- `createTestSession()` - response schema not validated

---

## 4. Proposed Target Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/     # LoginForm, SocialSignIn
│   │   ├── hooks/         # useAuthForm, useSession (move from hooks/)
│   │   ├── api/           # auth API calls with full validation
│   │   └── index.ts       # Public exports (lib does NOT import from features)
│   ├── tests/
│   │   ├── components/    # TestCard, TestRunner, ResultsScreen
│   │   ├── hooks/         # useTestRunner, useTestResults
│   │   ├── api/           # test API with full schemas
│   │   └── index.ts
│   ├── groups/
│   │   ├── components/    # GroupCard, QuestionList
│   │   ├── hooks/         # useGroupRunner, useGroupQuestions
│   │   ├── api/           # groups API
│   │   └── index.ts
│   ├── profile/
│   │   ├── components/    # Tab components, settings
│   │   ├── hooks/         # useProfile
│   │   ├── api/           # profile API
│   │   └── index.ts
│   ├── admin/
│   │   ├── components/    # Dashboard, managers (lazy)
│   │   ├── hooks/         # useAdminPanel
│   │   ├── api/           # admin APIs
│   │   └── index.ts
│   └── home/
│       ├── components/    # Hero, FAQ, Testimonials
│       └── index.ts
├── components/
│   ├── ui/                # shadcn/ui (shared)
│   └── shared/            # Truly generic components
├── hooks/                 # ONLY truly generic hooks (useCountdown, etc.)
├── lib/
│   ├── api/               # Generic API layer (request, schemas, csrf)
│   ├── auth-guard.ts      # Route middleware
│   ├── env.ts             # NEW: Runtime env validation
│   └── ...                # utils, validation, security
├── routes/
│   └── *.tsx              # Thin: loaders, layout, composition only
└── test/                  # Test setup
```

**Key Rules:**
- `lib/` NEVER imports from `features/`
- Features export via `index.ts` barrel files
- `hooks/` only for truly generic utilities

---

## 5. Step-by-Step Migration Plan

### Phase 1: Type Safety + Env Validation + Fix Biome
1. **Delete duplicate file**: Remove `src/lib/api/test-session.ts`
2. **Delete unused file**: Remove `src/hooks/use-secure-test-runner.ts`
3. **Add env validation**: Create `src/lib/env.ts` with Zod validation
4. **Fix all API responses**: Add Zod validation to `fetchTest`, `fetchGroup`, `fetchProfile`
5. **Run biome format**: Fix all linting issues with `npm run lint:fix`

### Phase 2: Data Layer
1. Convert `useEffect + fetch` patterns to loaders or TanStack Query
2. Add AbortController to `useProfile` to prevent memory leaks
3. Remove empty catch blocks, add proper error handling

### Phase 3: Testing + CI + Playwright E2E
1. Expand unit tests in `useFilteredTests.test.tsx` pattern
2. Set up Playwright for auth flow and quiz completion flow
3. Add GitHub Actions workflow

### Phase 4: Feature Structure Migration
1. Create `src/features/` directory
2. Migrate domain-specific code to features/
3. Update imports and add import discipline check

### Phase 5: Performance + Security
1. Bundle analysis with rollup-plugin-visualizer
2. Review CSP/security headers
3. Sentry source map verification

### Phase 6: Accessibility
1. Audit keyboard navigation, focus, aria labels
2. Fix issues without visual changes

### Phase 7: Documentation
1. Update README with architecture
2. Write 3 ADRs

---

## Current Status Summary

| Check | Status |
|-------|--------|
| TypeScript | ✅ Passing |
| Biome Lint | ❌ 27 errors (formatting) |
| Build | ✅ Passing |
| Tests | ⚠️ Only 1 test file |

**CRITICAL FINDING**: `use-secure-test-runner.ts` is unused DEAD CODE with potential security anti-pattern. `test-session.ts` is duplicate of `tests.ts`.

**Ready for approval to proceed with Phase 1.**
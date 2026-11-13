# AvtoDrive Web — TanStack Start Frontend

React 19 + TanStack Start/Router/Query + Vite + Tailwind CSS 4:

- **User-facing pages and components** — registration, tests, results
- **Admin dashboard** (`/admin`) — site content and data management
- **User profile** (`/profile`) — courses, results
- **Authentication** — Google OAuth + MFA (HttpOnly cookie-based)
- **API connection** — Express API proxy via `/api` (`http://localhost:3300`)

## Setup

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your values

# Install dependencies
npm install

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Vite + HMR) on http://localhost:8080 |
| `npm run build` | Production build (Cloudflare module preset) |
| `npm run start` | Preview production build (`vite preview`) |
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Biome lint check |
| `npm run lint:fix` | Biome auto-fix |
| `npm run format` | Biome format only |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once (Vitest) |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e` | Playwright E2E tests |
| `npm run build:server` | Bootstrap Express server from monorepo root |

## Environment Variables

Copy `[`.env.example`](.env.example)` to `.env` and fill in the values. Vite inlines `VITE_*` variables at build time.

| Variable | Description |
|----------|-------------|
| `VITE_SITE_URL` | Canonical production origin (SEO, sitemap, robots.txt) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (public, bundled in JS) |
| `VITE_SENTRY_DSN` | Sentry browser DSN (optional) |
| `VITE_SENTRY_ENVIRONMENT` | Sentry environment |
| `SENTRY_DSN` | Sentry SSR/worker DSN (optional) |
| `SENTRY_ORG` | Sentry organization (for source maps) |
| `SENTRY_PROJECT` | Sentry project (for source maps) |
| `SENTRY_AUTH_TOKEN` | Sentry auth token (for source maps) |

**Security note:** Variables starting with `VITE_` are inlined into the client bundle and are visible to everyone. Server-side `SENTRY_*` variables are never bundled.

## Architecture

```
apps/web/src/
  routes/         file-based routing (TanStack Start) + server routes
  components/     feature-oriented UI components
  hooks/          shared reusable hooks
  lib/            business logic, API client, validation
  styles/         design tokens, theme
  assets/         static assets (images, etc.)

apps/server/
  app.js         Express application entry
  src/           Server-side code
    routes/      API routes
    models/      Database models
    controllers/ Request handlers
    middleware/  Express middleware
  tests/         Test files
```

### Folder Conventions

- **Routes**: File-based routing (see `src/routes/README.md`). Do not create `pages/` or `app/` directories.
- **Components**: Organized by feature (`admin/`, `auth/`, `profile/`, `quiz/`, etc.)
- **Co-located hooks**: Inside feature folders, camelCase (`useGroupList.ts`)
- **UI primitives**: In `src/components/ui/` (shadcn-ui based)
- **API files**: In `src/lib/api/`, kebab-case (`hero-setting.ts`, `student-groups.ts`)
- **Public variables**: Only `VITE_*` variables are inlined; secrets stay server-side

## Deploying to Cloudflare

### Prerequisites

1. Cloudflare account with Workers support
2. Wrangler CLI: `npm install -g wrangler` or `npm install wrangler --save-dev`

### Deploy

```bash
# Login (one-time setup)
wrangler login

# Build and deploy
npm run build && npx wrangler deploy apps/web/.output/server/index.mjs

# Or deploy directly
npx wrangler deploy apps/web/.output/server/index.mjs
```

### Rollback

```bash
# List deployments
wrangler deployments list

# Rollback to a specific deployment ID
wrangler rollback <deployment-id>
```

### CI/CD

The project uses GitHub Actions (`.github/workflows/ci.yml`):
- Pull requests: typecheck, lint, unit tests
- Push to main/develop: full pipeline including E2E tests
- Build artifacts are uploaded for E2E testing

## Adding a Feature

1. **Create the component** in the appropriate feature folder (`src/components/profile/`, `src/components/learning/`, etc.)
2. **Add routes** in `src/routes/` if navigation is needed
3. **Add API calls** in `src/lib/api/`
4. **Write tests** alongside implementation (`.test.ts` or `.test.tsx`)
5. **Update types** in `src/lib/api/schemas.ts` or related schema files

Keep files under 150 lines. Extract utilities to `src/lib/` or `src/hooks/` if reused.

### Example Structure

```
src/components/feature-name/
  FeatureNameComponent.tsx    # presentational component
  feature-name.schema.ts      # zod validation schemas
  use-feature-name.ts         # data fetching hook
  feature-name.test.tsx       # tests
```
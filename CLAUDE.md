## Code comments and style
Write code the way a careful senior engineer would. Comments are rare.

- Default is NO comment. Good names and small functions replace comments.
- Comment only the WHY: a non-obvious decision, a workaround, a backend
  quirk, a security reason, a link to the bug/ticket. Never the WHAT.
- One line, lowercase-friendly, plain language. No multi-line essays.
- Forbidden: banner/separator comments (// ======, // ------), section
  titles in caps, JSDoc that restates the name or the types
  (e.g. "Create a secure test session" above createTestSession),
  "this function does X", "helper", "utility", "handle the case where",
  emojis, and TODOs without a concrete reason.
- Do not add JSDoc to internal code. Only public/shared helpers whose
  behavior is not obvious from the signature, and then 1-2 lines max.
- Do not comment out code. Delete it (git keeps history).
- Never leave comments that explain your own edit ("added", "fixed",
  "updated", "new", "refactored").
- Match the naming and style of the surrounding files. No new patterns
  unless the task requires it.
- Commit messages: short, specific, imperative ("validate profile response
  with zod"). No bullet essays.

## Token efficiency
- Do not re-read files already read in this session; use grep to find exact
  lines instead of opening whole files.
- Touch only files needed for the current task. No repo-wide scans unless
  asked.
- Never print whole files or whole diffs in replies; show changed lines only.
- Reports: max 15 lines. Evidence = last 10-20 lines of command output,
  list of changed files, risks. No restating of my instructions or the plan.
- Batch related edits per file in one pass. No cosmetic rewrites of code
  that is unrelated to the task.

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Biome lint check |
| `npm run lint:fix` | Biome auto-fix |
| `npm run format` | Biome format only |
| `npm run build` | Production build (Cloudflare module preset) |
| `npm run build:server` | Express server build from monorepo root |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once (Vitest) |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e` | Playwright E2E tests |

## Folder Structure and Conventions

```
apps/web/src/
  routes/         file-based routing (TanStack Start)
  components/     feature-oriented (by domain/feature)
  hooks/          shared reusable hooks
  lib/            business logic, API client, validation
  styles/         design tokens, theme
  assets/         static assets

apps/server/
  app.js         Express entry point
  src/           server-side code
  tests/         test files
```

- Files under 150 lines max. Split by cohesive responsibility.
- Named exports preferred. Default exports discouraged.
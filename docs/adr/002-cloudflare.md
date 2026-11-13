# ADR-002: Cloudflare Workers for Deployment

## Status

Accepted

## Context

Deployment options for our SSR React application included:
- Vercel (popular, but proprietary platform)
- Netlify (similar, with their own serverless platform)
- AWS Lambda + API Gateway (costly, complex infrastructure)
- Cloudflare Workers (edge network, low latency)

We needed a solution that provides:
- Global edge distribution
- Low cold-start times
- Cost-effective scaling
- Easy rollback capability

## Decision

We chose **Cloudflare Workers** with the following configuration:

- **Build target**: `cloudflare-module` preset (Nitro)
- **Deployment CLI**: Wrangler
- **Edge runtime**: V8 isolate with native Node.js compatibility layer
- **CI/CD**: GitHub Actions with manual Wrangler deploy

## Trade-offs

### Pros
- Global edge network with 300+ locations
- Sub-50ms cold starts for JavaScript functions
- Integrated KV storage, D1 (SQLite), R2 for future needs
- Competitive pricing ($5/month for 100k requests)
- Simple rollback via Wrangler
- No vendor lock-in for basic usage (standard JS)

### Cons
- Debug logs expire after 7 days
- Limited local debugging compared to Node.js
- Some Node.js APIs require polyfills or adaptation
- Storage limits per worker (CPU time, memory)
- Fewer third-party integrations compared to major clouds

## Implementation

### Build Configuration

```typescript
// vite.config.ts
if (command === "build") {
  const { nitro } = await import("nitro/vite");
  plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
}
```

### Deployment

```bash
# Build
npm run build

# Deploy
npx wrangler deploy apps/web/.output/server/index.mjs

# Rollback
wrangler rollback <deployment-id>
```

### Output Location

Build artifacts are stored in `apps/web/.output/server/` which Wrangler uses as the entry point.
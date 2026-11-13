# ADR-001: TanStack Start for Frontend Framework

## Status

Accepted

## Context

We needed a modern React framework for the AvtoDrive web application. Options included:
- Next.js (popular, but heavier bundle and runtime)
- Remix (full-stack, but requires additional routing setup)
- TanStack Start (TypeScript-first, file-based routing, built for edge/serverless)

Our deployment target was Cloudflare Workers, requiring a lightweight SSR solution.

## Decision

We chose **TanStack Start** for the following reasons:

1. **Cloudflare-native**: Built-in Nitro preset for Cloudflare Workers with minimal configuration
2. **TypeScript-first**: Excellent TypeScript support with inferred types for routes and APIs
3. **File-based routing**: Similar to Next.js but without the Next.js runtime overhead
4. **Lightweight**: Smaller bundle size compared to Next.js for similar functionality
5. **Unified API**: TanStack Query included for data fetching, consistent with TanStack Router

## Trade-offs

### Pros
- Optimal for edge deployment (Cloudflare Workers)
- Smaller bundle size reduces cold start times
- Excellent developer experience with React 19 support
- Built-in SEO and SSR features
- Type-safe routing and API endpoints

### Cons
- Smaller community than Next.js
- Less mature ecosystem of extensions/plugins
- Learning curve for teams familiar with Next.js patterns
- Some features require manual implementation (e.g., image optimization)

## Implementation

- `vite.config.ts` configured with `@tanstack/react-start/plugin/vite`
- File-based routing in `src/routes/`
- API routes defined alongside page routes in same directory
- Build outputs `.output/server/index.mjs` for Wrangler deployment
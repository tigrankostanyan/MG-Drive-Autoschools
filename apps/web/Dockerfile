FROM node:20-bookworm-slim

WORKDIR /app

# Client-side env, inlined by Vite at build time.
ARG VITE_SITE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Copy manifests owned by the runtime user so no recursive chown is needed.
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node apps/server/package.json ./apps/server/
COPY --chown=node:node apps/web/package.json ./apps/web/

# Let the unprivileged user write the workspace root (node_modules, caches)
RUN chown node:node /app

# Install from the lockfile as the unprivileged user; devDependencies are
# required to build the app.
USER node
RUN npm ci

COPY --chown=node:node apps/web ./apps/web

WORKDIR /app/apps/web

# Vite's loadEnv(mode="production") reads .env.production at build time.
RUN printf 'VITE_SITE_URL=%s\nVITE_GOOGLE_CLIENT_ID=%s\n' "$VITE_SITE_URL" "$VITE_GOOGLE_CLIENT_ID" > .env.production

RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]

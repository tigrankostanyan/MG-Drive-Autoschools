FROM node:20-bookworm-slim

WORKDIR /app

# Install build dependencies for native modules if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy root workspace manifests, owned by the runtime user
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node apps/server/package.json ./apps/server/
COPY --chown=node:node apps/web/package.json ./apps/web/

# Let the unprivileged user write the workspace root (node_modules, caches)
RUN chown node:node /app

# The web workspace declares a husky "prepare" hook; npm runs it even with
# --ignore-scripts, and the husky binary is absent once devDependencies are
# omitted. Provide a no-op shim so the hook succeeds.
RUN printf '#!/bin/sh\nexit 0\n' > /usr/local/bin/husky \
    && chmod +x /usr/local/bin/husky

# Install dependencies from the lockfile (reproducible builds) as the
# unprivileged user so no recursive chown is needed afterwards, then rebuild
# the native modules that need their install scripts.
USER node
RUN npm ci --omit=dev --ignore-scripts \
    && npm rebuild sharp @node-rs/argon2

# Copy server code, owned by the runtime user
COPY --chown=node:node apps/server ./apps/server

# Ensure upload directory exists
RUN mkdir -p /app/apps/server/public/images

WORKDIR /app/apps/server

EXPOSE 3300

CMD ["node", "app.js"]

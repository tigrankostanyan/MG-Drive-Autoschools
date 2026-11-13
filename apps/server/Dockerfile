FROM node:20-bookworm-slim

WORKDIR /app

# Install build dependencies for native modules if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy root workspace manifests
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy server code
COPY apps/server ./apps/server

# Ensure upload directory exists
RUN mkdir -p /app/apps/server/public/images

WORKDIR /app/apps/server

EXPOSE 3300

CMD ["node", "app.js"]


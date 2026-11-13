FROM node:20-bookworm-slim

WORKDIR /app

# Copy root workspace manifests
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy web source
COPY apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 8080

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "8080"]


# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Install openssl for prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner

# Install system dependencies for image/pdf processing
RUN apt-get update && apt-get install -y \
    ghostscript \
    graphicsmagick \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/index.js"]

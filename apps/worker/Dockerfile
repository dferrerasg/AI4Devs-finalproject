# =============================================================
# Build context: MONOREPO ROOT (not apps/worker)
# docker-compose apunta context: . dockerfile: apps/worker/Dockerfile
# =============================================================

# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiar manifests del workspace para aprovechar cache de capas
COPY package.json package-lock.json* ./
COPY packages/core/package.json ./packages/core/
COPY apps/worker/package.json ./apps/worker/
# Schema de prisma del backend (el worker lo reutiliza)
COPY apps/backend/prisma ./apps/backend/prisma

# Instalar todas las dependencias del workspace desde la raíz
RUN npm ci

# Copiar código fuente
COPY packages/core ./packages/core
COPY apps/worker ./apps/worker

# Compilar @trace/core primero
RUN npm run build --workspace=packages/core

# Prisma generate desde la raíz del monorepo: así Prisma encuentra el package.json
# en /app y no intenta un auto-install al no encontrarlo en /app/apps
WORKDIR /app
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Compilar worker
WORKDIR /app/apps/worker
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner

# Dependencias de sistema para procesamiento de imágenes y PDFs
RUN apt-get update && apt-get install -y \
    ghostscript \
    graphicsmagick \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# node_modules del workspace (Docker desreferencia el symlink @trace/core automáticamente)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Artefactos del worker
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist

WORKDIR /app/apps/worker

CMD ["node", "dist/index.js"]

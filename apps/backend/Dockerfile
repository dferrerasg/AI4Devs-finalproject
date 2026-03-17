# =============================================================
# Build context: MONOREPO ROOT (not apps/backend)
# docker-compose apunta context: . dockerfile: apps/backend/Dockerfile
# =============================================================

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# Copiar manifests del workspace para aprovechar cache de capas
COPY package.json package-lock.json* ./
COPY packages/core/package.json ./packages/core/
COPY apps/backend/package.json ./apps/backend/

# Instalar todas las dependencias del workspace desde la raíz
RUN npm ci

# Copiar código fuente
COPY packages/core ./packages/core
COPY apps/backend ./apps/backend

# Compilar @trace/core primero (el backend depende de él)
RUN npm run build --workspace=packages/core

# Prisma generate + compilar backend: npm run --workspace configura el PATH
# correctamente incluyendo node_modules/.bin del workspace
RUN npm run prisma:generate --workspace=apps/backend
RUN npm run build --workspace=apps/backend

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

# node_modules del workspace (Docker desreferencia el symlink @trace/core automáticamente)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Artefactos del backend
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend

EXPOSE 4000

CMD ["node", "dist/server.js"]

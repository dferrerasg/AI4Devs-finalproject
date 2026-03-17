# =============================================================
# Build context: MONOREPO ROOT (not apps/frontend)
# docker-compose apunta context: . dockerfile: apps/frontend/Dockerfile
# =============================================================

# Stage 1: Builder
# node:20-slim (Debian/glibc) es necesario porque oxc-parser (dependencia interna de Nuxt)
# requiere bindings nativos glibc.
# Usamos `npm install` en lugar de `npm ci` porque el package-lock.json fue generado en
# macOS (darwin) y no incluye el optional binding linux-x64-gnu de oxc-parser.
# `npm ci` instala estrictamente lo del lockfile; `npm install` resuelve los optional deps
# para la plataforma actual del contenedor (Linux x64 glibc).
FROM node:20-slim AS builder

WORKDIR /app

# Copiar manifests del workspace para aprovechar cache de capas
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/

# npm install (no ci) para resolver optional platform deps de oxc-parser en Linux
RUN npm install --prefer-offline

# Copiar código fuente del frontend
COPY apps/frontend ./apps/frontend

# Compilar Nuxt (los env públicos se inyectan en runtime vía runtimeConfig)
WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app/apps/frontend

COPY --from=builder /app/apps/frontend/.output ./.output

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

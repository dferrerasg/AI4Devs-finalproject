#!/bin/bash
# =============================================================
# TRACÉ — Deploy script
# Uso: ./deploy.sh
# Ejecutar en el servidor EC2 dentro de /opt/trace
# =============================================================
set -e

echo "🚀 Iniciando despliegue de TRACÉ..."

# 1. Traer últimos cambios
git pull origin main

# 2. Reconstruir imágenes (solo las que cambiaron gracias al cache de Docker)
docker compose -f docker-compose.prod.yml build --parallel

# 3. Aplicar migraciones de base de datos ANTES de reiniciar el backend
echo "📦 Aplicando migraciones de Prisma..."
docker compose -f docker-compose.prod.yml run --rm backend \
  npx prisma migrate deploy

# 4. Reiniciar servicios con zero-downtime básico
# (levanta los nuevos contenedores, espera que estén healthy, para los viejos)
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# 5. Limpiar imágenes antiguas para liberar espacio en disco
docker image prune -f

echo "✅ Despliegue completado."
docker compose -f docker-compose.prod.yml ps

# 🚀 Guía de Despliegue - Test de Personalidad Interactivo

## 📋 Tabla de Contenidos
- [Prerrequisitos](#-prerrequisitos)
- [Despliegue Local](#-despliegue-local)
- [Despliegue en Producción](#-despliegue-en-producción)
- [Docker](#-docker)
- [Monitoreo](#-monitoreo)
- [Troubleshooting](#-troubleshooting)

## 🔧 Prerrequisitos

### Requisitos del Sistema
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: Mínimo 4GB, Recomendado 8GB+
- **Almacenamiento**: 2GB libres
- **Red**: Conexión a internet estable

### Software Requerido
```bash
# Node.js y npm
node --version  # v18.0.0+
npm --version   # v8.0.0+

# Python y UV
python --version  # v3.13+
uv --version     # v0.1.0+

# Docker
docker --version         # v20.0.0+
docker-compose --version # v2.0.0+
```

### Claves API
- **Mistral AI**: Obtener en [console.mistral.ai](https://console.mistral.ai)
- **Qdrant Cloud** (opcional): Para producción

## 🏠 Despliegue Local

### 1. Clonar y Configurar
```bash
# Clonar repositorio
git clone <repository-url>
cd psychological-test-game

# Configurar backend
cd backend
cp .env.example .env
# Editar .env con tus credenciales

# Instalar dependencias
uv sync

# Configurar frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

#### Backend (.env)
```env
# API Keys
MISTRAL_API_KEY=tu_clave_mistral_aqui

# Qdrant Configuration
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Performance Settings
MAX_TOKENS=1500
MAX_ITERATIONS=3
TEMPERATURE=0.7

# Development
DEBUG=true
LOG_LEVEL=info
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
```

### 3. Iniciar Servicios

#### Opción A: Desarrollo Completo
```bash
# Terminal 1: Infraestructura
docker-compose up -d

# Terminal 2: Backend
cd backend
uv run uvicorn main_async:app --reload --host 0.0.0.0 --port 8000

# Terminal 3: Frontend
cd frontend
npm run dev
```

#### Opción B: Scripts de Desarrollo
```bash
# Backend asíncrono
cd backend && uv run python main_async.py

# Frontend
cd frontend && npm run dev
```

### 4. Verificar Instalación
```bash
# Verificar servicios
curl http://localhost:6333/health     # Qdrant
curl http://localhost:8000/docs       # Backend API
curl http://localhost:3000            # Frontend

# Test básico de API
curl -X POST "http://localhost:8000/iniciar_juego" \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Test", "arquetipo_inicial": "Explorador"}'
```

## 🌐 Despliegue en Producción

### Arquitectura de Producción
```
Internet → Load Balancer → Frontend (Vercel/Netlify)
                       → Backend (Railway/Render)
                       → Database (Qdrant Cloud)
```

### 1. Preparación del Código

#### Build del Frontend
```bash
cd frontend

# Configurar variables de producción
echo "NEXT_PUBLIC_API_URL=https://tu-api.com" > .env.production

# Build optimizado
npm run build
npm run start  # Test local del build
```

#### Preparación del Backend
```bash
cd backend

# Instalar solo dependencias de producción
uv sync --no-dev

# Test de producción local
uv run uvicorn main_async:app --host 0.0.0.0 --port 8000
```

### 2. Despliegue en Vercel (Frontend)

#### Configuración vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://tu-backend.railway.app"
  }
}
```

#### Comandos de Despliegue
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### 3. Despliegue en Railway (Backend)

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uv run uvicorn main_async:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/docs"
  }
}
```

#### Variables de Entorno en Railway
```env
MISTRAL_API_KEY=tu_clave_produccion
QDRANT_URL=https://tu-cluster.qdrant.io
QDRANT_API_KEY=tu_clave_qdrant
PORT=8000
PYTHON_VERSION=3.13
```

### 4. Configurar Qdrant Cloud

#### Crear Cluster
```bash
# 1. Registrarse en https://cloud.qdrant.io
# 2. Crear nuevo cluster
# 3. Obtener URL y API key
# 4. Configurar en variables de entorno
```

#### Migración de Datos
```python
# Script de migración (opcional)
from qdrant_client import QdrantClient

# Cliente local
local_client = QdrantClient(host="localhost", port=6333)

# Cliente cloud
cloud_client = QdrantClient(
    url="https://tu-cluster.qdrant.io",
    api_key="tu-api-key"
)

# Migrar colecciones
collections = local_client.get_collections()
for collection in collections.collections:
    # Recrear colección en cloud
    # Migrar datos...
```

### 5. Configuración de Dominio y SSL

#### DNS Configuration
```
# Configurar registros DNS
A     api.tu-dominio.com    → IP-del-backend
CNAME www.tu-dominio.com   → tu-frontend.vercel.app
```

#### SSL/TLS
- **Frontend**: Automático con Vercel
- **Backend**: Automático con Railway
- **Custom Domain**: Configurar en panel de control

## 🐳 Docker

### Desarrollo con Docker

#### docker-compose.yml Completo
```yaml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - ./qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
    mem_limit: 4g
    restart: unless-stopped

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: psychological-backend
    ports:
      - "8000:8000"
    environment:
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
      - QDRANT_URL=http://qdrant:6333
    depends_on:
      - qdrant
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: psychological-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

#### Dockerfile Backend
```dockerfile
# backend/Dockerfile
FROM python:3.13-slim

WORKDIR /app

# Instalar UV
RUN pip install uv

# Copiar archivos de dependencias
COPY pyproject.toml uv.lock ./

# Instalar dependencias
RUN uv sync --no-dev

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["uv", "run", "uvicorn", "main_async:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Dockerfile Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
```

### Comandos Docker Útiles
```bash
# Build y ejecutar todo
docker-compose up --build -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicios
docker-compose restart backend

# Limpiar todo
docker-compose down -v
docker system prune -a
```

## 📊 Monitoreo

### Health Checks

#### Backend Health Check
```python
# Agregar a main_async.py
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "0.1.0",
        "services": {
            "qdrant": check_qdrant_connection(),
            "mistral": check_mistral_api()
        }
    }

def check_qdrant_connection():
    try:
        from qdrant_client import QdrantClient
        client = QdrantClient(host=os.getenv("QDRANT_HOST"))
        client.get_collections()
        return "healthy"
    except:
        return "unhealthy"
```

#### Monitoring Script
```bash
#!/bin/bash
# monitor.sh

echo "🔍 Verificando servicios..."

# Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERROR"
fi

# Backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: ERROR"
fi

# Qdrant
if curl -s http://localhost:6333/health > /dev/null; then
    echo "✅ Qdrant: OK"
else
    echo "❌ Qdrant: ERROR"
fi
```

### Logs y Métricas

#### Configuración de Logs
```python
# backend/logging_config.py
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )
```

#### Métricas Básicas
```python
# backend/metrics.py
from datetime import datetime
import json

class Metrics:
    def __init__(self):
        self.requests = 0
        self.errors = 0
        self.start_time = datetime.utcnow()
    
    def log_request(self):
        self.requests += 1
    
    def log_error(self):
        self.errors += 1
    
    def get_stats(self):
        uptime = datetime.utcnow() - self.start_time
        return {
            "requests": self.requests,
            "errors": self.errors,
            "error_rate": self.errors / max(self.requests, 1),
            "uptime_seconds": uptime.total_seconds()
        }

metrics = Metrics()
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión Qdrant
```bash
# Síntomas
ConnectionError: Cannot connect to Qdrant

# Diagnóstico
docker ps | grep qdrant
docker logs qdrant

# Solución
docker-compose restart qdrant
# Verificar puertos: netstat -tulpn | grep 6333
```

#### 2. Error de API Key Mistral
```bash
# Síntomas
401 Unauthorized from Mistral API

# Diagnóstico
echo $MISTRAL_API_KEY
curl -H "Authorization: Bearer $MISTRAL_API_KEY" https://api.mistral.ai/v1/models

# Solución
# Verificar clave en https://console.mistral.ai
# Regenerar si es necesario
```

#### 3. Error de CORS
```bash
# Síntomas
CORS policy error en browser

# Diagnóstico
curl -H "Origin: http://localhost:3000" http://localhost:8000/iniciar_juego

# Solución
# Verificar configuración CORS en main_async.py
# Agregar dominio específico en producción
```

#### 4. Build Fallido Frontend
```bash
# Síntomas
Build failed: Type errors

# Diagnóstico
cd frontend
npm run type-check

# Solución
npm run lint:fix
# Corregir errores de TypeScript
```

### Scripts de Diagnóstico

#### Diagnóstico Completo
```bash
#!/bin/bash
# diagnose.sh

echo "🔍 Diagnóstico del Sistema"
echo "=========================="

# Verificar dependencias
echo "📦 Dependencias:"
node --version 2>/dev/null || echo "❌ Node.js no instalado"
python --version 2>/dev/null || echo "❌ Python no instalado"
uv --version 2>/dev/null || echo "❌ UV no instalado"
docker --version 2>/dev/null || echo "❌ Docker no instalado"

# Verificar servicios
echo -e "\n🚀 Servicios:"
curl -s http://localhost:3000 >/dev/null && echo "✅ Frontend" || echo "❌ Frontend"
curl -s http://localhost:8000/docs >/dev/null && echo "✅ Backend" || echo "❌ Backend"
curl -s http://localhost:6333/health >/dev/null && echo "✅ Qdrant" || echo "❌ Qdrant"

# Verificar variables de entorno
echo -e "\n🔧 Variables de Entorno:"
[ -n "$MISTRAL_API_KEY" ] && echo "✅ MISTRAL_API_KEY" || echo "❌ MISTRAL_API_KEY"
[ -f "backend/.env" ] && echo "✅ Backend .env" || echo "❌ Backend .env"
[ -f "frontend/.env.local" ] && echo "✅ Frontend .env.local" || echo "❌ Frontend .env.local"

# Verificar puertos
echo -e "\n🌐 Puertos:"
netstat -tulpn 2>/dev/null | grep -E "(3000|8000|6333)" || echo "Verificar manualmente"
```

### Recuperación de Desastres

#### Backup de Datos
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup Qdrant
docker exec qdrant tar czf - /qdrant/storage > $BACKUP_DIR/qdrant_data.tar.gz

# Backup configuración
cp backend/.env $BACKUP_DIR/
cp frontend/.env.local $BACKUP_DIR/
cp docker-compose.yml $BACKUP_DIR/

echo "✅ Backup creado en $BACKUP_DIR"
```

#### Restauración
```bash
#!/bin/bash
# restore.sh

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
    echo "Uso: ./restore.sh <directorio_backup>"
    exit 1
fi

# Parar servicios
docker-compose down

# Restaurar Qdrant
tar xzf $BACKUP_DIR/qdrant_data.tar.gz -C ./

# Restaurar configuración
cp $BACKUP_DIR/.env backend/
cp $BACKUP_DIR/.env.local frontend/

# Reiniciar servicios
docker-compose up -d

echo "✅ Restauración completada"
```

## 📈 Optimización de Rendimiento

### Configuración de Producción

#### Backend Optimizations
```python
# main_async.py - Configuración de producción
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main_async:app",
        host="0.0.0.0",
        port=8000,
        workers=4,  # Múltiples workers
        loop="uvloop",  # Loop optimizado
        http="httptools",  # Parser HTTP optimizado
        access_log=False,  # Deshabilitar logs de acceso
        log_level="warning"  # Solo logs importantes
    )
```

#### Frontend Optimizations
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  images: {
    formats: ['image/webp', 'image/avif']
  }
}

export default nextConfig
```

### Monitoreo de Performance
```bash
# Métricas de sistema
htop
iotop
nethogs

# Métricas de aplicación
curl http://localhost:8000/metrics
```

---

**Guía de Despliegue v1.0**  
*Última actualización: 2024*
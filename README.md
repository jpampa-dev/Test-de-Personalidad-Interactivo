# 🎭 Test de Personalidad Interactivo

Un test psicológico gamificado para descubrir tu personalidad desarrollado para hackathon. Los usuarios navegan a través de historias interactivas donde sus decisiones revelan patrones de personalidad únicos. El sistema utiliza IA multi-agente para crear narrativas dinámicas y generar análisis psicológicos profundos basados en las elecciones del usuario.

## ✨ Nuevas Características

### 🚀 Procesamiento Asíncrono
- **Análisis en Background**: El análisis psicológico final se ejecuta en segundo plano, eliminando tiempos de espera
- **API No Bloqueante**: Los usuarios pueden continuar interactuando mientras se procesa el análisis
- **Polling de Resultados**: Sistema de consulta para verificar el estado del análisis

### ⚡ Optimizaciones de Rendimiento
- **Modelo Mistral Optimizado**: Cambio a `mistral-small-latest` para respuestas 3-5x más rápidas
- **Límites de Tokens**: Control de tokens (1500 max) para respuestas más concisas
- **Iteraciones Reducidas**: Máximo 3 iteraciones por agente para mayor velocidad
- **Logging Silencioso**: Deshabilitación de logs verbosos para mejor rendimiento

### 🎮 Experiencia de Usuario Mejorada
- **Narrativas Dinámicas**: Historias que se adaptan a las decisiones del usuario
- **Análisis Psicológico Profundo**: Perfiles basados en tipologías Myers-Briggs
- **Interfaz Responsiva**: Sin bloqueos durante el procesamiento

### 🔧 Mejoras Técnicas
- **CORS Configurado**: Comunicación fluida entre frontend y backend
- **Base de Datos Local**: Qdrant ejecutándose en Docker para desarrollo
- **Arquitectura Dual**: Versiones síncrona y asíncrona de la API

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de microservicios con separación clara entre frontend y backend:

```
psychological-test-game/
├── frontend/          # Next.js + TypeScript + Tailwind CSS
├── backend/           # FastAPI + CrewAI + Python
├── compose.yml        # Docker Compose para servicios
└── README.md
```

### Componentes Principales

- **Frontend**: Interfaz de usuario interactiva construida con Next.js
- **Backend**: API REST con FastAPI que maneja la lógica del test y análisis de personalidad
- **Base de Datos Vectorial**: Qdrant para almacenamiento y recuperación de respuestas
- **IA Agents**: Sistema multi-agente con CrewAI para generación de preguntas y análisis psicológico

## 🚀 Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **Radix UI** - Componentes de UI accesibles
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **FastAPI** - Framework web moderno para Python
- **CrewAI** - Framework para sistemas multi-agente
- **Langchain** - Integración con modelos de lenguaje
- **Mistral AI** - Modelo de lenguaje para generación de contenido
- **Qdrant** - Base de datos vectorial
- **Python 3.13** - Lenguaje de programación
- **UV** - Gestor de dependencias rápido para Python

### Infraestructura
- **Docker Compose** - Orquestación de contenedores
- **Qdrant** - Base de datos vectorial en contenedor

## 📋 Prerrequisitos

- **Node.js** 18+ y npm/yarn
- **Python** 3.13+
- **UV** (gestor de dependencias Python)
- **Docker** y Docker Compose
- **Clave API de Mistral AI**

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd psychological-test-game
```

### 2. Configurar Backend

```bash
cd backend

# Instalar UV si no lo tienes
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar dependencias
uv sync

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
MISTRAL_API_KEY=tu_clave_api_mistral
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install
# o
yarn install
```

### 4. Levantar servicios de infraestructura

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará:
- **Qdrant** en `http://localhost:6333`

## 🚀 Ejecutar el Proyecto

### Opción 1: Desarrollo Local (Recomendado)

**Terminal 1 - Backend (Versión Asíncrona):**
```bash
cd backend
uv run uvicorn main_async:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# o
yarn dev
```

### Opción 2: Versión Síncrona (Para Testing)

**Terminal 1 - Backend (Versión Síncrona):**
```bash
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Opción 3: Con Scripts de Desarrollo

```bash
# Backend Asíncrono
cd backend && uv run python main_async.py

# Backend Síncrono
cd backend && uv run python main.py

# Frontend
cd frontend && npm run dev
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## 📡 API Endpoints

### Iniciar Juego
```http
POST /iniciar_juego
Content-Type: application/json

{
  "nombre": "string",
  "arquetipo_inicial": "string"
}
```

### Jugar Turno
```http
POST /jugar_turno
Content-Type: application/json

{
  "game_id": "string",
  "eleccion": "string"
}
```

### Finalizar Evaluación (Asíncrono)
```http
POST /finalizar_evaluacion
Content-Type: application/json

{
  "game_id": "string"
}
```

### Obtener Resultado (Polling)
```http
GET /obtener_resultado/{game_id}
```

**Respuestas de Estado:**
- `{"status": "processing"}` - Análisis en proceso
- `{"status": "completed", ...perfil}` - Análisis completado

## 🧩 Flujo del Juego

1. **Inicio**: El usuario ingresa su nombre y selecciona un arquetipo inicial
2. **Historia Interactiva**: Navegación a través de escenarios narrativos con decisiones significativas
3. **Decisiones Dinámicas**: Cada elección influye en la dirección de la historia
4. **Análisis Asíncrono**: Al finalizar, el sistema analiza todas las decisiones en segundo plano
5. **Perfil Personalizado**: Generación de un análisis psicológico completo basado en Myers-Briggs

## 🎯 Tipos de Análisis

### Dimensiones de Personalidad Evaluadas
- **Extraversión vs Introversión (E/I)**: Orientación de energía
- **Intuición vs Sensación (N/S)**: Procesamiento de información
- **Pensamiento vs Sentimiento (T/F)**: Toma de decisiones
- **Juicio vs Percepción (J/P)**: Estilo de vida

### Elementos del Perfil
- **Tipo de Personalidad**: Clasificación Myers-Briggs
- **Fortalezas Principales**: Características destacadas
- **Áreas de Crecimiento**: Oportunidades de desarrollo
- **Recomendaciones**: Sugerencias personalizadas

## 🤖 Sistema de Agentes Multi-IA

### Agentes Especializados
- **Guía Narrativo**: Crea y continúa historias interactivas adaptadas a las decisiones del usuario
- **Analista Psicológico**: Especialista en análisis de personalidad basado en patrones de decisión
- **Archivista de Recuerdos**: Gestiona el almacenamiento y recuperación de historiales de juego

### Características de los Agentes
- **Modelo Optimizado**: Mistral Small Latest para respuestas rápidas
- **Límites Controlados**: Máximo 3 iteraciones y 1500 tokens por respuesta
- **Especialización**: Cada agente tiene un rol específico y expertise definido
- **Colaboración**: Los agentes trabajan en secuencia para crear una experiencia cohesiva

## 🔧 Comandos Útiles

### Comandos UV (Backend)

```bash
# Instalar dependencias del proyecto
cd backend && uv sync

# Reinstalar dependencias
cd backend && uv sync --reinstall

# Agregar nueva dependencia
cd backend && uv add nombre-paquete

# Agregar dependencia de desarrollo
cd backend && uv add --dev nombre-paquete

# Mostrar dependencias instaladas
cd backend && uv pip list

# Ejecutar aplicación asíncrona con UV (Recomendado)
cd backend && uv run uvicorn main_async:app --reload --host 0.0.0.0 --port 8000

# Ejecutar aplicación síncrona con UV
cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ejecutar script principal asíncrono
cd backend && uv run python main_async.py

# Ejecutar script principal síncrono
cd backend && uv run python main.py
```

### Comandos Generales

```bash
# Limpiar y reinstalar dependencias del frontend
cd frontend && rm -rf node_modules package-lock.json && npm install

# Reiniciar servicios Docker
docker-compose down && docker-compose up -d

# Ver logs del backend
cd backend && uv run uvicorn main:app --reload --log-level debug

# Build de producción del frontend
cd frontend && npm run build

# Verificar tipos TypeScript
cd frontend && npm run type-check
```

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a Qdrant:**
```bash
# Verificar que el contenedor esté corriendo
docker ps | grep qdrant

# Reiniciar Qdrant
docker-compose restart qdrant

# Verificar logs de Qdrant
docker-compose logs qdrant
```

**Error de CORS:**
```bash
# Verificar que estés usando main_async.py para desarrollo
cd backend
uv run uvicorn main_async:app --reload --host 0.0.0.0 --port 8000
```

**Análisis lento o timeouts:**
```bash
# Usar la versión asíncrona para mejor rendimiento
# El análisis se ejecuta en background
curl -X POST "http://localhost:8000/finalizar_evaluacion" \
     -H "Content-Type: application/json" \
     -d '{"game_id": "tu-game-id"}'

# Consultar resultado
curl "http://localhost:8000/obtener_resultado/tu-game-id"
```

**Error de dependencias Python:**
```bash
cd backend
uv sync --reinstall
```

**Error de tipos TypeScript:**
```bash
cd frontend
npm run type-check
```

## 📝 Desarrollo

### Estructura del Código

#### Backend
- `backend/agents.py` - Definición de agentes de IA especializados
- `backend/tasks.py` - Tareas específicas para cada agente
- `backend/main.py` - API endpoints síncronos (versión original)
- `backend/main_async.py` - API endpoints asíncronos (versión optimizada)
- `backend/tools/qdrant_tools.py` - Herramientas para interacción con base de datos vectorial
- `backend/qdrant_setup.py` - Configuración de conexión a Qdrant

#### Frontend
- `frontend/components/` - Componentes React reutilizables
- `frontend/test/` - Lógica específica del juego de personalidad
- `frontend/hooks/` - Custom hooks para manejo de estado
- `frontend/types/` - Definiciones de tipos TypeScript

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📊 Métricas de Rendimiento

### Optimizaciones Implementadas
- **Reducción de Latencia**: 60-70% menos tiempo de respuesta
- **Modelo IA**: Cambio de `mistral-medium-latest` a `mistral-small-latest`
- **Procesamiento**: De síncrono a asíncrono para análisis final
- **Tokens**: Límite de 1500 tokens por respuesta
- **Iteraciones**: Máximo 3 iteraciones por agente

### Comparativa de Rendimiento
| Característica | Versión Original | Versión Optimizada |
|---|---|---|
| Tiempo de análisis | 30-45 segundos | 2-5 segundos + background |
| Modelo IA | mistral-medium-latest | mistral-small-latest |
| Procesamiento | Síncrono | Asíncrono |
| Experiencia de usuario | Bloqueo durante análisis | Sin bloqueos |
| Escalabilidad | Limitada | Mejorada |

## 🏗️ Arquitectura Técnica Detallada

### Flujo de Datos
```
Frontend → API Gateway → Agentes CrewAI → Qdrant DB
    ↓           ↓              ↓           ↓
  React    FastAPI      Mistral AI    Vector Store
```

### Patrones de Diseño Implementados
- **Background Tasks**: Para procesamiento no bloqueante
- **Polling Pattern**: Para consulta de resultados asíncronos
- **Agent Specialization**: Cada agente tiene responsabilidades específicas
- **Vector Storage**: Almacenamiento eficiente de historiales de juego

### Configuración de Producción
```env
# Configuración optimizada para producción
MISTRAL_API_KEY=tu_clave_api_mistral
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
MAX_TOKENS=1500
MAX_ITERATIONS=3
TEMPERATURE=0.7
```

## 📄 Licencia

Este proyecto está licenciado bajo la MIT License - ver el archivo [LICENSE](LICENSE) para más detalles.

**MIT License** permite:
- ✅ Uso comercial
- ✅ Modificación
- ✅ Distribución
- ✅ Uso privado

## 👥 Equipo

Desarrollado con ❤️ para la hackathon por el equipo de desarrollo.

---

**¡Descubre quién eres realmente a través de nuestro test de personalidad inteligente!** 🎭✨
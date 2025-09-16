# 🎭 Test de Personalidad Interactivo

Un test psicológico gamificado para descubrir tu personalidad desarrollado para hackathon. Los usuarios responden preguntas y situaciones interactivas mientras el sistema de IA analiza sus respuestas para revelar rasgos de personalidad únicos y generar un perfil personalizado completo.

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

### Opción 1: Desarrollo Local

**Terminal 1 - Backend:**
```bash
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# o
yarn dev
```

### Opción 2: Con Scripts de Desarrollo

```bash
# Backend
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

### Iniciar Test
```http
POST /iniciar_test
Content-Type: application/json

{
  "nombre": "string",
  "edad": "number"
}
```

### Responder Pregunta
```http
POST /responder_pregunta
Content-Type: application/json

{
  "test_id": "string",
  "respuesta": "string",
  "pregunta_id": "string"
}
```

### Obtener Resultado
```http
POST /obtener_resultado
Content-Type: application/json

{
  "test_id": "string"
}
```

## 🧩 Flujo del Test

1. **Registro**: El usuario ingresa información básica (nombre, edad)
2. **Preguntas Dinámicas**: El sistema genera preguntas personalizadas basadas en respuestas previas
3. **Análisis en Tiempo Real**: Los agentes de IA evalúan patrones de personalidad
4. **Resultado Personalizado**: Se genera un perfil completo con rasgos de personalidad, fortalezas y recomendaciones

## 🤖 Sistema de Agentes

- **Generador de Preguntas**: Crea preguntas dinámicas adaptadas al usuario
- **Analista de Personalidad**: Evalúa respuestas y identifica rasgos psicológicos
- **Gestor de Datos**: Almacena y recupera información del test y resultados

## 🔧 Comandos Útiles

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

- `backend/agents.py` - Definición de agentes de IA
- `backend/tasks.py` - Tareas para los agentes
- `backend/main.py` - API endpoints
- `frontend/components/` - Componentes React reutilizables
- `frontend/test/` - Lógica específica del test de personalidad

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

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
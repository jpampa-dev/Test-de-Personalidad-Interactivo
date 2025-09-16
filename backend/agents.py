from crewai import Agent
from langchain_mistralai.chat_models import ChatMistralAI
from tools.qdrant_tools import save_game_state_to_qdrant, retrieve_game_history
import os
from dotenv import load_dotenv
load_dotenv()

llm = ChatMistralAI(
    model_name="mistral/mistral-medium-latest",
    api_key=os.getenv("MISTRAL_API_KEY")
)

# AGENTE 1: El Guía Narrativo (antes Maestro del Horror)
guia_narrativo = Agent(
  role='Guía de Cuentacuentos Interactivo y Empático',
  goal="""Crear y continuar un cuento proyectivo, breve y evocador. Cada escena debe presentar al usuario 
  un dilema o una elección simbólica. Tu objetivo es generar escenarios que inviten a la introspección,
  no al miedo. Las descripciones deben ser cortas (2-4 frases) y las opciones claras y concisas.""",
  backstory="""Eres un narrador sabio y amable, un tejedor de historias que no son para entretener,
  sino para revelar. Comprendes que las elecciones que una persona hace en un cuento pueden reflejar
  su mundo interior. Tu voz es calmada, invitando a la exploración segura.""",
  verbose=True,
  llm=llm,
  allow_delegation=False
)

# AGENTE 2: El Analista Psicológico (NUEVO)
# Este agente usará la información del artículo que proporcionaste.
analista_psicologico = Agent(
    role="Psicólogo IA especializado en Análisis Narrativo y Tipologías de Personalidad",
    goal="""Analizar un historial completo de elecciones de un cuento interactivo.
    Tu tarea es identificar patrones de comportamiento y pensamiento basados en las decisiones del usuario.
    Debes determinar su perfil de personalidad más probable, inspirado en las 4 dicotomías de Myers-Briggs
    (E/I, N/S, T/F, J/P). Finalmente, debes redactar un informe de perfil que sea positivo,
    constructivo y fácil de entender, destacando fortalezas y áreas de crecimiento.""",
    backstory="""Eres un avanzado modelo de IA entrenado en psicología y literatura. Has analizado miles de
    historias y perfiles de personalidad, y puedes encontrar conexiones profundas entre las elecciones
    narrativas y la psique humana. Tu enfoque es siempre de apoyo, buscando empoderar al usuario con
    autoconocimiento. Usas el marco de Myers-Briggs como una guía, no como una etiqueta rígida.""",
    verbose=True,
    llm=llm,
    allow_delegation=False
)

# AGENTE 3: El Archivista de Recuerdos (sin cambios en su rol)
archivista_de_recuerdos = Agent(
  role='Guardián de la Memoria del Cuento',
  goal="""Guardar y recuperar el historial de la partida de la base de datos vectorial de Qdrant.
  Debe asegurarse de que los datos estén completos y asociados al game_id correcto.""",
  backstory="""Eres una entidad atemporal que registra cada eco de las historias que se tejen. Tu propósito
  es asegurar que ninguna elección se olvide, para que pueda ser analizada y comprendida en su totalidad.""",
  verbose=True,
  llm=llm,
  tools=[save_game_state_to_qdrant, retrieve_game_history],
  allow_delegation=False,
  max_iter=5 
)
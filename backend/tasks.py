from crewai import Task
from agents import guia_narrativo, analista_psicologico, archivista_de_recuerdos

# --- TAREAS PARA EL CICLO DE JUEGO ---

iniciar_historia_task = Task(
  ### CAMBIO: Ahora usa 'nombre' y 'arquetipo_inicial'
  description="""Crea la primera escena de un cuento interactivo para el usuario '{nombre}',
  quien ha elegido el arquetipo inicial de '{arquetipo_inicial}'.
  La escena debe ser una situación proyectiva inspirada en este arquetipo.
  Debe ser breve, calmada y simbólica.
  
  Genera 4 opciones donde cada una infiera una 'faceta' psicológica.
  Finalmente, genera una 'palabra_simbolica' en inglés que capture la esencia de la escena.""",
  expected_output="""Un string JSON con 'descripcion_escena', 'opciones' y 'palabra_simbolica'.
  
  EJEMPLO DE FORMATO EXACTO:
  {
    "descripcion_escena": "Como un Explorador, te encuentras ante un mapa antiguo...",
    "opciones": [
      { "accion": "Seguir la ruta más directa.", "faceta": "pragmatismo" },
      { "accion": "Explorar las zonas sin marcar del mapa.", "faceta": "curiosidad" }
    ],
    "palabra_simbolica": "uncharted-path"
  }
  """,
  agent=guia_narrativo
)

guardar_estado_inicial_task = Task(
  description="""Toma la escena inicial generada y el arquetipo inicial ('{arquetipo_inicial}'). 
  Combínalos en un solo JSON y usa la herramienta de guardado para almacenarlos con el game_id '{game_id}'.""",
  expected_output="Una confirmación de que el estado inicial ha sido guardado.",
  agent=archivista_de_recuerdos,
  context=[iniciar_historia_task]
)

recuperar_historia_task = Task(
    description="Usa la herramienta de recuperación para obtener TODO el historial de la partida con el ID '{game_id}'.",
    expected_output="Un string JSON que contiene una lista de todos los turnos anteriores de la partida.",
    agent=archivista_de_recuerdos,
    fail_on_error=True
)

continuar_historia_task = Task(
    description="""Basado en el historial de la partida y la última elección del jugador ('{eleccion_jugador}'),
    continúa el cuento de forma breve y coherente.
    Para cada una de las 4 nuevas opciones, debes inferir una 'faceta' psicológica.
    ### CAMBIO: Instrucción para la palabra simbólica.
    Finalmente, genera una 'palabra_simbolica': una palabra compuesta en inglés de dos partes,
    unidas por un guion, que capture la esencia de la nueva escena.""",

  ### CAMBIO CLAVE: Aplicamos la misma restricción de formato a la continuación.
  expected_output="""Un string JSON con 'descripcion_escena', 'opciones' y 'palabra_simbolica'.

  EJEMPLO DE FORMATO EXACTO:
  {
    "descripcion_escena": "Después de tu elección, el aire se vuelve más denso...",
    "opciones": [
      { "accion": "Seguir adelante.", "faceta": "determinación" },
      { "accion": "Reconsiderar tu decisión.", "faceta": "duda" }
    ],
    "palabra_simbolica": "deepening-shadow"
  }
  """,
  agent=guia_narrativo,
  context=[recuperar_historia_task]
)


guardar_nuevo_turno_task = Task(
    description="""Toma la elección del jugador ('{eleccion_jugador}') y la nueva escena generada.
    Combínalos en un solo JSON que represente el nuevo turno y usa la herramienta de guardado 
    para almacenarlos con el game_id '{game_id}'.""",
  expected_output="Una confirmación de que el nuevo turno ha sido guardado.",
  agent=archivista_de_recuerdos,
  context=[continuar_historia_task]
)

# --- TAREA PARA EL ANÁLISIS FINAL ---
# (Esta tarea no necesita cambios)
analizar_historia_completa_task = Task(
    description="""Analiza el historial completo de la conversación de la partida.
    El historial contiene todas las escenas que el usuario vio y las elecciones que hizo,
    incluyendo la 'faceta' psicológica de cada elección.
    Basándote en estos patrones, determina su tipo de personalidad de 4 letras (ej: INFJ, ESTP)
    según el modelo Myers-Briggs. Luego, genera un informe completo.""",
    expected_output="""Un string JSON con el perfil psicológico final.
    Debe tener las siguientes claves: 'tipo_personalidad', 'titulo',
    'descripcion', 'fortalezas', 'areas_de_crecimiento', y 'mensaje_final'.
    
    EJEMPLO DE FORMATO EXACTO:
    {
      "tipo_personalidad": "Después de tu elección, el aire se vuelve más denso...",
      "titulo": "Después de tu elección, el aire se vuelve más denso...",
      "opciones": [
        { "accion": "Seguir adelante.", "faceta": "determinación" },
        { "accion": "Reconsiderar tu decisión.", "faceta": "duda" }
      ],
      "palabra_simbolica": "deepening-shadow"
    }
    """,
    agent=analista_psicologico,
    context=[recuperar_historia_task]
)
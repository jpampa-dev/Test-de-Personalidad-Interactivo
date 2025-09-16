import uuid
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from crewai import Crew, Process
from tasks import (
    iniciar_historia_task, guardar_estado_inicial_task,
    recuperar_historia_task, continuar_historia_task, guardar_nuevo_turno_task,
    analizar_historia_completa_task
)
from agents import guia_narrativo, analista_psicologico, archivista_de_recuerdos
import json
from langchain_core.output_parsers import JsonOutputParser

app = FastAPI(
    title="API de Perfilado Psicológico Narrativo",
    description="Endpoints para una experiencia de autodescubrimiento interactiva."
)

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser = JsonOutputParser()

# --- Modelos de Datos ---
class PlayerInput(BaseModel):
    nombre: str
    arquetipo_inicial: str

class PlayerTurnInput(BaseModel):
    game_id: str
    eleccion: str

class FinalizeInput(BaseModel):
    game_id: str

# --- Crews ---
init_crew = Crew(
    agents=[guia_narrativo, archivista_de_recuerdos],
    tasks=[iniciar_historia_task, guardar_estado_inicial_task],
    process=Process.sequential,
    verbose=True
)

turn_crew = Crew(
    agents=[archivista_de_recuerdos, guia_narrativo, archivista_de_recuerdos],
    tasks=[recuperar_historia_task, continuar_historia_task, guardar_nuevo_turno_task],
    process=Process.sequential,
    verbose=True
)

analysis_crew = Crew(
    agents=[archivista_de_recuerdos, analista_psicologico],
    tasks=[recuperar_historia_task, analizar_historia_completa_task],
    process=Process.sequential,
    verbose=True
)

@app.post("/iniciar_juego")
def iniciar_juego(player_input: PlayerInput):
    game_id = str(uuid.uuid4())
    inputs = { 
        "nombre": player_input.nombre, 
        "arquetipo_inicial": player_input.arquetipo_inicial,
        "game_id": game_id 
    }
    init_crew.kickoff(inputs=inputs)
    
    try:
        escena_data = parser.parse(str(iniciar_historia_task.output))
        return {"game_id": game_id, **escena_data}
    except (json.JSONDecodeError, TypeError, IndexError):
        return {"error": "El LLM no devolvió un JSON válido.", "raw_output": str(iniciar_historia_task.output)}

@app.post("/jugar_turno")
def jugar_turno(turn_input: PlayerTurnInput):
    inputs = { "game_id": turn_input.game_id, "eleccion_jugador": turn_input.eleccion }
    turn_crew.kickoff(inputs=inputs)

    try:
        nueva_escena_data = parser.parse(str(continuar_historia_task.output))
        return {"game_id": turn_input.game_id, **nueva_escena_data}
    except (json.JSONDecodeError, TypeError, IndexError):
        return {"error": "El LLM no devolvió un JSON válido.", "raw_output": str(continuar_historia_task.output)}


@app.post("/finalizar_evaluacion")
def finalizar_evaluacion(final_input: FinalizeInput):
    inputs = { "game_id": final_input.game_id }
    resultado_final = analysis_crew.kickoff(inputs=inputs)
    
    try:
        perfil_data = parser.parse(str(resultado_final))
        return {"game_id": final_input.game_id, **perfil_data}
    except (json.JSONDecodeError, TypeError, IndexError):
        return {"error": "El LLM no devolvió un JSON válido para el perfil.", "raw_output": str(resultado_final)}
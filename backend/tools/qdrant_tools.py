import uuid
import json
import numpy as np
from crewai.tools import tool
from qdrant_client import models, QdrantClient

from qdrant_setup import client as qdrant_service, QDRANT_COLLECTION_NAME

@tool("Game History Storage Tool")
def save_game_state_to_qdrant(game_id: str, turn_data_json: str) -> str:
    """
    Guarda el estado de un turno específico del juego en Qdrant.
    - game_id: El ID único de la partida.
    - turn_data_json: Un string JSON con los datos del turno (perfil, escena, elección, etc.).
    """
    try:
        vector = np.random.rand(1024).tolist()
        point_id = str(uuid.uuid4())

        turn_data = json.loads(turn_data_json)
        # Añadimos el game_id al payload para poder filtrarlo después
        payload = {"game_id": game_id, "turn_data": turn_data}

        qdrant_service.upsert(
            collection_name=QDRANT_COLLECTION_NAME,
            points=[models.PointStruct(id=point_id, vector=vector, payload=payload)],
            wait=True
        )
        return f"Turno para la partida {game_id} guardado con éxito."
    except Exception as e:
        return f"Error al guardar en Qdrant: {e}"



@tool("Game History Retrieval Tool")
def retrieve_game_history(game_id: str) -> str:
    """
    Recupera el historial de turnos de una partida específica desde Qdrant.
    - game_id: El ID único de la partida que se quiere recuperar.
    """
    try:
        # Usamos 'scroll' para obtener todos los puntos que coincidan con el game_id
        search_result, _ = qdrant_service.scroll(
            collection_name=QDRANT_COLLECTION_NAME,
            scroll_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="game_id",
                        match=models.MatchValue(value=game_id),
                    )
                ]
            ),
            limit=10, # Obtenemos los últimos 10 turnos para dar contexto
            with_payload=True,
        )

        if not search_result:
            return f"No se encontró historial para la partida con ID: {game_id}"

        # Formateamos el historial para que sea legible para el LLM
        history = [point.payload["turn_data"] for point in search_result]
        return json.dumps(history)

    except Exception as e:
        return f"Error al recuperar el historial desde Qdrant: {e}"
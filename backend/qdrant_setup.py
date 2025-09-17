import qdrant_client
from qdrant_client.models import Distance, VectorParams
import os
from dotenv import load_dotenv

load_dotenv()

# Nombre de la colección en Qdrant
QDRANT_COLLECTION_NAME = "historial_juego_terror"

# --- CONFIGURACIÓN CORRECTA Y COMPLETA PARA QDRANT CLOUD ---
# Usamos el constructor que acepta la URL completa y la API Key.
client = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

# El resto de la lógica permanece igual, pero ahora la conexión será autenticada.
try:
    collection_info = client.get_collection(collection_name=QDRANT_COLLECTION_NAME)
    print(f"Colección '{QDRANT_COLLECTION_NAME}' en Qdrant Cloud ya existe.")

except Exception as e:
    # A menudo, un '404' o '401/403' es la forma en que la API dice "no encontrado" o "no autorizado".
    # Esto es esperado si la colección no existe, así que intentamos crearla.
    print(f"No se encontró la colección o hubo un error al verificarla: {e}")
    print(f"Intentando crear colección '{QDRANT_COLLECTION_NAME}' en Qdrant Cloud...")
    try:
        client.recreate_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
        )
        print("Colección creada con éxito en Qdrant Cloud.")
    except Exception as create_e:
        print(f"--- ERROR CRÍTICO ---")
        print(f"No se pudo crear la colección en Qdrant Cloud: {create_e}")
        print("Verifica tu QDRANT_URL y QDRANT_API_KEY en el archivo .env y que el cluster esté activo en https://cloud.qdrant.io/")
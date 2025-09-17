export interface GameState {
  currentScene: string
  playerName: string
  zodiacSign: string
  sanity: number
  choices: string[]
  gameStarted: boolean
  gameEnded: boolean
  endingType: string
}

export interface Scene {
  id: string
  title: string
  description: string
  choices: Choice[]
  sanityChange?: number
  isEnding?: boolean
  endingType?: string
}

export interface Choice {
  text: string
  nextScene: string
  sanityChange?: number
}

// Define la estructura de una opción individual
export interface Opcion {
  accion: string;
  faceta?: string; // El '?' lo hace opcional
}
// Actualiza la estructura principal
export interface GameData {
  game_id: string;
  descripcion_escena: string;
  opciones: Opcion[];
  palabra_simbolica: string;
  imagen: {
    urls: {
      small: string;
    };
  };
}

export interface ItemArea{
  nombre?: string;
  descripcion?: string;
  recomendacion?: string;
}

export interface ItemFortaleza{
  nombre?: string;
  descripcion?: string;
  ejemplo_narrativo?: string;
}

export interface ProfileData {
  tipo_personalidad: string;
  titulo: string;
  descripcion: string;
  fortalezas: ItemFortaleza[];
  areas_de_crecimiento: ItemArea[];
  mensaje_final: string;
}
"use client";

import { useState } from "react";
import { GameSetup } from "@/components/game/game-setup";
import { GameView } from "@/components/game/game-view";
// --- 1. IMPORTA LOS TIPOS DESDE EL ARCHIVO CENTRAL ---
import type { GameData } from "@/game/types";

export default function PsychologicalHorrorGamePage() {
  const [gameData, setGameData] = useState<GameData | null>(null);

  // Esta función se pasa a GameSetup y se llama cuando la API responde
  const handleGameReady = (data: GameData) => {
    setGameData(data);
  };

  // Si no tenemos datos del juego, mostramos el setup
  if (!gameData) {
    // 2. Necesitamos pasarle a GameSetup el tipo correcto que esperamos
    return <GameSetup onGameReady={handleGameReady} />;
  }

  // Si ya tenemos datos, mostramos la vista del juego
  return <GameView initialGameData={gameData} />;
}
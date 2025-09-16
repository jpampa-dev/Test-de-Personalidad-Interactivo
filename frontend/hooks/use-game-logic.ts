import { useState } from "react";
import { scenes } from "@/game/scenes";
import type { GameState, Choice } from "@/game/types";

const initialGameState: GameState = {
  currentScene: "start",
  playerName: "",
  zodiacSign: "",
  sanity: 100,
  choices: [],
  gameStarted: false,
  gameEnded: false,
  endingType: "",
};

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGame = (playerName: string, zodiacSign: string) => {
    setGameState((prev) => ({ ...prev, playerName, zodiacSign, gameStarted: true }));
  };

  const makeChoice = (choice: Choice) => {
    const nextScene = scenes[choice.nextScene];

    if (!nextScene) {
      console.error(`Error: La escena "${choice.nextScene}" no existe en src/game/scenes.ts. Revisa si hay errores de tipeo.`);
      // Opcional: podrías quedarte en la misma escena o mostrar un error en la UI.
      return; 
    }

    const newSanity = Math.max(0, gameState.sanity + (choice.sanityChange || 0));

    setGameState((prev) => ({
      ...prev,
      currentScene: choice.nextScene,
      sanity: newSanity,
      choices: [...prev.choices, choice.text],
      gameEnded: !!nextScene.isEnding,
      endingType: nextScene.endingType || "",
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return { gameState, startGame, makeChoice, resetGame };
}
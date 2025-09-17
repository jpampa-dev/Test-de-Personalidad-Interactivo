"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GameData, Opcion } from "@/game/types"
import { LoadingScreen } from "./loading-screen"
import type { ProfileData } from "@/game/types"

export interface GameViewProps {
  initialGameData: GameData;
}

const TOTAL_TURNS = process.env.NEXT_PUBLIC_TOTAL_TURNS ? parseInt(process.env.NEXT_PUBLIC_TOTAL_TURNS) : 1;

export function GameView({ initialGameData }: GameViewProps) {
  const [gameState, setGameState] = useState<GameData>(initialGameData);
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imagen, setImagen] = useState<string | undefined>(initialGameData?.imagen?.urls?.small);
  const [error, setError] = useState<string | null>(null);
  const [finalProfile, setFinalProfile] = useState<ProfileData | null>(null);

  const handleChoice = async (choiceText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jugar_turno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameState.game_id, eleccion: choiceText }),
      });

      if (!response.ok) throw new Error("La respuesta del servidor no fue satisfactoria.");

      const newGameData: GameData = await response.json();
      setGameState(newGameData);
      setTurnCount(prevCount => prevCount + 1);

      const responseImage = await fetch(`https://api.unsplash.com/photos/random?query=${newGameData.palabra_simbolica}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`);
      if (!responseImage.ok) throw new Error("La respuesta del servidor no fue satisfactoria.");

      const imageData = await responseImage.json();
      setImagen(imageData.urls.small);

    } catch (err) {
      console.error("Error al jugar el turno:", err);
      setError("No se pudo continuar la historia. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NUEVO: Función para finalizar y obtener el perfil ---
  const handleFinalize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finalizar_evaluacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameState.game_id }),
      });
      if (!response.ok) throw new Error("La respuesta del servidor no fue satisfactoria.");

      const profileData: ProfileData = await response.json();
      setFinalProfile(profileData);

    } catch (err) {
      console.error("Error al finalizar la evaluación:", err);
      setError("No se pudo generar tu perfil. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // --- NUEVO: Si tenemos un perfil final, lo mostramos ---
  if (finalProfile) {
    // Aquí renderizarías un nuevo componente `ProfileReport`
    return (
      <div className="min-h-screen bg-gradient-serene flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-[900px] rounded-[30px] border-border shadow-2xl anime-card">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl text-foreground font-bold text-balance anime-text tracking-wide mobile-text-base">
            Aqui está tu perfil de personalidad
          </CardTitle>
          {/* --- CAMBIO: Contenedor para los Badges --- */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="w-fit anime-text anime-border mobile-text-sm">
              Paso {turnCount + 1} de {TOTAL_TURNS + 1}
            </Badge>
            {/* --- CAMBIO: Muestra la palabra simbólica --- */}
            <Badge variant="secondary" className="w-fit anime-text anime-border mobile-text-sm uppercase">
              {finalProfile.tipo_personalidad}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="min-h-[150px] sm:min-h-[200px]">
            <p className="bg-green-100 mb-4 py-4 px-4 rounded-[10px] text-foreground leading-relaxed text-base text-pretty mobile-text-base">
              {finalProfile.descripcion}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-yellow-100 py-4 px-4 rounded-[10px]">
                <h2 className="text-base font-bold">Fortalezas</h2>
                <ul className="list-disc list-inside">
                  {finalProfile?.fortalezas && finalProfile.fortalezas.map((fortaleza, index) => (
                    <li key={index} className="text-foreground leading-relaxed text-base text-pretty mobile-text-base">
                      <b>{fortaleza.nombre}:</b> {fortaleza.descripcion} <br />
                      <i>{fortaleza.ejemplo_narrativo}</i>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-100 py-4 px-4 rounded-[10px]">
                <h2 className="text-base font-bold">Áreas de Crecimiento</h2>
                <ul className="list-disc list-inside">
                  {finalProfile?.areas_de_crecimiento && finalProfile.areas_de_crecimiento.map((area, index) => (
                    <li key={index} className="text-foreground leading-relaxed text-base text-pretty mobile-text-base">
                      <b>{area.nombre}:</b> {area.descripcion} <br />
                      <i>{area.recomendacion}</i>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-purple-100 py-4 px-4 rounded-[10px] text-foreground leading-relaxed text-base text-pretty mobile-text-base">
            <h2 className="text-base font-bold">Mensaje final</h2>
              <p>{finalProfile.mensaje_final}</p>
            </div>
          </div>

          {error && <p className="text-center text-destructive">{error}</p>}

          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-foreground anime-text tracking-wide mobile-text-base">
              ¿Qué decides hacer?
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {turnCount < TOTAL_TURNS ? (
                gameState.opciones.map((opcion, index) => (
                  <label
                    key={index}
                    onClick={() => handleChoice(opcion.accion)}
                    className="flex flex-col items-center justify-center gap-2 p-2 sm:p-3 cursor-pointer transition-all duration-300 zodiac-button anime-text mobile-text-sm"
                  >
                    <span className="text-pretty flex-1">{opcion.accion}</span>
                  </label>
                ))
              ) : (
                <div className="flex justify-center">
                <Button variant="secondary" onClick={()=> window.location.reload()} className="w-full opacity-100">
                  Nuevo test
                </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    );
  }

  // El estado normal del juego
  return (
    <div className="min-h-screen bg-gradient-serene flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-[1100px] rounded-[30px] border-border shadow-2xl anime-card">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-center text-xl sm:text-2xl text-foreground font-bold text-balance anime-text tracking-wide mobile-text-base">
            El Sendero de tu Mente
          </CardTitle>
          {/* Mostramos el progreso */}
          <div className="flex justify-center">
            <Badge variant="outline" className="w-fit anime-text anime-border mobile-text-sm">
              Paso {turnCount + 1} de {TOTAL_TURNS + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-5">
          <div className="w-full md:w-[600px] shrink-0  flex flex-col items-center gap-5 p-4 sm:p-6 min-h-[150px] sm:min-h-[200px] flex items-center">
            <img className="rounded-[10px] h-[300px] object-cover w-full" src={imagen} alt="Imagen de la escena" />
            <div className="text-foreground leading-relaxed text-base text-pretty anime-text mobile-text-base">
              {gameState.descripcion_escena}
            </div>
            {error && <p className="text-center text-destructive">{error}</p>}
          </div>


          <div className="md:w-full py-6">
            <h3 className=" text-lg mb-3 font-semibold text-foreground anime-text tracking-wide mobile-text-base">
              ¿Qué decides hacer?
            </h3>
            <div className="h-[1px] bg-gray-200 w-full mb-4"></div>
            <div className="grid gap-2 sm:gap-3">
              {/* --- LÓGICA CONDICIONAL PARA LOS BOTONES --- */}
              {turnCount < TOTAL_TURNS ? (
                gameState.opciones.map((opcion, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(opcion.accion)}
                    className="w-full text-left justify-start p-3 sm:p-4 h-auto"
                  >
                    <span className="flex gap-3">
                      <span className="rounded-[15px] mt-2 border border-black w-[15px] h-[15px]"></span>
                      <span className="text-pretty flex-1">{opcion.accion}</span>
                    </span>
                  </Button>
                ))
              ) : (
                <div className="flex justify-center">
                  <Button variant="secondary" onClick={handleFinalize} className="w-full opacity-100">
                    😊 Ver mi Perfil de personalidad
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
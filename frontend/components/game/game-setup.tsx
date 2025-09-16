"use client"

import type React from "react"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { arquetipos } from "@/game/constants"
import type { GameData } from "@/game/types"
import { LoadingScreen } from "./loading-screen"
import { Brain } from "lucide-react"

// Esquema de validación con Zod
const formSchema = z.object({
  nombre: z.string()
    .min(3, { message: "Mínimo 3 caracteres." })
    .max(10, { message: "Máximo 10 caracteres." })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, { message: "Solo letras, números y espacios entre palabras." }),
  arquetipo_inicial: z.string({ required_error: "Debes seleccionar un arquetipo." })
    .min(1, { message: "Debes seleccionar un arquetipo." }),
});

type FormValues = z.infer<typeof formSchema>;

interface GameSetupProps {
  onGameReady: (data: GameData) => void;
}

export function GameSetup({ onGameReady }: GameSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const arquetipoInput = watch("arquetipo_inicial");

  // Función que se ejecuta al enviar el formulario validado
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/iniciar_juego", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          arquetipo_inicial: data.arquetipo_inicial,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error del servidor: ${response.status} ${errorBody}`);
      }
      
      const gameData: GameData = await response.json();
      const responseImage = await fetch(`https://api.unsplash.com/photos/random?query=${gameData.palabra_simbolica}&client_id=dCtXDSTmDcdb78I1D3-c9fM5k22jhYU2Keea9rFkV-c`);
      if (!responseImage.ok) throw new Error("La respuesta del servidor no fue satisfactoria.");

      const imageData = await responseImage.json();

      const imageSmall = {
        urls: {
          small: imageData.urls.small,
        }
      };
      gameData.imagen = imageSmall;
      console.log("gameData", gameData);
      onGameReady(gameData);

    } catch (error) {
      console.error("Error al iniciar el juego:", error);
      setApiError("No se pudo conectar con la oscuridad. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  // Función para avanzar al siguiente paso, validando los campos del paso actual
  const handleNextStep = async (fieldsToValidate: (keyof FormValues)[], nextStep: number) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(nextStep);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-serene flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-[600px] bg-card rounded-2xl shadow-2xl anime-card">
        <CardHeader className="text-center p-4 sm:p-6">
            <div className="mb-5 mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2 sm:mb-4 anime-text tracking-wider">
              TEST PSICOLÓGICO: DESCUBRE TU VERDADERA PERSONALIDAD
            </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-4 sm:p-6">

            {currentStep === 1 && (
              <div className="flex flex-col gap-3 sm:gap-4 text-center">
                <h3 className="text-lg font-semibold text-foreground anime-text">Bienvenido, ¿Cuál es tu nombre?</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre..."
                    {...register("nombre")}
                    className="rounded-[10px] form-input w-full border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-3 text-base text-black/50 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    maxLength={10}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 anime-text">{errors.nombre.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2 justify-center mt-10">
                  <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                    Anterior
                  </Button>
                  <Button className="opacity-100" type="button" variant="secondary" onClick={() => handleNextStep(['nombre'], 2)} disabled={!touchedFields.nombre || !!errors.nombre}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-3 sm:gap-4 text-center">
                <h3 className="text-lg font-semibold text-foreground anime-text">Crea tu Protagonista</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                  {arquetipos.map((arq) => (
                    <label
                      key={arq.nombre}
                      className={`flex flex-col items-center justify-center gap-2 p-2 sm:p-3 cursor-pointer transition-all duration-300 zodiac-button anime-text mobile-text-sm ${arquetipoInput === arq.nombre ? "selected" : ""}`}
                    >
                      <span className="flex flex-col">
                        <input
                          type="radio"
                          value={arq.nombre}
                          {...register("arquetipo_inicial")}
                          className="sr-only"
                        />
                        <span className="text-base">{arq.emoji}</span>
                        <span className="font-medium text-base font-semibold">{arq.nombre}</span>
                      </span>
                      <span className="text-base text-thin">{arq.descripcion}</span>
                    </label>
                  ))}
                </div>
                {errors.arquetipo_inicial && <p className="text-xs text-red-500 anime-text">{errors.arquetipo_inicial.message}</p>}
                
                {apiError && <p className="text-sm text-destructive anime-text">{apiError}</p>}

                <div className="grid grid-cols-2 gap-2 justify-center mt-10">
                  <Button type="button" variant="secondary" onClick={() => setCurrentStep(2)}>
                    Anterior
                  </Button>
                  <Button type="submit" variant="secondary" className="opacity-100" disabled={!isValid}>
                    Comenzar la Aventura
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
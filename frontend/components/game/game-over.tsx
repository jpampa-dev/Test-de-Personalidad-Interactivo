"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GameState, Scene } from "@/game/types"
import { getSanityText } from "@/game/utils"

interface GameOverProps {
  gameState: GameState
  finalScene: Scene
  onReset: () => void
}

export function GameOver({ gameState, finalScene, onReset }: GameOverProps) {
  const getEndingMessage = (type: string) => {
    switch (type) {
      case "truth":
        return "Descubriste la verdad, pero a un precio terrible."
      case "madness":
        return "Tu mente no pudo soportar los horrores que presenciaste."
      case "coward":
        return "Huiste, pero algunos horrores te siguen para siempre."
      default:
        return "Tu historia ha llegado a su fin."
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl anime-card">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4 anime-text tracking-wider">
            FINAL: {finalScene.title}
          </CardTitle>
          <Badge variant="destructive" className="text-xs sm:text-sm anime-text anime-border mobile-text-sm">
            {getEndingMessage(gameState.endingType)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="bg-card/50 p-4 sm:p-6 anime-border">
            <p className="text-foreground leading-relaxed text-base sm:text-lg anime-text mobile-text-base">
              {finalScene.description}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground anime-text mobile-text-sm">Cordura Final:</span>
              <Badge
                variant={gameState.sanity > 50 ? "default" : "destructive"}
                className="anime-text anime-border mobile-text-sm"
              >
                {gameState.sanity}/100 - {getSanityText(gameState.sanity)}
              </Badge>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground anime-text mobile-text-sm">Decisiones tomadas:</span>
              <div className="bg-muted/20 p-3 rounded-lg max-h-32 overflow-y-auto border border-border anime-border">
                {gameState.choices.map((choice, index) => (
                  <p key={index} className="text-muted-foreground anime-text mobile-text-sm">
                    {index + 1}. {choice}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={onReset}
            className="w-full anime-button bg-primary hover:bg-primary/90 text-primary-foreground anime-text tracking-wide mobile-text-base"
          >
            JUGAR DE NUEVO
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
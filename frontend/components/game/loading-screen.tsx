import { Card, CardContent } from "@/components/ui/card"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-serene flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border rounded-[30px] shadow-2xl anime-card">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="text-6xl text-foreground">
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-foreground anime-text tracking-wider animate-pulse">Cargando...</p>
            <p className="text-base text-muted-foreground anime-text">Analizando tu respuesta...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
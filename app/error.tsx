"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Error boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Algo deu errado!</h2>
        <p className="text-gray-400 mb-8">Desculpe, encontramos um erro inesperado. Nossa equipe foi notificada.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} className="btn-primary">
            Tentar Novamente
          </Button>
          <Button onClick={() => (window.location.href = "/")} className="btn-secondary">
            Voltar para Home
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useServiceWorker } from "@/hooks/use-service-worker"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function UpdatePrompt() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker()

  if (!isUpdateAvailable) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
        <RefreshCw className="h-5 w-5" />
        <span className="font-medium">Nova versão disponível</span>
        <Button
          onClick={updateServiceWorker}
          className="bg-white text-green-600 hover:bg-white/90 font-semibold"
          size="sm"
        >
          Atualizar
        </Button>
      </div>
    </div>
  )
}

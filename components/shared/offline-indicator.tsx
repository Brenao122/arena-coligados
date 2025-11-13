"use client"

import { useServiceWorker } from "@/hooks/use-service-worker"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline } = useServiceWorker()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-bounce">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <WifiOff className="h-5 w-5" />
        <span className="font-medium">Sem conexão</span>
      </div>
    </div>
  )
}

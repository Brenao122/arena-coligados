"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error)
        })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Check if user has dismissed the prompt before
      const hasDismissed = localStorage.getItem("pwa-install-dismissed")
      if (!hasDismissed) {
        setShowInstallPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[PWA] User accepted the install prompt")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 border border-orange-400/50">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-white/20 rounded-xl p-3">
            <Download className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Instalar App</h3>
            <p className="text-sm text-white/90 mb-4">
              Instale o app da Arena Coligados para acesso rápido e experiência completa
            </p>

            <Button
              onClick={handleInstall}
              className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-lg"
            >
              Instalar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

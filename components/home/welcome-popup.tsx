"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verificar se o popup já foi mostrado nesta sessão
    const popupShown = sessionStorage.getItem("arena-popup-shown")

    if (!popupShown) {
      // Aguardar 2 segundos antes de mostrar o popup
      const timer = setTimeout(() => {
        setIsOpen(true)
        sessionStorage.setItem("arena-popup-shown", "true")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-orange-500/20 animate-in zoom-in duration-300">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Aula Experimental <span className="text-green-400">GRÁTIS!</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6">Venha conhecer nossas quadras e professores sem compromisso</p>
          </div>

          <Button
            onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Agendar Agora
          </Button>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Talvez mais tarde
          </button>
        </div>
      </div>
    </div>
  )
}

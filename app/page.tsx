"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, Users, Calendar, Trophy, Star } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleLoginClick = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Logo e Título */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
              alt="Arena Coligados Logo"
              width={120}
              height={120}
              className="rounded-full ring-4 ring-orange-500/50 shadow-2xl"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent">
              ARENA
            </span>
            <br />
            <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">COLIGADOS</span>
          </h1>

          <p className="text-2xl text-gray-200 mb-8 font-light">Sistema de Gestão Esportiva</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <Users className="h-10 w-10 text-orange-300 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">2</div>
            <div className="text-gray-200 text-sm">Unidades</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <Calendar className="h-10 w-10 text-green-300 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">7</div>
            <div className="text-gray-200 text-sm">Quadras</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <Trophy className="h-10 w-10 text-blue-300 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">4</div>
            <div className="text-gray-200 text-sm">Modalidades</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <Star className="h-10 w-10 text-yellow-300 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-gray-200 text-sm">Satisfação</div>
          </div>
        </div>

        {/* Botão de Login */}
        <div className="mb-8">
          <Button
            onClick={handleLoginClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 border-0"
          >
            <LogIn className="h-8 w-8 mr-4" />
            ACESSAR SISTEMA
          </Button>
        </div>

        {/* Redirecionamento automático */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-blue-300 text-lg font-medium mb-2">🚀 Redirecionamento automático em 3 segundos...</p>
          <p className="text-blue-200 text-sm">Ou clique no botão acima para acessar imediatamente</p>
        </div>

        {/* Informações de teste */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/30">
          <p className="text-gray-300 text-sm font-medium mb-3">Usuários de teste disponíveis:</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>👨‍💼 Admin: admin@arena.com / admin123</p>
            <p>👨‍🏫 Professor: professor@arena.com / prof123</p>
            <p>👤 Cliente: cliente@arena.com / cliente123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

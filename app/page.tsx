"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Users, Calendar, Trophy, Star, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simular login
    setTimeout(() => {
      if (email === "admin@arena.com" && password === "admin123") {
        localStorage.setItem(
          "arena-user",
          JSON.stringify({
            email: "admin@arena.com",
            name: "Administrador",
            role: "admin",
          }),
        )
        setSuccessMessage("Login realizado com sucesso! Redirecionando...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else if (email === "professor@arena.com" && password === "prof123") {
        localStorage.setItem(
          "arena-user",
          JSON.stringify({
            email: "professor@arena.com",
            name: "Professor",
            role: "professor",
          }),
        )
        setSuccessMessage("Login realizado com sucesso! Redirecionando...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else if (email === "cliente@arena.com" && password === "cliente123") {
        localStorage.setItem(
          "arena-user",
          JSON.stringify({
            email: "cliente@arena.com",
            name: "Cliente",
            role: "cliente",
          }),
        )
        setSuccessMessage("Login realizado com sucesso! Redirecionando...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else {
        setErrorMessage("Email ou senha incorretos!")
      }
      setLoading(false)
    }, 1000)
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
              alt="Arena Coligados Logo"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-orange-500/50 shadow-2xl mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-orange-400">Arena Coligados</h1>
            <p className="text-gray-300">Faça login para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                <p className="text-green-300 font-medium">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                <p className="text-red-300 font-medium">{errorMessage}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-200">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <button onClick={() => setShowLogin(false)} className="w-full mt-4 text-gray-400 hover:text-white text-sm">
            ← Voltar para página inicial
          </button>
        </div>
      </div>
    )
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
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 border-0"
          >
            <LogIn className="h-8 w-8 mr-4" />
            ACESSAR SISTEMA
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          <Button
            onClick={() => (window.location.href = "/aula-experimental")}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl px-8 py-6 rounded-xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <Calendar className="h-6 w-6 mr-3" />
            Agendar Aula Experimental
          </Button>

          <Button
            onClick={() => (window.location.href = "/reservar-quadra")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl px-8 py-6 rounded-xl shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <Trophy className="h-6 w-6 mr-3" />
            Reservar Quadra
          </Button>
        </div>

        {/* Status da Plataforma */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-green-300 text-lg font-medium mb-2">🟢 Plataforma Online e Funcionando</p>
          <p className="text-green-200 text-sm">Sistema pronto para deploy no Vercel</p>
        </div>

        {/* Informações de Deploy */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-blue-300 text-lg font-medium mb-2">🚀 Pronto para Deploy</p>
          <p className="text-blue-200 text-sm">
            Clique no botão "Publish" no canto superior direito para colocar online
          </p>
        </div>
      </div>
    </div>
  )
}

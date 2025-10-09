"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Users, Calendar, Trophy, Star, Eye, EyeOff, MapPin, Clock } from "lucide-react"
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
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
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
    <div className="min-h-screen relative text-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-beach-volleyball.jpg"
          alt="Beach Volleyball Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-gray-900/80 to-slate-800/85 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-12">
        {/* Logo e Título */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados Logo"
              width={120}
              height={120}
              className="rounded-full ring-4 ring-orange-500/50 shadow-2xl"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ARENA
            </span>
            <br />
            <span className="text-orange-400 drop-shadow-[0_0_30px_rgba(251,146,60,0.9)]">COLIGADOS</span>
          </h1>

          <p className="text-2xl text-gray-100 mb-4 font-light drop-shadow-lg">Gestão Esportiva Completa</p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Quadras de alta qualidade para Beach Tennis, Vôlei, Futevôlei e Tênis
          </p>
        </div>

        {/* Botões de Ação Principal */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          <Button
            onClick={() => (window.location.href = "/aula-experimental")}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl px-8 py-6 rounded-xl shadow-xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 border-0"
          >
            <Calendar className="h-6 w-6 mr-3" />
            Aula Experimental Grátis
          </Button>

          <Button
            onClick={() => (window.location.href = "/reservar-quadra")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl px-8 py-6 rounded-xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Trophy className="h-6 w-6 mr-3" />
            Reservar Quadra
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transition-all">
            <MapPin className="h-10 w-10 text-orange-300 mx-auto mb-3 drop-shadow-lg" />
            <div className="text-3xl font-bold text-white mb-1">2</div>
            <div className="text-gray-100 text-sm font-medium">Unidades</div>
            <div className="text-xs text-gray-200 mt-1">Parque Amazônia e Vila Rosa</div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transition-all">
            <Trophy className="h-10 w-10 text-green-300 mx-auto mb-3 drop-shadow-lg" />
            <div className="text-3xl font-bold text-white mb-1">9</div>
            <div className="text-gray-100 text-sm font-medium">Quadras</div>
            <div className="text-xs text-gray-200 mt-1">Equipadas e modernas</div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transition-all">
            <Users className="h-10 w-10 text-blue-300 mx-auto mb-3 drop-shadow-lg" />
            <div className="text-3xl font-bold text-white mb-1">4</div>
            <div className="text-gray-100 text-sm font-medium">Modalidades</div>
            <div className="text-xs text-gray-200 mt-1">Beach Tennis, Vôlei, Futevôlei e Tênis</div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transition-all">
            <Clock className="h-10 w-10 text-yellow-300 mx-auto mb-3 drop-shadow-lg" />
            <div className="text-3xl font-bold text-white mb-1">14h</div>
            <div className="text-gray-100 text-sm font-medium">Funcionamento</div>
            <div className="text-xs text-gray-200 mt-1">08:00 às 21:00</div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mb-12 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/40 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl font-bold text-orange-200 mb-6 drop-shadow-lg">
            Por que escolher a Arena Coligados?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <Star className="h-8 w-8 text-orange-300 mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-semibold text-white mb-2">Aula Experimental Gratuita</h3>
              <p className="text-gray-100 text-sm">Conheça nossas instalações e professores sem compromisso</p>
            </div>
            <div>
              <Trophy className="h-8 w-8 text-orange-300 mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-semibold text-white mb-2">Quadras Profissionais</h3>
              <p className="text-gray-100 text-sm">Equipamentos de alta qualidade e manutenção constante</p>
            </div>
            <div>
              <Calendar className="h-8 w-8 text-orange-300 mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-semibold text-white mb-2">Reserva Online Fácil</h3>
              <p className="text-gray-100 text-sm">Sistema prático de agendamento com pagamento via PIX</p>
            </div>
          </div>
        </div>

        {/* Botão de Login */}
        <div className="mb-8">
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 border-0"
          >
            <LogIn className="h-8 w-8 mr-4" />
            ACESSAR SISTEMA
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-xl border border-white/30 text-left shadow-xl">
            <h3 className="text-xl font-bold text-orange-300 mb-3">Unidade Parque Amazônia</h3>
            <p className="text-gray-100 text-sm mb-2">5 quadras disponíveis</p>
            <p className="text-2xl font-bold text-white">R$ 80,00/hora</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-xl border border-white/30 text-left shadow-xl">
            <h3 className="text-xl font-bold text-orange-300 mb-3">Unidade Vila Rosa</h3>
            <p className="text-gray-100 text-sm mb-2">4 quadras disponíveis</p>
            <p className="text-2xl font-bold text-white">R$ 70,00/hora</p>
          </div>
        </div>
      </div>
    </div>
  )
}

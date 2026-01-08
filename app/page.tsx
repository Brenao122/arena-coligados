"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Users, Calendar, Trophy, Star, Eye, EyeOff, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
        alert("Login realizado com sucesso! Redirecionando...")
        window.location.href = "/dashboard"
      } else if (email === "professor@arena.com" && password === "prof123") {
        localStorage.setItem(
          "arena-user",
          JSON.stringify({
            email: "professor@arena.com",
            name: "Professor",
            role: "professor",
          }),
        )
        alert("Login realizado com sucesso! Redirecionando...")
        window.location.href = "/dashboard"
      } else if (email === "cliente@arena.com" && password === "cliente123") {
        localStorage.setItem(
          "arena-user",
          JSON.stringify({
            email: "cliente@arena.com",
            name: "Cliente",
            role: "cliente",
          }),
        )
        alert("Login realizado com sucesso! Redirecionando...")
        window.location.href = "/dashboard"
      } else {
        alert("Credenciais inválidas!")
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
              src="/images/whatsapp-20image-202025-08-11-20at-2022.jpeg"
              alt="Arena Coligados Logo"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-orange-500/50 shadow-2xl mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-orange-400">Arena Coligados</h1>
            <p className="text-gray-300">Faça login para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="admin@arena.com"
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
                  placeholder="admin123"
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

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Usuários de teste:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Admin: admin@arena.com / admin123</p>
              <p>Professor: professor@arena.com / prof123</p>
              <p>Cliente: cliente@arena.com / cliente123</p>
            </div>
          </div>

          <button onClick={() => setShowLogin(false)} className="w-full mt-4 text-gray-400 hover:text-white text-sm">
            Voltar para página inicial
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
              src="/images/whatsapp-20image-202025-08-11-20at-2022.jpeg"
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

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/escolher-unidade">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 border-0">
              <MessageCircle className="h-7 w-7 mr-3" />
              Reserve Agora no WhatsApp
            </Button>
          </Link>

          <Button
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 border-0"
          >
            <LogIn className="h-7 w-7 mr-3" />
            Acessar Sistema
          </Button>
        </div>

        {/* Status da Plataforma */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-green-300 text-lg font-medium mb-2">Plataforma Online e Funcionando</p>
          <p className="text-green-200 text-sm">Sistema pronto para uso</p>
        </div>
      </div>
    </div>
  )
}

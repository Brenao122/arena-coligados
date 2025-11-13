"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Calendar, Trophy, Eye, EyeOff, MapPin, Clock, ExternalLink, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { WelcomePopup } from "@/components/home/welcome-popup"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"

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
    <>
      <Navbar />
      <WelcomePopup />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/background-beach-volleyball.jpg"
            alt="Arena Coligados"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-20">
          <div className="animate-float mb-8">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados"
              width={140}
              height={140}
              className="rounded-full ring-4 ring-orange-500/70 shadow-2xl mx-auto animate-glow"
            />
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
            <span className="text-gradient-hero drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]">ARENA</span>
            <br />
            <span className="text-gradient-primary text-6xl md:text-8xl drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
              COLIGADOS
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-3 font-bold drop-shadow-lg">
            Sua Segunda Casa no Esporte
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">Beach Tennis • Vôlei • Futevôlei • Tênis</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
              className="btn-secondary text-xl px-10 py-7 group"
            >
              <Calendar className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              Aula Grátis
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>

            <Button
              onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
              className="btn-primary text-xl px-10 py-7 group"
            >
              <Trophy className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              Alugue sua Quadra
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <Link
            href="/sobre-nos"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <span>Conheça Nossa História</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black/80 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gradient-primary mb-4">Viva a Experiência</h2>
            <p className="text-xl text-white/70">Momentos que viram memórias</p>
          </div>

          {/* Grid tipo Instagram */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="relative aspect-square group overflow-hidden rounded-xl hover:scale-105 transition-transform duration-500 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-green-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <Image
                  src={`/beach-sports-volleyball-tennis-court-.jpg?key=vhe4n&height=400&width=400&query=beach+sports+volleyball+tennis+court+${i}`}
                  alt={`Arena moment ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button className="btn-primary group">
              Ver Mais no Instagram
              <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats vibrantes */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card-premium p-8 text-center hover:bg-orange-500/20 group">
              <MapPin className="h-12 w-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-white mb-2">2</div>
              <div className="text-white/80 font-medium">Unidades</div>
            </div>

            <div className="card-premium p-8 text-center hover:bg-green-500/20 group">
              <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-white mb-2">9</div>
              <div className="text-white/80 font-medium">Quadras</div>
            </div>

            <div className="card-premium p-8 text-center hover:bg-blue-500/20 group">
              <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-white mb-2">4</div>
              <div className="text-white/80 font-medium">Modalidades</div>
            </div>

            <div className="card-premium p-8 text-center hover:bg-yellow-500/20 group">
              <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-white mb-2">14h</div>
              <div className="text-white/80 font-medium">Diárias</div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section className="bg-gradient-to-b from-slate-900 to-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gradient-primary mb-4">Planos</h2>
            <p className="text-xl text-white/70">Escolha sua unidade</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-premium p-10 hover:border-orange-500/70 group">
              <MapPin className="h-12 w-12 text-orange-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white mb-3">Parque Amazônia</h3>
              <p className="text-white/60 mb-6">5 quadras profissionais</p>
              <div className="text-5xl font-black text-gradient-primary mb-8">
                R$ 80<span className="text-2xl text-white/60">/hora</span>
              </div>
              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="w-full btn-primary"
              >
                Reservar Agora
              </Button>
            </div>

            <div className="card-premium p-10 hover:border-green-500/70 group">
              <MapPin className="h-12 w-12 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-black text-white mb-3">Vila Rosa</h3>
              <p className="text-white/60 mb-6">4 quadras equipadas</p>
              <div className="text-5xl font-black text-gradient-primary mb-8">
                R$ 70<span className="text-2xl text-white/60">/hora</span>
              </div>
              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="w-full btn-secondary"
              >
                Reservar Agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Pronto para Jogar?</h2>
          <p className="text-2xl text-white/90 mb-10">Faça sua aula experimental gratuita hoje</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
              className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-12 py-7 rounded-2xl shadow-2xl font-black"
            >
              Começar Agora
            </Button>
            <Button
              onClick={() => setShowLogin(true)}
              className="bg-black/30 backdrop-blur-md text-white hover:bg-black/50 text-xl px-12 py-7 rounded-2xl border-2 border-white/30"
            >
              <LogIn className="h-6 w-6 mr-3" />
              Login Sistema
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

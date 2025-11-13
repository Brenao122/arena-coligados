"use client"

import type React from "react"
import { useState, Suspense, lazy } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, MapPin, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import { WelcomePopup } from "@/components/home/welcome-popup"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

const InstagramFeed = lazy(() => import("@/components/home/instagram-feed"))

export default function HomePageClient() {
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
        {/* ... existing login form ... */}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <WelcomePopup />

      <main id="main-content">
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
          aria-label="Hero principal"
        >
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/background-beach-volleyball.jpg"
              alt=""
              fill
              className="object-cover brightness-50 scale-110"
              style={{ transform: "translateY(calc(var(--scroll) * 0.3))" }}
              priority
              quality={85}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-20">
            <div className="animate-fade-in-up mb-8" style={{ animationDelay: "0.1s" }}>
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Logo Arena Coligados"
                width={140}
                height={140}
                className="rounded-full ring-4 ring-orange-500/70 shadow-2xl mx-auto hover:scale-110 transition-transform duration-500 hover:ring-orange-400"
                priority
              />
            </div>

            <h1
              className="text-7xl md:text-9xl font-black mb-6 leading-none animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-gradient-hero drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]">ARENA</span>
              <br />
              <span className="text-gradient-primary text-6xl md:text-8xl drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                COLIGADOS
              </span>
            </h1>

            <p
              className="text-2xl md:text-3xl text-white/90 mb-3 font-bold drop-shadow-lg animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Sua Segunda Casa no Esporte
            </p>
            <p
              className="text-lg text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Beach Tennis • Vôlei • Futevôlei • Tênis
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
              role="group"
              aria-label="Ações principais"
            >
              <Button
                onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
                className="btn-secondary text-xl px-10 py-7 group hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-green-300"
                aria-label="Agendar aula experimental gratuita"
              >
                <Calendar className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                Aula Grátis
                <ExternalLink className="h-5 w-5 ml-2" aria-hidden="true" />
              </Button>

              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="btn-primary text-xl px-10 py-7 group hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-orange-300"
                aria-label="Alugar quadra esportiva"
              >
                <Trophy className="h-12 w-12 mr-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
                Alugue sua Quadra
                <ExternalLink className="h-5 w-5 ml-2" aria-hidden="true" />
              </Button>
            </div>

            <Link
              href="/sobre-nos"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-3 py-2"
              style={{ animationDelay: "0.6s" }}
            >
              <span>Conheça Nossa História</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-b from-black/80 to-slate-900 py-20" aria-labelledby="instagram-heading">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 id="instagram-heading" className="text-5xl md:text-6xl font-black text-gradient-primary mb-4">
                Viva a Experiência
              </h2>
              <p className="text-xl text-white/70">Momentos que viram memórias</p>
            </div>

            <Suspense fallback={<InstagramLoadingSkeleton />}>
              <InstagramFeed />
            </Suspense>
          </div>
        </section>

        <section className="bg-slate-900 py-20" aria-labelledby="stats-heading">
          <div className="max-w-6xl mx-auto px-6">
            <h2 id="stats-heading" className="sr-only">
              Estatísticas da Arena Coligados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" role="list">
              <ScrollReveal delay={0.1}>
                <div
                  className="card-premium p-8 text-center hover:bg-orange-500/20 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <MapPin
                    className="h-12 w-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div className="text-4xl font-black text-white mb-2" aria-label="2 unidades">
                    2
                  </div>
                  <div className="text-white/80 font-medium">Unidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div
                  className="card-premium p-8 text-center hover:bg-green-500/20 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <Trophy
                    className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div className="text-4xl font-black text-white mb-2" aria-label="9 quadras">
                    9
                  </div>
                  <div className="text-white/80 font-medium">Quadras</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div
                  className="card-premium p-8 text-center hover:bg-blue-500/20 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <Trophy
                    className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div className="text-4xl font-black text-white mb-2" aria-label="4 modalidades">
                    4
                  </div>
                  <div className="text-white/80 font-medium">Modalidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div
                  className="card-premium p-8 text-center hover:bg-yellow-500/20 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <Clock
                    className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <div className="text-4xl font-black text-white mb-2" aria-label="14 horas diárias">
                    14h
                  </div>
                  <div className="text-white/80 font-medium">Diárias</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-900 to-black py-20" aria-labelledby="pricing-heading">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 id="pricing-heading" className="text-5xl md:text-6xl font-black text-gradient-primary mb-4">
                Planos
              </h2>
              <p className="text-xl text-white/70">Escolha sua unidade</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" role="list">
              <ScrollReveal delay={0.1}>
                <article
                  className="card-premium p-10 hover:border-orange-500/70 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <MapPin
                    className="h-12 w-12 text-orange-400 mb-6 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <h3 className="text-3xl font-black text-white mb-3">Parque Amazônia</h3>
                  <p className="text-white/60 mb-6">5 quadras profissionais</p>
                  <div className="text-5xl font-black text-gradient-primary mb-8">
                    <span aria-label="80 reais por hora">R$ 80</span>
                    <span className="text-2xl text-white/60">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="w-full btn-primary hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-orange-300"
                    aria-label="Reservar quadra no Parque Amazônia"
                  >
                    Reservar Agora
                  </Button>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <article
                  className="card-premium p-10 hover:border-green-500/70 group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <MapPin
                    className="h-12 w-12 text-green-400 mb-6 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <h3 className="text-3xl font-black text-white mb-3">Vila Rosa</h3>
                  <p className="text-white/60 mb-6">4 quadras equipadas</p>
                  <div className="text-5xl font-black text-gradient-primary mb-8">
                    <span aria-label="70 reais por hora">R$ 70</span>
                    <span className="text-2xl text-white/60">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="w-full btn-secondary hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-green-300"
                    aria-label="Reservar quadra na Vila Rosa"
                  >
                    Reservar Agora
                  </Button>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function InstagramLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse" role="status" aria-label="Carregando feed do Instagram">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-xl w-full max-w-md h-64"></div>
      </div>
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded-xl w-full max-w-md aspect-square"></div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-2 w-2 bg-gray-700 rounded-full"></div>
        ))}
      </div>
      <span className="sr-only">Carregando posts do Instagram...</span>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, Suspense, lazy } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, MapPin, Clock, ExternalLink, Waves } from 'lucide-react'
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
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 hero-sand"
          aria-label="Hero principal"
        >
          {/* Yellow organic circle decorations */}
          <div className="circle-decoration w-96 h-96 -top-20 -left-20 animate-float-instagram" />
          <div className="circle-decoration w-64 h-64 -bottom-32 -right-32 animate-float-instagram" style={{ animationDelay: '2s' }} />
          
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/background-beach-volleyball.jpg"
              alt=""
              fill
              className="object-cover brightness-[0.35] scale-110 mix-blend-multiply"
              priority
              quality={85}
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center py-20">
            <div className="animate-fade-in-up mb-8" style={{ animationDelay: "0.1s" }}>
              <div className="inline-block p-2 bg-white rounded-full animate-pulse-glow">
                <Image
                  src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                  alt="Logo Arena Coligados"
                  width={140}
                  height={140}
                  className="rounded-full"
                  priority
                />
              </div>
            </div>

            <h1
              className="text-instagram-hero mb-6 animate-fade-in-up drop-shadow-[0_0_50px_rgba(255,107,71,0.8)]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-white via-[#FFD966] to-white bg-clip-text text-transparent">
                ARENA
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#FF6B47] to-[#FF8566] bg-clip-text text-transparent">
                COLIGADOS
              </span>
            </h1>

            <div
              className="inline-block bg-[#FFD966] text-gray-900 px-8 py-4 rounded-full mb-6 animate-fade-in-up shadow-2xl"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-2xl md:text-3xl font-black uppercase tracking-wider">
                Sua Segunda Casa no Esporte
              </p>
            </div>

            <p
              className="text-lg text-white/90 mb-12 font-bold uppercase tracking-widest animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Beach Tennis • Vôlei • Futevôlei • Tênis
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
              role="group"
              aria-label="Ações principais"
            >
              <Button
                onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
                className="btn-secondary text-xl group focus:ring-4 focus:ring-yellow-300"
                aria-label="Agendar aula experimental gratuita"
              >
                <Waves className="h-6 w-6 mr-3 group-hover:animate-bounce" aria-hidden="true" />
                Aula Grátis
              </Button>

              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="btn-primary text-xl group focus:ring-4 focus:ring-orange-300"
                aria-label="Alugar quadra esportiva"
              >
                <Trophy className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
                Alugue sua Quadra
              </Button>
            </div>

            <Link
              href="/sobre-nos"
              className="inline-flex items-center gap-2 text-white hover:text-[#FFD966] transition-colors group animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-3 py-2 font-bold uppercase tracking-wide"
              style={{ animationDelay: "0.6s" }}
            >
              <span>Conheça Nossa História</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="section-coral py-24 relative overflow-hidden" aria-labelledby="instagram-heading">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFD966] rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 id="instagram-heading" className="text-instagram-title text-white mb-4 drop-shadow-lg">
                VIVA A EXPERIÊNCIA
              </h2>
              <p className="text-instagram-subtitle text-white/90 tracking-wider">Momentos que viram memórias</p>
            </div>

            <Suspense fallback={<InstagramLoadingSkeleton />}>
              <InstagramFeed />
            </Suspense>
          </div>
        </section>

        <section className="bg-background py-24 relative" aria-labelledby="stats-heading">
          {/* Yellow decorative circle */}
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-[#FFD966]/20 rounded-full blur-3xl animate-float-instagram" />
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <h2 id="stats-heading" className="sr-only">
              Estatísticas da Arena Coligados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" role="list">
              <ScrollReveal delay={0.1}>
                <div
                  className="card-instagram p-10 text-center group relative overflow-hidden"
                  role="listitem"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MapPin
                    className="h-16 w-16 text-[#FF6B47] mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10"
                    aria-hidden="true"
                  />
                  <div className="text-6xl font-black text-foreground mb-2 relative z-10" aria-label="2 unidades">
                    2
                  </div>
                  <div className="text-muted-foreground font-bold uppercase tracking-wider text-sm relative z-10">Unidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div
                  className="card-instagram p-10 text-center group relative overflow-hidden"
                  role="listitem"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD966]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Trophy
                    className="h-16 w-16 text-[#FFD966] mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10"
                    aria-hidden="true"
                  />
                  <div className="text-6xl font-black text-foreground mb-2 relative z-10" aria-label="9 quadras">
                    9
                  </div>
                  <div className="text-muted-foreground font-bold uppercase tracking-wider text-sm relative z-10">Quadras</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div
                  className="card-instagram p-10 text-center group relative overflow-hidden"
                  role="listitem"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Trophy
                    className="h-16 w-16 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10"
                    aria-hidden="true"
                  />
                  <div className="text-6xl font-black text-foreground mb-2 relative z-10" aria-label="4 modalidades">
                    4
                  </div>
                  <div className="text-muted-foreground font-bold uppercase tracking-wider text-sm relative z-10">Modalidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div
                  className="card-instagram p-10 text-center group relative overflow-hidden"
                  role="listitem"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Clock
                    className="h-16 w-16 text-[#FF6B47] mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10"
                    aria-hidden="true"
                  />
                  <div className="text-6xl font-black text-foreground mb-2 relative z-10" aria-label="14 horas diárias">
                    14h
                  </div>
                  <div className="text-muted-foreground font-bold uppercase tracking-wider text-sm relative z-10">Diárias</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="bg-accent/30 py-24 relative overflow-hidden" aria-labelledby="pricing-heading">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD966]/20 rounded-full blur-3xl" />
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 id="pricing-heading" className="text-instagram-title text-foreground mb-4">
                PLANOS
              </h2>
              <p className="text-instagram-subtitle text-muted-foreground">Escolha sua unidade</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" role="list">
              <ScrollReveal delay={0.1}>
                <article
                  className="card-instagram group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <div className="section-coral relative">
                    {/* Yellow circle decoration */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD966] rounded-full opacity-40 blur-2xl" />
                    
                    <MapPin
                      className="h-16 w-16 text-white mb-6 relative z-10"
                      aria-hidden="true"
                    />
                    <h3 className="text-5xl font-black text-white mb-3 uppercase relative z-10">Parque Amazônia</h3>
                    <p className="text-white/90 mb-6 font-bold uppercase text-sm tracking-wider relative z-10">5 quadras profissionais</p>
                    <div className="mb-8 relative z-10">
                      <span className="text-7xl font-black text-white" aria-label="80 reais por hora">R$ 80</span>
                      <span className="text-3xl text-white/80 font-bold">/hora</span>
                    </div>
                    <Button
                      onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                      className="w-full btn-secondary hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-yellow-300 relative z-10"
                      aria-label="Reservar quadra no Parque Amazônia"
                    >
                      Reservar Agora
                    </Button>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <article
                  className="card-instagram group hover:scale-105 transition-all duration-300"
                  role="listitem"
                >
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-[2rem] p-12 relative">
                    {/* Yellow circle decoration */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FFD966] rounded-full opacity-40 blur-2xl" />
                    
                    <MapPin
                      className="h-16 w-16 text-white mb-6 relative z-10"
                      aria-hidden="true"
                    />
                    <h3 className="text-5xl font-black text-white mb-3 uppercase relative z-10">Vila Rosa</h3>
                    <p className="text-white/90 mb-6 font-bold uppercase text-sm tracking-wider relative z-10">4 quadras equipadas</p>
                    <div className="mb-8 relative z-10">
                      <span className="text-7xl font-black text-white" aria-label="70 reais por hora">R$ 70</span>
                      <span className="text-3xl text-white/80 font-bold">/hora</span>
                    </div>
                    <Button
                      onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                      className="w-full btn-secondary hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-yellow-300 relative z-10"
                      aria-label="Reservar quadra na Vila Rosa"
                    >
                      Reservar Agora
                    </Button>
                  </div>
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
        <div className="bg-white/20 rounded-3xl w-full max-w-md h-64"></div>
      </div>
      <div className="flex justify-center">
        <div className="bg-white/20 rounded-3xl w-full max-w-md aspect-square"></div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-3 w-3 bg-white/30 rounded-full"></div>
        ))}
      </div>
      <span className="sr-only">Carregando posts do Instagram...</span>
    </div>
  )
}

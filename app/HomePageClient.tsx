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
          className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 md:pt-32 overflow-hidden px-4 sm:px-6"
          aria-label="Hero principal"
        >
          <div className="decorative-circle decorative-circle-yellow w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 top-10 sm:top-20 -right-10 sm:-right-20"></div>
          <div className="decorative-circle decorative-circle-coral w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bottom-20 sm:bottom-40 -left-10 sm:-left-20"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto text-center py-16 sm:py-24 md:py-32">
            <div className="animate-bounce mb-8 sm:mb-12">
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Logo Arena Coligados"
                width={100}
                height={100}
                className="rounded-full mx-auto shadow-2xl shadow-[#FF6B47]/50 border-4 border-white sm:w-[120px] sm:h-[120px]"
                priority
                sizes="(max-width: 640px) 100px, 120px"
              />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 sm:mb-8 drop-shadow-2xl bg-gradient-to-r from-[#FF6B47] via-[#FFD966] to-[#FF6B47] bg-clip-text text-transparent animate-gradient">
              Arena<br />Coligados
            </h1>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#FF6B47] to-transparent"></div>
              <div className="h-2 w-2 rounded-full bg-[#FFD966]"></div>
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#FFD966] to-transparent"></div>
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-gray-700 mb-12 sm:mb-16 px-4">
              Beach Tennis • Vôlei • Futevôlei
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16 sm:mb-20 px-4">
              <Button
                onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
                className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
                aria-label="Agendar aula experimental"
              >
                Aula Experimental
              </Button>

              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
                aria-label="Reservar quadra"
              >
                Reservar Quadra
              </Button>
            </div>

            <Link
              href="/sobre-nos"
              className="inline-flex items-center gap-2 text-[#FF6B47] hover:text-[#FF5533] transition-colors font-bold text-xs sm:text-sm uppercase tracking-widest"
            >
              <span>Conheça Nossa História</span>
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="section-coral py-16 sm:py-20 md:py-24" aria-labelledby="instagram-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 id="instagram-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                Viva a Experiência
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium">Momentos que viram memórias</p>
            </div>

            <Suspense fallback={<InstagramLoadingSkeleton />}>
              <InstagramFeed />
            </Suspense>
          </div>
        </section>

        <section className="section-vibrant py-16 sm:py-20 md:py-24" aria-labelledby="stats-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 id="stats-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 sm:mb-6 text-gray-900">
                Em Números
              </h2>
              <div className="divider-luxury"></div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12" role="list">
              <ScrollReveal delay={0.1}>
                <div className="text-center" role="listitem">
                  <MapPin className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[#FF6B47] mx-auto mb-4 sm:mb-6" aria-hidden="true" />
                  <div className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-2 sm:mb-4" aria-label="2 unidades">02</div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-bold">Unidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-center" role="listitem">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[#FF6B47] mx-auto mb-4 sm:mb-6" aria-hidden="true" />
                  <div className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-2 sm:mb-4" aria-label="9 quadras">09</div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-bold">Quadras</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="text-center" role="listitem">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[#FF6B47] mx-auto mb-4 sm:mb-6" aria-hidden="true" />
                  <div className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-2 sm:mb-4" aria-label="4 modalidades">04</div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-bold">Modalidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="text-center" role="listitem">
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[#FF6B47] mx-auto mb-4 sm:mb-6" aria-hidden="true" />
                  <div className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-2 sm:mb-4" aria-label="14 horas">14h</div>
                  <div className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-bold">Diárias</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section-coral py-16 sm:py-20 md:py-24" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 id="pricing-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 sm:mb-6 text-white">
                Planos
              </h2>
              <p className="text-base sm:text-lg text-white/90 font-medium">Escolha sua unidade preferida</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8" role="list">
              <ScrollReveal delay={0.1}>
                <article className="card-luxury text-center p-8 sm:p-10 md:p-12" role="listitem">
                  <MapPin className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#FF6B47] mx-auto mb-6 sm:mb-8" aria-hidden="true" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wider">
                    Parque Amazônia
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 uppercase tracking-widest font-bold">5 Quadras</p>
                  <div className="mb-8 sm:mb-10">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-light text-[#FF6B47]">R$ 80</span>
                    <span className="text-xl sm:text-2xl text-gray-500 font-light">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="btn-primary w-full text-base sm:text-lg py-5 sm:py-6"
                  >
                    Reservar
                  </Button>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <article className="card-luxury text-center p-8 sm:p-10 md:p-12" role="listitem">
                  <MapPin className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#FF6B47] mx-auto mb-6 sm:mb-8" aria-hidden="true" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wider">
                    Vila Rosa
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 uppercase tracking-widest font-bold">4 Quadras</p>
                  <div className="mb-8 sm:mb-10">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-light text-[#FF6B47]">R$ 70</span>
                    <span className="text-xl sm:text-2xl text-gray-500 font-light">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="btn-primary w-full text-base sm:text-lg py-5 sm:py-6"
                  >
                    Reservar
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

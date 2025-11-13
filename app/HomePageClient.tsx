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
          className="relative min-h-screen flex items-center justify-center pt-28 bg-white"
          aria-label="Hero principal"
        >
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-24 md:py-32">
            <div className="animate-fade-in-luxury mb-8 md:mb-12">
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Logo Arena Coligados"
                width={100}
                height={100}
                className="rounded-full mx-auto shadow-sm md:w-[120px] md:h-[120px]"
                priority
                sizes="(max-width: 768px) 100px, 120px"
              />
            </div>

            <h1 className="text-luxury-hero mb-6 md:mb-8 animate-fade-in-luxury">
              Arena<br />Coligados
            </h1>

            <div className="divider-luxury mb-6 md:mb-8"></div>

            <p className="text-luxury-subtitle mb-12 md:mb-16 animate-fade-in-luxury">
              Beach Tennis • Vôlei • Futevôlei
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 md:mb-20 animate-fade-in-luxury px-4">
              <Button
                onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
                className="btn-primary w-full sm:w-auto"
                aria-label="Agendar aula experimental"
              >
                Aula Experimental
              </Button>

              <Button
                onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                className="btn-secondary w-full sm:w-auto"
                aria-label="Reservar quadra"
              >
                Reservar Quadra
              </Button>
            </div>

            <Link
              href="/sobre-nos"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B47] transition-colors text-xs sm:text-sm uppercase tracking-widest"
            >
              <span>Conheça Nossa História</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="section-accent" aria-labelledby="instagram-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-20">
              <div className="inline-block mb-4 md:mb-6">
                <span className="accent-dot mr-2 md:mr-3"></span>
                <span className="text-luxury-subtitle">Momentos</span>
                <span className="accent-dot ml-2 md:ml-3"></span>
              </div>
              
              <h2 id="instagram-heading" className="text-luxury-title mb-4 md:mb-6">
                Viva a Experiência
              </h2>
              
              <p className="text-luxury-body">Siga @arenacoligados no Instagram</p>
            </div>

            <Suspense fallback={<InstagramLoadingSkeleton />}>
              <InstagramFeed />
            </Suspense>
          </div>
        </section>

        <section className="section-minimal" aria-labelledby="stats-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-20">
              <h2 id="stats-heading" className="text-luxury-title mb-4 md:mb-6">
                Em Números
              </h2>
              <div className="divider-luxury"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" role="list">
              <ScrollReveal delay={0.1}>
                <div className="text-center" role="listitem">
                  <MapPin className="h-8 w-8 md:h-10 md:w-10 text-[#FF6B47] mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <div className="text-4xl md:text-6xl font-light text-gray-900 mb-2 md:mb-4" aria-label="2 unidades">02</div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-gray-500">Unidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-center" role="listitem">
                  <Trophy className="h-8 w-8 md:h-10 md:w-10 text-[#FF6B47] mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <div className="text-4xl md:text-6xl font-light text-gray-900 mb-2 md:mb-4" aria-label="9 quadras">09</div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-gray-500">Quadras</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="text-center" role="listitem">
                  <Trophy className="h-8 w-8 md:h-10 md:w-10 text-[#FF6B47] mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <div className="text-4xl md:text-6xl font-light text-gray-900 mb-2 md:mb-4" aria-label="4 modalidades">04</div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-gray-500">Modalidades</div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="text-center" role="listitem">
                  <Clock className="h-8 w-8 md:h-10 md:w-10 text-[#FF6B47] mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <div className="text-4xl md:text-6xl font-light text-gray-900 mb-2 md:mb-4" aria-label="14 horas">14h</div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-gray-500">Diárias</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section-accent" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-20">
              <h2 id="pricing-heading" className="text-luxury-title mb-4 md:mb-6">
                Planos
              </h2>
              <p className="text-luxury-body">Escolha sua unidade preferida</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8" role="list">
              <ScrollReveal delay={0.1}>
                <article className="card-luxury text-center" role="listitem">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-[#FF6B47] mx-auto mb-6 md:mb-8" aria-hidden="true" />
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 md:mb-3 uppercase tracking-wider">
                    Parque Amazônia
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 uppercase tracking-widest">5 Quadras</p>
                  <div className="mb-8 md:mb-10">
                    <span className="text-4xl md:text-6xl font-light text-[#FF6B47]">R$ 80</span>
                    <span className="text-lg md:text-xl text-gray-500 font-light">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="btn-primary w-full"
                  >
                    Reservar
                  </Button>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <article className="card-luxury text-center" role="listitem">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-[#FF6B47] mx-auto mb-6 md:mb-8" aria-hidden="true" />
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 md:mb-3 uppercase tracking-wider">
                    Vila Rosa
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 uppercase tracking-widest">4 Quadras</p>
                  <div className="mb-8 md:mb-10">
                    <span className="text-4xl md:text-6xl font-light text-[#FF6B47]">R$ 70</span>
                    <span className="text-lg md:text-xl text-gray-500 font-light">/hora</span>
                  </div>
                  <Button
                    onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                    className="btn-primary w-full"
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

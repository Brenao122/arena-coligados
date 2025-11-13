"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, MapPin, Clock, ExternalLink } from "lucide-react"
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
        {/* ... existing login form ... */}
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
            className="object-cover brightness-50 scale-110"
            style={{ transform: "translateY(calc(var(--scroll) * 0.3))" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-20">
          <div className="animate-fade-in-up mb-8" style={{ animationDelay: "0.1s" }}>
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados"
              width={140}
              height={140}
              className="rounded-full ring-4 ring-orange-500/70 shadow-2xl mx-auto hover:scale-110 transition-transform duration-500 hover:ring-orange-400"
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
          >
            <Button
              onClick={() => window.open("https://links.nextfit.bio/eFiVtHg", "_blank")}
              className="btn-secondary text-xl px-10 py-7 group hover:scale-105 transition-all duration-300"
            >
              <Calendar className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              Aula Grátis
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>

            <Button
              onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
              className="btn-primary text-xl px-10 py-7 group hover:scale-105 transition-all duration-300"
            >
              <Trophy className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
              Alugue sua Quadra
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <Link
            href="/sobre-nos"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
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

          <InstagramFeed />

          <div className="text-center mt-8">
            <Button
              onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
              className="btn-primary group hover:scale-105 transition-all duration-300"
            >
              Ver Mais no Instagram
              <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="card-premium p-8 text-center hover:bg-orange-500/20 group hover:scale-105 transition-all duration-300">
                <MapPin className="h-12 w-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-black text-white mb-2">2</div>
                <div className="text-white/80 font-medium">Unidades</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="card-premium p-8 text-center hover:bg-green-500/20 group hover:scale-105 transition-all duration-300">
                <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-black text-white mb-2">9</div>
                <div className="text-white/80 font-medium">Quadras</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="card-premium p-8 text-center hover:bg-blue-500/20 group hover:scale-105 transition-all duration-300">
                <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-black text-white mb-2">4</div>
                <div className="text-white/80 font-medium">Modalidades</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="card-premium p-8 text-center hover:bg-yellow-500/20 group hover:scale-105 transition-all duration-300">
                <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-black text-white mb-2">14h</div>
                <div className="text-white/80 font-medium">Diárias</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-900 to-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gradient-primary mb-4">Planos</h2>
            <p className="text-xl text-white/70">Escolha sua unidade</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="card-premium p-10 hover:border-orange-500/70 group hover:scale-105 transition-all duration-300">
                <MapPin className="h-12 w-12 text-orange-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-3">Parque Amazônia</h3>
                <p className="text-white/60 mb-6">5 quadras profissionais</p>
                <div className="text-5xl font-black text-gradient-primary mb-8">
                  R$ 80<span className="text-2xl text-white/60">/hora</span>
                </div>
                <Button
                  onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                  className="w-full btn-primary hover:scale-105 transition-all duration-300"
                >
                  Reservar Agora
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="card-premium p-10 hover:border-green-500/70 group hover:scale-105 transition-all duration-300">
                <MapPin className="h-12 w-12 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black text-white mb-3">Vila Rosa</h3>
                <p className="text-white/60 mb-6">4 quadras equipadas</p>
                <div className="text-5xl font-black text-gradient-primary mb-8">
                  R$ 70<span className="text-2xl text-white/60">/hora</span>
                </div>
                <Button
                  onClick={() => window.open("https://links.nextfit.bio/ZWfrQvD", "_blank")}
                  className="w-full btn-secondary hover:scale-105 transition-all duration-300"
                >
                  Reservar Agora
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      {children}
    </div>
  )
}

function InstagramFeed() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script")
    script.src = "https://www.instagram.com/embed.js"
    script.async = true
    script.onload = () => {
      setLoading(false)
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Instagram post embeds - replace with real URLs from @arenacoligados */}
      <div className="instagram-embed-wrapper">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/arenacoligados/"
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            margin: "1px",
            maxWidth: "100%",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        >
          <a href="https://www.instagram.com/arenacoligados/" target="_blank" rel="noopener noreferrer">
            Ver no Instagram
          </a>
        </blockquote>
      </div>

      {loading && (
        <>
          <div className="animate-pulse bg-gray-800 rounded-xl aspect-square"></div>
          <div className="animate-pulse bg-gray-800 rounded-xl aspect-square"></div>
          <div className="animate-pulse bg-gray-800 rounded-xl aspect-square hidden lg:block"></div>
        </>
      )}
    </div>
  )
}

// TypeScript declaration for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

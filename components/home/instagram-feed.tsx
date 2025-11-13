"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement("script")
      script.src = "https://www.instagram.com/embed.js"
      script.async = true
      script.defer = true
      script.onload = () => {
        setLoading(false)
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      }
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }, 1000) // Wait 1s before loading Instagram

    return () => clearTimeout(timer)
  }, [])

  const posts = [
    "https://www.instagram.com/p/DDxjqYRuJxQ/",
    "https://www.instagram.com/p/DDxjYwNOohZ/",
    "https://www.instagram.com/p/DDu-xFLOWCO/",
    "https://www.instagram.com/reel/DDnPCXzO71J/",
    "https://www.instagram.com/reel/DDkpkTQu5eV/",
    "https://www.instagram.com/p/DDiIK0_uMJQ/",
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Instagram Profile Header */}
      <div className="flex flex-col items-center mb-12">
        <a
          href="https://www.instagram.com/arenacoligados/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 p-1 flex items-center justify-center">
                <Image
                  src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                  alt="Arena Coligados"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            </div>
            <Instagram className="absolute -bottom-2 -right-2 w-8 h-8 text-pink-500 bg-slate-900 rounded-full p-1" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
              @arenacoligados
            </h3>
            <p className="text-white/60">4.277 seguidores • 248 posts</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {[
          {
            query: "beach tennis players playing at arena coligados sand court",
            alt: "Jogadores de beach tennis na Arena Coligados",
          },
          {
            query: "volleyball game at sand court arena coligados sunset",
            alt: "Jogo de vôlei ao pôr do sol",
          },
          {
            query: "footvolley players at beach arena evening lights",
            alt: "Partida de futevôlei à noite",
          },
          {
            query: "beach tennis tournament arena coligados crowds",
            alt: "Torneio de beach tennis",
          },
          {
            query: "group of friends playing volleyball sand court",
            alt: "Grupo de amigos jogando vôlei",
          },
          {
            query: "aerial view arena coligados beach sports courts",
            alt: "Vista aérea da Arena Coligados",
          },
        ].map((item, index) => (
          <a
            key={index}
            href="https://www.instagram.com/arenacoligados/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group overflow-hidden rounded-xl hover:scale-105 transition-all duration-300"
          >
            <Image
              src={`/.jpg?key=r6lac&height=400&width=400&query=${encodeURIComponent(item.query)}`}
              alt={item.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <Instagram className="w-6 h-6 text-white" />
            </div>
          </a>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-orange-500/90 hover:bg-orange-600 text-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 -ml-4"
          aria-label="Post anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-orange-500/90 hover:bg-orange-600 text-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 -mr-4"
          aria-label="Próximo post"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {posts.map((postUrl, index) => (
              <div key={index} className="min-w-full flex justify-center px-4">
                <div className="instagram-embed-wrapper max-w-md w-full">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={postUrl}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      margin: "0 auto",
                      maxWidth: "500px",
                      minWidth: "326px",
                      padding: 0,
                      width: "100%",
                    }}
                  >
                    <a href={postUrl} target="_blank" rel="noopener noreferrer">
                      Ver post no Instagram
                    </a>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Posts do Instagram">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-orange-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              role="tab"
              aria-label={`Post ${index + 1}`}
              aria-selected={index === currentIndex}
            />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Button
          onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
          className="btn-primary group hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
        >
          <Instagram className="h-5 w-5 mr-2" />
          Ver Mais no Instagram
          <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center" aria-live="polite" aria-busy="true">
          <div className="animate-pulse bg-gray-800 rounded-xl w-full max-w-md aspect-square"></div>
        </div>
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

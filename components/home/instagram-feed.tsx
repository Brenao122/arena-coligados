"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram, Play } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [embedsLoaded, setEmbedsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement("script")
      script.src = "https://www.instagram.com/embed.js"
      script.async = true
      script.defer = true
      script.onload = () => {
        setLoading(false)
        setEmbedsLoaded(true)
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
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (embedsLoaded && window.instgrm) {
      setTimeout(() => {
        window.instgrm.Embeds.process()
      }, 100)
    }
  }, [currentIndex, embedsLoaded])

  const posts = [
    {
      url: "https://www.instagram.com/p/DCsxWvdO0GD/",
      thumbnail: "/beach-tennis-tournament-arena-coligados-orange-bac.jpg",
      caption: "Torneio de Beach Tennis 2024",
      type: "image"
    },
    {
      url: "https://www.instagram.com/reel/DCqT8tDuwDW/",
      thumbnail: "/volleyball-game-at-sunset-arena-coligados-sand-cou.jpg",
      caption: "Vôlei ao Pôr do Sol",
      type: "reel"
    },
    {
      url: "https://www.instagram.com/p/DCn5JkaOYnx/",
      thumbnail: "/footvolley-match-night-lights-arena-coligados.jpg",
      caption: "Futevôlei à Noite",
      type: "image"
    },
    {
      url: "https://www.instagram.com/p/DClhM2BO8Kf/",
      thumbnail: "/group-friends-playing-beach-sports-arena-orange-ba.jpg",
      caption: "Momentos Inesquecíveis",
      type: "image"
    },
    {
      url: "https://www.instagram.com/reel/DCjDEpOu5lN/",
      thumbnail: "/aerial-view-beach-sports-arena-sand-courts.jpg",
      caption: "Vista Aérea da Arena",
      type: "reel"
    },
    {
      url: "https://www.instagram.com/p/DChqRsTOWMQ/",
      thumbnail: "/beach-tennis-players-action-shot-orange-uniform.jpg",
      caption: "Beach Tennis em Ação",
      type: "image"
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative flex flex-col items-center mb-12 md:mb-16">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-20 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl"></div>
        
        <a
          href="https://www.instagram.com/arenacoligados/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 md:gap-6 hover:scale-105 transition-all duration-300 relative z-10"
        >
          <div className="relative">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-slate-900 p-2 flex items-center justify-center">
                <Image
                  src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                  alt="Arena Coligados Logo"
                  width={140}
                  height={140}
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 112px, 140px"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <Instagram className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl md:text-3xl font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-wide">
              @arenacoligados
            </h3>
            <p className="text-white/70 text-sm md:text-lg font-medium mt-1">4.277 seguidores • 248 posts</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-12 md:mb-16 px-2 md:px-4">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group overflow-hidden rounded-2xl md:rounded-3xl hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6">
              {post.type === "reel" && (
                <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white animate-pulse" />
              )}
              <Instagram className="w-6 h-6 md:w-8 md:h-8 text-white" />
              <p className="text-white font-bold text-center text-xs md:text-sm uppercase tracking-wide">{post.caption}</p>
            </div>
            {post.type === "reel" && (
              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/70 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="relative mb-12 md:mb-16 px-2 md:px-4 lg:px-12">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-center mb-8 md:mb-12 text-white uppercase tracking-wide px-4">
          Confira Nossos Posts
        </h3>

        <button
          onClick={prevSlide}
          className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Post anterior"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Próximo post"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 md:p-8 shadow-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {posts.map((post, index) => (
              <div key={index} className="min-w-full flex justify-center px-2 md:px-0">
                <div className="instagram-embed-wrapper w-full max-w-[540px]">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-captioned
                    data-instgrm-permalink={post.url}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                      margin: "0 auto",
                      maxWidth: "540px",
                      minWidth: "280px",
                      padding: 0,
                      width: "100%",
                    }}
                  >
                    <div style={{ padding: "12px" }}>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#FFFFFF",
                          lineHeight: 0,
                          padding: "0 0",
                          textAlign: "center",
                          textDecoration: "none",
                          width: "100%",
                          display: "block",
                        }}
                      >
                        <div style={{ padding: "32px 0" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Instagram style={{ color: "#FF6B47", marginBottom: "12px" }} size={40} />
                            <p style={{ color: "#000", fontSize: "14px", fontWeight: "bold", margin: "6px 0" }}>
                              Ver no Instagram
                            </p>
                            <p style={{ color: "#666", fontSize: "12px", margin: "4px 0" }}>
                              {post.caption}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-10" role="tablist" aria-label="Posts do Instagram">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? "w-8 md:w-12 bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg" 
                  : "w-2 md:w-3 bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
              role="tab"
              aria-label={`Post ${index + 1}`}
              aria-selected={index === currentIndex}
            />
          ))}
        </div>
      </div>

      <div className="text-center px-4">
        <Button
          onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
          className="btn-primary group hover:scale-105 transition-all duration-300 text-base md:text-xl px-8 md:px-10 py-5 md:py-7 rounded-full shadow-2xl hover:shadow-orange-500/50 w-full sm:w-auto"
        >
          <Instagram className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
          Ver Mais no Instagram
          <ExternalLink className="h-5 w-5 md:h-6 md:w-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center" aria-live="polite" aria-busy="true">
          <div className="animate-pulse bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-md aspect-square shadow-2xl"></div>
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

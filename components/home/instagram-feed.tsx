"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

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
    <div className="max-w-4xl mx-auto">
      {/* Centered Instagram Profile Widget */}
      <div className="flex justify-center mb-8">
        <div className="instagram-embed-wrapper max-w-md w-full">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/arenacoligados/"
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: "12px",
              boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "0 auto",
              maxWidth: "500px",
              minWidth: "326px",
              padding: 0,
              width: "100%",
            }}
          >
            <a href="https://www.instagram.com/arenacoligados/" target="_blank" rel="noopener noreferrer">
              Ver perfil no Instagram
            </a>
          </blockquote>
        </div>
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
      <div className="text-center mt-12">
        <Button
          onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
          className="btn-primary group hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
        >
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

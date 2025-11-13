"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram, Play } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const posts = [
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/beach-tennis-tournament-arena-coligados-orange-bac.jpg",
      caption: "Torneio de Beach Tennis 2024",
      type: "image"
    },
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/volleyball-game-at-sunset-arena-coligados-sand-cou.jpg",
      caption: "Vôlei ao Pôr do Sol",
      type: "reel"
    },
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/footvolley-match-night-lights-arena-coligados.jpg",
      caption: "Futevôlei à Noite",
      type: "image"
    },
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/group-friends-playing-beach-sports-arena-orange-ba.jpg",
      caption: "Momentos Inesquecíveis",
      type: "image"
    },
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/aerial-view-beach-sports-arena-sand-courts.jpg",
      caption: "Vista Aérea da Arena",
      type: "reel"
    },
    {
      url: "https://www.instagram.com/arenacoligados/",
      thumbnail: "/beach-tennis-players-action-shot-orange-uniform.jpg",
      caption: "Beach Tennis em Ação",
      type: "image"
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative flex flex-col items-center mb-16 md:mb-24">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-400/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-16 -right-32 w-80 h-80 bg-orange-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <a
          href="https://www.instagram.com/arenacoligados/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-6 md:gap-8 hover:scale-105 transition-all duration-500 relative z-10"
        >
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1.5 shadow-2xl ring-4 ring-white/20 group-hover:ring-8 transition-all duration-500">
              <div className="w-full h-full rounded-full bg-slate-900 p-3 flex items-center justify-center">
                <Image
                  src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                  alt="Arena Coligados Logo"
                  width={180}
                  height={180}
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 128px, 180px"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-slate-900 group-hover:scale-110 transition-transform duration-300">
              <Instagram className="w-5 h-5 md:w-8 md:h-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all duration-500 uppercase tracking-wide drop-shadow-lg">
              @arenacoligados
            </h3>
            <p className="text-white/80 text-base md:text-xl font-semibold mt-2 md:mt-3">4.277 seguidores • 248 posts</p>
          </div>
        </a>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide px-4 drop-shadow-lg mb-4">
          Confira Nossos Posts
        </h3>
        <p className="text-white/70 text-base md:text-lg font-medium">Clique nas fotos para visitar nosso Instagram</p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-7 mb-12 md:mb-20 px-2 md:px-4">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group overflow-hidden rounded-3xl hover:scale-[1.05] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-orange-500/40 ring-2 ring-white/10 hover:ring-orange-500/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.caption}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-orange-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6">
              {post.type === "reel" && (
                <Play className="w-10 h-10 md:w-16 md:h-16 text-white fill-white animate-bounce drop-shadow-2xl" />
              )}
              <Instagram className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-2xl" />
              <p className="text-white font-bold text-center text-xs md:text-sm lg:text-base uppercase tracking-wider drop-shadow-lg">{post.caption}</p>
              <div className="mt-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-semibold">
                Ver no Instagram
              </div>
            </div>
            {post.type === "reel" && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/80 backdrop-blur-md rounded-full p-2 md:p-2.5 ring-2 ring-white/30">
                <Play className="w-3 h-3 md:w-5 md:h-5 text-white fill-white" />
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="text-center px-4">
        <Button
          onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
          className="btn-primary group hover:scale-110 transition-all duration-500 text-base md:text-xl px-10 md:px-14 py-6 md:py-8 rounded-full shadow-2xl hover:shadow-orange-500/60 w-full sm:w-auto ring-4 ring-orange-400/20 hover:ring-orange-400/40"
        >
          <Instagram className="h-6 w-6 md:h-7 md:w-7 mr-3" />
          Ver Mais no Instagram
          <ExternalLink className="h-6 w-6 md:h-7 md:w-7 ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  )
}

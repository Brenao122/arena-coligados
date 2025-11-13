"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram, Play } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
  const instagramPosts = [
    {
      image: "/beach-tennis-quadra-laranja-coligados-jogadores.jpg",
      type: "image",
      link: "https://www.instagram.com/arenacoligados/"
    },
    {
      image: "/beach-tennis-p-r-do-sol-quadra-jogadores.jpg",
      type: "video",
      link: "https://www.instagram.com/arenacoligados/"
    },
    {
      image: "/v-lei-arena-coligados-salto-jogador.jpg",
      type: "image",
      link: "https://www.instagram.com/arenacoligados/"
    },
    {
      image: "/beach-tennis-praia-areia-amigos.jpg",
      type: "image",
      link: "https://www.instagram.com/arenacoligados/"
    },
    {
      image: "/quadras-vista-a-rea-coligados-estrutura.jpg",
      type: "video",
      link: "https://www.instagram.com/arenacoligados/"
    },
    {
      image: "/beach-tennis-laranja-salto-comemora--o.jpg",
      type: "image",
      link: "https://www.instagram.com/arenacoligados/"
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
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1.5 shadow-2xl ring-4 ring-white/30 group-hover:ring-8 group-hover:ring-white/50 transition-all duration-500">
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
            <p className="text-white/90 text-base md:text-xl font-semibold mt-2 md:mt-3">4.277 seguidores • 248 posts</p>
          </div>
        </a>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide px-4 drop-shadow-lg mb-4">
          Confira Nossos Posts
        </h3>
        <p className="text-white/90 text-base md:text-lg font-bold">Clique nas fotos para visitar nosso Instagram</p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20 px-2 md:px-4" role="list">
        {instagramPosts.map((post, index) => (
          <a
            key={index}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-500 hover:scale-105 cursor-pointer"
            role="listitem"
          >
            <Image
              src={post.image || "/placeholder.svg"}
              alt={`Post ${index + 1} do Instagram Arena Coligados`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              {post.type === "video" && (
                <div className="absolute top-4 right-4">
                  <Play className="h-8 w-8 text-white drop-shadow-lg" fill="white" />
                </div>
              )}
              <div className="text-white text-center px-4">
                <Instagram className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2" />
                <p className="text-sm md:text-base font-bold">Ver no Instagram</p>
              </div>
            </div>
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

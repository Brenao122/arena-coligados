"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram, Play } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
  const instagramPosts = [
    {
      image: "/beach-tennis-quadra-laranja-coligados-jogadores.jpg",
      type: "image",
      link: "https://www.instagram.com/p/DDasrVvSz8H/"
    },
    {
      image: "/beach-tennis-p-r-do-sol-quadra-jogadores.jpg",
      type: "video",
      link: "https://www.instagram.com/reel/DDMLj59yTmk/"
    },
    {
      image: "/v-lei-arena-coligados-salto-jogador.jpg",
      type: "image",
      link: "https://www.instagram.com/p/DDIrOsPSz6d/"
    },
    {
      image: "/beach-tennis-praia-areia-amigos.jpg",
      type: "image",
      link: "https://www.instagram.com/p/DC9YbmXyd6Z/"
    },
    {
      image: "/quadras-vista-a-rea-coligados-estrutura.jpg",
      type: "video",
      link: "https://www.instagram.com/reel/DC3r1OByYlN/"
    },
    {
      image: "/beach-tennis-laranja-salto-comemora--o.jpg",
      type: "image",
      link: "https://www.instagram.com/p/DCw88HMyY95/"
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative flex flex-col items-center mb-16 md:mb-24">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-400/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-16 -right-32 w-80 h-80 bg-orange-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-4">
          {/* Arena Coligados */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 border-2 border-orange-500/30 shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-500">
            <a
              href="https://www.instagram.com/arenacoligados/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1.5 shadow-xl ring-4 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-white p-2 flex items-center justify-center">
                    <Image
                      src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                      alt="Arena Coligados Logo"
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 112px, 128px"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-orange-600 transition-all duration-300 uppercase tracking-wide">
                  Arena Coligados
                </h3>
                <p className="text-orange-600 text-lg md:text-xl font-bold mt-2">@arenacoligados</p>
                <p className="text-gray-700 text-sm md:text-base font-semibold mt-1">4.277 seguidores • 248 posts</p>
              </div>
              <Button className="btn-primary w-full group-hover:scale-105 transition-transform duration-300">
                <Instagram className="h-5 w-5 mr-2" />
                Seguir
              </Button>
            </a>
          </div>

          {/* Complexo Coligados */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 border-2 border-orange-500/30 shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-500">
            <a
              href="https://www.instagram.com/complexoarenacoligados/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1.5 shadow-xl ring-4 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-white p-2 flex items-center justify-center">
                    <Image
                      src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                      alt="Complexo Coligados Logo"
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 112px, 128px"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-orange-600 transition-all duration-300 uppercase tracking-wide">
                  Complexo Coligados
                </h3>
                <p className="text-orange-600 text-lg md:text-xl font-bold mt-2">@complexoarenacoligados</p>
                <p className="text-gray-700 text-sm md:text-base font-semibold mt-1">Em breve • Em breve</p>
              </div>
              <Button className="btn-primary w-full group-hover:scale-105 transition-transform duration-300">
                <Instagram className="h-5 w-5 mr-2" />
                Seguir
              </Button>
            </a>
          </div>
        </div>

        <div className="relative z-10 w-full text-center mt-8 md:mt-10 px-4">
          <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            Faça Parte da Família Coligados!
          </p>
        </div>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide px-4 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] mb-4">
          Confira Nossos Posts
        </h3>
        <p className="text-white text-base md:text-lg font-bold drop-shadow-lg">Clique nas fotos para visitar nosso Instagram</p>
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

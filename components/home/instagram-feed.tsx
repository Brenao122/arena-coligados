"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram } from 'lucide-react'
import Image from "next/image"

export default function InstagramFeed() {
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

      <div className="text-center px-4">
        <Button
          onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
          className="btn-primary group hover:scale-110 transition-all duration-500 text-base md:text-xl px-10 md:px-14 py-6 md:py-8 rounded-full shadow-2xl hover:shadow-orange-500/60 w-full sm:w-auto ring-4 ring-orange-400/20 hover:ring-orange-400/40"
        >
          <Instagram className="h-6 w-6 md:h-7 md:w-7 mr-3" />
          Ver Perfil no Instagram
          <ExternalLink className="h-6 w-6 md:h-7 md:w-7 ml-3 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  )
}

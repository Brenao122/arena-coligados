"use client"

import { Navbar } from "@/components/layout/navbar"
import { Instagram, Facebook, Youtube } from 'lucide-react'
import Image from "next/image"

export default function RedesSociaisPage() {
  const socialAccounts = [
    {
      name: "Arena Coligados",
      handle: "@arenacoligados",
      followers: "4.277 seguidores",
      posts: "248 posts",
      link: "https://www.instagram.com/arenacoligados/",
      image: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
    },
    {
      name: "Complexo Coligados",
      handle: "@complexoarenacoligados",
      followers: "Em breve",
      posts: "Em breve",
      link: "https://www.instagram.com/complexoarenacoligados/",
      image: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
    }
  ]

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="min-h-screen bg-sand pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#FF6B47] to-[#FFD966] rounded-full opacity-20 blur-[140px] animate-blob"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-br from-[#10b981] to-[#FFD966] rounded-full opacity-20 blur-[120px] animate-blob animation-delay-2000"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <header className="text-center mb-16 md:mb-24 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD966]/10 rounded-full blur-3xl -z-10" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground mb-6 bg-gradient-to-r from-[#FF6B47] via-[#FFD966] to-[#FF6B47] bg-clip-text text-transparent">
              Nossas Redes Sociais
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-bold uppercase tracking-wide">
              Siga-nos e fique por dentro de tudo!
            </p>
          </header>

          {/* Instagram Accounts */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              {socialAccounts.map((account, index) => (
                <a
                  key={index}
                  href={account.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-instagram group hover:scale-105 transition-all duration-500 cursor-pointer"
                >
                  <div className="p-10 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                    
                    <div className="relative z-10">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-600 p-1.5 mx-auto mb-6 shadow-2xl ring-4 ring-white/30 group-hover:ring-8 group-hover:ring-white/50 transition-all duration-500">
                        <div className="w-full h-full rounded-full bg-slate-900 p-2 flex items-center justify-center">
                          <Image
                            src={account.image || "/placeholder.svg"}
                            alt={account.name}
                            width={160}
                            height={160}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                          <Instagram className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 uppercase group-hover:text-[#FF6B47] transition-colors">
                        {account.name}
                      </h3>
                      <p className="text-xl md:text-2xl font-bold text-[#FF6B47] mb-4">
                        {account.handle}
                      </p>
                      <p className="text-base text-gray-700 font-semibold">
                        {account.followers} • {account.posts}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="section-coral-light text-center">
            <Instagram className="h-20 w-20 text-[#FF6B47] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase">
              Faça Parte da Família Coligados!
            </h2>
            <p className="text-lg text-gray-800 font-bold max-w-2xl mx-auto">
              Siga nossos perfis no Instagram para acompanhar eventos, torneios, dicas de treino e muito mais!
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

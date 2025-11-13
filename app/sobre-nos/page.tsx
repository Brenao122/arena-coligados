"use client"

import { Navbar } from "@/components/layout/navbar"
import { NossaHistoria } from "@/components/home/nossa-historia"
import { MapPin, Users, Trophy, Target, Heart, Eye } from 'lucide-react'
import Image from "next/image"

export default function SobreNosPage() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="min-h-screen bg-sand pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12 sm:mb-16 md:mb-20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#FFD966]/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF6B47] rounded-full blur-2xl opacity-40 animate-pulse-glow" />
                <Image
                  src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                  alt="Logo Arena Coligados"
                  width={120}
                  height={120}
                  className="rounded-full ring-4 sm:ring-8 ring-[#FF6B47] shadow-2xl relative z-10 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px]"
                  priority
                  sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground mb-4 sm:mb-6 bg-gradient-to-r from-[#FF6B47] via-[#FFD966] to-[#FF6B47] bg-clip-text text-transparent">
              Sobre Nós
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-[#FF6B47]">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-current" aria-hidden="true" />
              <p className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-black px-4">
                Mais que uma arena, somos família
              </p>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-current hidden sm:block" aria-hidden="true" />
            </div>
          </header>

          <div className="mb-16 sm:mb-20 md:mb-24">
            <NossaHistoria />
          </div>

          <section aria-labelledby="mvv-heading" className="mb-16 sm:mb-20 md:mb-24">
            <h2 id="mvv-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-center text-foreground mb-8 sm:mb-10 md:mb-12">
              MVV - Missão, Visão e Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8" role="list">
              <article
                className="card-instagram relative overflow-hidden group hover:scale-105 transition-all"
                role="listitem"
              >
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#FFD966] rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                  <Target className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-[#FF6B47] mb-4 sm:mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 uppercase relative z-10">Missão</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium relative z-10">
                    Proporcionar experiências esportivas de qualidade, promovendo saúde, lazer e conexões através do
                    esporte.
                  </p>
                </div>
              </article>

              <article
                className="card-instagram relative overflow-hidden group hover:scale-105 transition-all"
                role="listitem"
              >
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#FFD966] rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                  <Eye className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-600 mb-4 sm:mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 uppercase relative z-10">Visão</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium relative z-10">
                    Ser referência em gestão esportiva, expandindo nossa família para todo o Brasil.
                  </p>
                </div>
              </article>

              <article
                className="card-instagram relative overflow-hidden group hover:scale-105 transition-all"
                role="listitem"
              >
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#FFD966] rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                  <Heart className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-red-500 mb-4 sm:mb-6 relative z-10 fill-current" aria-hidden="true" />
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 uppercase relative z-10">Valores</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium relative z-10">
                    Amizade, respeito, excelência e compromisso com a comunidade esportiva.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="unidades-heading" className="mb-24">
            <h2 id="unidades-heading" className="text-instagram-title text-center text-foreground mb-12 uppercase">
              Nossas Unidades
            </h2>
            <div className="grid md:grid-cols-2 gap-8" role="list">
              <article
                className="card-instagram group hover:scale-105 transition-all cursor-pointer"
                role="listitem"
              >
                <div className="section-coral relative overflow-hidden h-full">
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform" />
                  <MapPin className="h-14 w-14 text-white mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-4xl font-black text-white mb-3 uppercase relative z-10">Parque Amazônia</h3>
                  <p className="text-white/90 mb-6 font-bold uppercase tracking-wide text-sm relative z-10">5 quadras profissionais de Beach Tennis, Vôlei e Futevôlei</p>
                  <address className="text-sm text-white/80 not-italic font-medium relative z-10">Parque Amazônia, Goiânia - GO</address>
                </div>
              </article>

              <article
                className="card-instagram group hover:scale-105 transition-all cursor-pointer"
                role="listitem"
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-[2rem] p-10 relative overflow-hidden h-full">
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform" />
                  <MapPin className="h-14 w-14 text-white mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-4xl font-black text-white mb-3 uppercase relative z-10">Vila Rosa</h3>
                  <p className="text-white/90 mb-6 font-bold uppercase tracking-wide text-sm relative z-10">4 quadras equipadas com infraestrutura completa</p>
                  <address className="text-sm text-white/80 not-italic font-medium relative z-10">Setor Vila Rosa, Goiânia - GO</address>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="team-heading" className="text-center">
            <div className="card-instagram p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFD966]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#FF6B47]/10 rounded-full blur-3xl" />
              
              <Users className="h-20 w-20 text-[#FF6B47] mx-auto mb-8 relative z-10" aria-hidden="true" />
              <h2 id="team-heading" className="text-instagram-title text-foreground mb-6 uppercase relative z-10">
                Nosso Time
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-bold relative z-10 uppercase tracking-wide">
                Uma equipe de 12 colaboradores dedicados e centenas de clientes que se tornaram verdadeiros amigos
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto" role="list">
                <article className="section-coral-light group hover:scale-105 transition-all relative z-10" role="listitem">
                  <Trophy className="h-12 w-12 text-[#FF6B47] mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-2xl font-black text-foreground mb-2 uppercase">Gustavo Oliveira</h3>
                  <p className="text-muted-foreground font-bold uppercase text-sm tracking-wider">Co-fundador & Diretor</p>
                </article>
                <article className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-3xl p-8 border-2 border-green-500/30 group hover:scale-105 transition-all relative z-10" role="listitem">
                  <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-2xl font-black text-foreground mb-2 uppercase">Rafael Henrique</h3>
                  <p className="text-muted-foreground font-bold uppercase text-sm tracking-wider">Co-fundador & Diretor</p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

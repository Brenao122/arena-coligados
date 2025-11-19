"use client"

import { Navbar } from "@/components/layout/navbar"
import { NossaHistoria } from "@/components/home/nossa-historia"
import { MapPin, Users, Trophy, Target, Heart, Eye, Zap, MessageCircle } from 'lucide-react'
import Image from "next/image"

export default function SobreNosPage() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="min-h-screen bg-sand pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[600px] z-0">
          <Image
            src="/images/sports/beach-tennis-sky.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F0E8]/50 to-[#F5F0E8]"></div>
        </div>

        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#FF6B47] to-[#FFD966] rounded-full opacity-20 blur-[140px] animate-blob"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-br from-[#10b981] to-[#FFD966] rounded-full opacity-20 blur-[120px] animate-blob animation-delay-2000"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
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
              <p className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-black px-4 text-gray-900">
                Mais que uma arena, somos família
              </p>
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-current hidden sm:block" aria-hidden="true" />
            </div>
          </header>

          <div id="historia" className="mb-16 sm:mb-20 md:mb-24 scroll-mt-32">
            <NossaHistoria />
          </div>

          <section id="mvv" aria-labelledby="mvv-heading" className="mb-16 sm:mb-20 md:mb-24 scroll-mt-32">
            <h2 id="mvv-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-center text-gray-900 mb-8 sm:mb-10 md:mb-12">
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
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 uppercase relative z-10">Missão</h3>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-bold relative z-10">
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
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 uppercase relative z-10">Visão</h3>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-bold relative z-10">
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
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 uppercase relative z-10">Valores</h3>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-bold relative z-10">
                    Amizade, respeito, excelência e compromisso com a comunidade esportiva.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="unidades-heading" className="mb-24">
            <h2 id="unidades-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-gray-900 mb-12 uppercase">
              Nossas Unidades
            </h2>
            <div className="grid md:grid-cols-2 gap-8" role="list">
              <article
                className="card-instagram group hover:scale-105 transition-all cursor-pointer relative overflow-hidden"
                role="listitem"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/sports/paddle-action.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-25 group-hover:opacity-30 transition-opacity"
                    quality={75}
                  />
                </div>
                <div className="bg-gradient-to-br from-[#FF6B47] to-[#ff8c6b] text-white rounded-[2rem] p-10 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform" />
                  <MapPin className="h-14 w-14 text-white mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-4xl font-black text-white mb-3 uppercase relative z-10">Parque Amazônia</h3>
                  <p className="text-white/90 mb-4 font-bold uppercase tracking-wide text-sm relative z-10">5 quadras profissionais | Beach Tennis, Vôlei e Futevôlei</p>
                  <address className="text-sm text-white/80 not-italic font-medium relative z-10 mb-6">Parque Amazônia, Goiânia - GO</address>
                  <button
                    onClick={() => window.open("https://api.whatsapp.com/message/CI3R2YERLZ3MG1?autoload=1&app_absent=0", "_blank")}
                    className="mt-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-black py-3 px-6 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 relative z-10 border-2 border-white/40"
                  >
                    <MessageCircle className="h-5 w-5" />
                    FALE CONOSCO
                  </button>
                </div>
              </article>

              <article
                className="card-instagram group hover:scale-105 transition-all cursor-pointer relative overflow-hidden"
                role="listitem"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/sports/close-racket.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-20 group-hover:opacity-25 transition-opacity"
                    quality={75}
                  />
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-[2rem] p-10 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-125 transition-transform" />
                  <MapPin className="h-14 w-14 text-white mb-6 relative z-10" aria-hidden="true" />
                  <h3 className="text-4xl font-black text-white mb-3 uppercase relative z-10">Vila Rosa</h3>
                  <p className="text-white/90 mb-4 font-bold uppercase tracking-wide text-sm relative z-10">4 quadras equipadas | Beach Tennis, Vôlei e Futevôlei</p>
                  <address className="text-sm text-white/80 not-italic font-medium relative z-10 mb-6">Setor Vila Rosa, Goiânia - GO</address>
                  <button
                    onClick={() => window.open("https://api.whatsapp.com/send/?phone=5562995797965&text&type=phone_number&app_absent=0", "_blank")}
                    className="mt-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-black py-3 px-6 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 relative z-10 border-2 border-white/40"
                  >
                    <MessageCircle className="h-5 w-5" />
                    FALE CONOSCO
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section id="time" aria-labelledby="team-heading" className="text-center scroll-mt-32">
            <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-[#FF6B47] via-[#ff8c6b] to-[#FFD966] border-4 border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-[url('/images/sports/paddle-flying.jpg')] bg-cover bg-center opacity-15 mix-blend-overlay" />
              
              <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFD966] rounded-full blur-3xl opacity-40 animate-pulse-glow" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl opacity-30 animate-pulse-glow" style={{ animationDelay: '1s' }} />
              
              <Users className="h-20 w-20 text-white mx-auto mb-8 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" aria-hidden="true" />
              
              <h2 id="team-heading" className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.5)' }}>
                Nosso Time
              </h2>
              
              <p className="text-xl text-white mb-12 max-w-3xl mx-auto font-black relative z-10 uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                Uma equipe de 12 colaboradores dedicados e centenas de clientes que se tornaram verdadeiros amigos
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto" role="list">
                <article className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-[#FF6B47] shadow-[0_0_30px_rgba(255,107,71,0.6)] group hover:scale-105 hover:shadow-[0_0_50px_rgba(255,107,71,0.9)] transition-all relative overflow-hidden" role="listitem">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="h-12 w-12 text-[#FF6B47] mx-auto mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(255,107,71,0.8)]" aria-hidden="true" />
                  <Trophy className="h-10 w-10 text-[#FFD966] mx-auto mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(255,217,102,0.8)]" aria-hidden="true" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase relative z-10 tracking-wider">Gustavo Oliveira</h3>
                  <p className="text-[#FF6B47] font-black uppercase text-sm tracking-widest relative z-10">Co-fundador & Diretor</p>
                </article>
                
                <article className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)] group hover:scale-105 hover:shadow-[0_0_50px_rgba(34,197,94,0.9)] transition-all relative overflow-hidden" role="listitem">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="h-12 w-12 text-green-500 mx-auto mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" aria-hidden="true" />
                  <Trophy className="h-10 w-10 text-[#FFD966] mx-auto mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(255,217,102,0.8)]" aria-hidden="true" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase relative z-10 tracking-wider">Rafael Henrique</h3>
                  <p className="text-green-500 font-black uppercase text-sm tracking-widest relative z-10">Sócio Investidor</p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

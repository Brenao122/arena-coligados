"use client"

import { Navbar } from "@/components/layout/navbar"
import { Download, ExternalLink, Palette, Users, TrendingUp, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MidiaKitClientPage() {
  const cores = [
    { nome: "Coral", hex: "#FF6B47", rgb: "255, 107, 71" },
    { nome: "Verde", hex: "#10b981", rgb: "16, 185, 129" },
    { nome: "Amarelo", hex: "#FFD966", rgb: "255, 217, 102" },
    { nome: "Areia", hex: "#F5D5AE", rgb: "245, 213, 174" },
  ]

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-32 pb-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#FF6B47] to-[#FFD966] rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-br from-[#10b981] to-[#FFD966] rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#FFD966] to-[#FF6B47] rounded-full opacity-10 blur-3xl animate-blob animation-delay-4000"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <header className="text-center mb-16 sm:mb-24 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white rounded-full shadow-lg">
              <div className="w-2 h-2 bg-[#FF6B47] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-700">Recursos para Imprensa</span>
              <div className="w-2 h-2 bg-[#FF6B47] rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B47] via-[#FFD966] to-[#10b981] leading-tight">
              Mídia Kit
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 sm:mb-16 leading-relaxed px-4">
              Materiais oficiais da Arena Coligados disponíveis para parceiros, imprensa e colaboradores
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                    "_blank",
                  )
                }
                className="group relative px-8 py-6 bg-gradient-to-r from-[#FF6B47] to-[#ff8566] text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2rem] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                aria-label="Baixar mídia kit completo"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8566] to-[#FF6B47] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Mídia Kit Completo
                </span>
              </Button>
              <Button
                onClick={() => window.open("https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing", "_blank")}
                className="group px-8 py-6 bg-white text-[#FF6B47] font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2rem] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-[#FF6B47]"
                aria-label="Ver apresentação institucional"
              >
                <span className="flex items-center justify-center gap-3">
                  Apresentação Institucional
                  <ExternalLink className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" aria-hidden="true" />
                </span>
              </Button>
            </div>
          </header>

          <section aria-labelledby="logo-heading" className="mb-16 sm:mb-24">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <Palette className="h-6 w-6 text-[#FF6B47]" />
                <h2 id="logo-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-gray-900">
                  Identidade Visual
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600">Versões aprovadas do logotipo</p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8" role="list">
              <figure className="group relative bg-white p-8 sm:p-10 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105" role="listitem">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47]/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative mb-6 sm:mb-8 flex items-center justify-center min-h-[180px] sm:min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo principal da Arena Coligados"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:rotate-6"
                  />
                </div>
                <figcaption className="relative text-sm font-bold uppercase tracking-widest text-gray-700 text-center">
                  Logo Principal
                </figcaption>
              </figure>
              
              <figure className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-10 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105" role="listitem">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47]/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative mb-6 sm:mb-8 flex items-center justify-center min-h-[180px] sm:min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo para fundo escuro"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:rotate-6"
                  />
                </div>
                <figcaption className="relative text-sm font-bold uppercase tracking-widest text-white text-center">
                  Versão Fundo Escuro
                </figcaption>
              </figure>
              
              <figure className="group relative bg-gradient-to-br from-orange-100 to-yellow-100 p-8 sm:p-10 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:col-span-2 md:col-span-1" role="listitem">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD966]/30 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative mb-6 sm:mb-8 flex items-center justify-center min-h-[180px] sm:min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo para fundo claro"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:rotate-6"
                  />
                </div>
                <figcaption className="relative text-sm font-bold uppercase tracking-widest text-gray-800 text-center">
                  Versão Fundo Claro
                </figcaption>
              </figure>
            </div>
          </section>

          <section aria-labelledby="colors-heading" className="mb-16 sm:mb-24">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-[#FF6B47] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#FFD966] rounded-full"></div>
                </div>
                <h2 id="colors-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-gray-900">
                  Paleta de Cores
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600">Cores oficiais da marca Arena Coligados</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" role="list">
              {cores.map((cor) => (
                <article key={cor.hex} className="group" role="listitem">
                  <div
                    className="relative w-full aspect-square rounded-[2rem] mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105"
                    style={{ backgroundColor: cor.hex }}
                    role="img"
                    aria-label={`Cor ${cor.nome}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Palette className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    {cor.nome}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-mono mb-1">
                    {cor.hex}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    RGB {cor.rgb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="stats-heading" className="mb-16 sm:mb-24">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-[#FF6B47]" />
                <h2 id="stats-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-gray-900">
                  Em Números
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600">A Arena Coligados em dados</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8" role="list">
              <article className="group bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center" role="listitem">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF6B47] to-[#ff8566] rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B47] to-[#ff8566] mb-3" aria-label="2 unidades">
                  02
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-600">Unidades</p>
              </article>
              
              <article className="group bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center" role="listitem">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-[#10b981] to-[#34d399] rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#34d399] mb-3" aria-label="9 quadras">
                  09
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-600">Quadras</p>
              </article>
              
              <article className="group bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center" role="listitem">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-[#FFD966] to-[#ffd24d] rounded-full flex items-center justify-center">
                  <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD966] to-[#ffd24d] mb-3" aria-label="3 modalidades">
                  03
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-600">Modalidades</p>
              </article>
              
              <article className="group bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center" role="listitem">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-br from-[#FF6B47] to-[#FFD966] rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B47] to-[#FFD966] mb-3" aria-label="12 colaboradores">
                  12
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-600">Colaboradores</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="contact-heading" className="relative bg-gradient-to-br from-[#FF6B47] to-[#ff8566] p-8 sm:p-16 rounded-[2rem] shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFD966] to-transparent rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-[#10b981] to-transparent rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-black uppercase mb-4 sm:mb-6 text-white">
                Vamos Juntos?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Entre em contato para propostas de parceria e colaboração com a Arena Coligados
              </p>
              <Button
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                    "_blank",
                  )
                }
                className="group px-8 py-6 bg-white text-[#FF6B47] font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2rem] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                aria-label="Acessar materiais completos"
              >
                <span className="flex items-center justify-center gap-3">
                  Acessar Materiais Completos
                  <ExternalLink className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" aria-hidden="true" />
                </span>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

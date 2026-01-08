"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function EscolherUnidadePage() {
  const unidades = [
    {
      nome: "Parque Amazônia",
      endereco: "Parque Amazônia, Goiânia - GO",
      quadras: "5 Quadras Profissionais",
      preco: "R$ 80/hora",
      horario: "06:00 às 22:00",
      whatsapp: "556282935151", // número real da unidade Parque Amazônia
      mensagem: "Olá! Gostaria de reservar uma quadra no Parque Amazônia",
      imagem: "/images/sports/volleyball-action.jpg",
    },
    {
      nome: "Vila Rosa",
      endereco: "Vila Rosa, Goiânia - GO",
      quadras: "4 Quadras Profissionais",
      preco: "R$ 70/hora",
      horario: "06:00 às 22:00",
      whatsapp: "556295797965", // número real da unidade Vila Rosa
      mensagem: "Olá! Gostaria de reservar uma quadra no Vila Rosa",
      imagem: "/images/sports/multi-sports.jpg",
    },
  ]

  const handleWhatsApp = (whatsapp: string, mensagem: string) => {
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <header className="relative pt-8 pb-16 px-4 sm:px-6 text-center">
        <Link href="/" className="inline-block mb-8 hover:scale-110 transition-transform">
          <Image
            src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
            alt="Arena Coligados"
            width={80}
            height={80}
            className="rounded-full shadow-2xl shadow-[#FF6B47]/70 border-4 border-white/90 mx-auto"
          />
        </Link>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-[#FF6B47] via-[#FFD966] to-[#FF6B47] bg-clip-text text-transparent">
          Escolha sua Unidade
        </h1>

        <p className="text-lg sm:text-xl text-white/80 font-medium">Selecione a unidade mais próxima de você</p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FF6B47] to-transparent"></div>
          <div className="h-2 w-2 rounded-full bg-[#FFD966] animate-pulse"></div>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FFD966] to-transparent"></div>
        </div>
      </header>

      {/* Unidades Cards */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-6">
          {unidades.map((unidade, index) => (
            <article
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-[#FF6B47]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#FF6B47]/20"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={unidade.imagem || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover opacity-10 group-hover:opacity-20 transition-opacity"
                />
              </div>

              <div className="relative z-10 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
                      {unidade.nome}
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#FF6B47]" />
                      {unidade.endereco}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#FF6B47] to-[#FF8C47] text-white px-4 py-2 rounded-full text-sm font-bold">
                    {unidade.preco}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#FFD966]" />
                    </div>
                    <span className="text-sm font-medium">{unidade.quadras}</span>
                  </div>

                  <div className="flex items-center gap-3 text-white/80">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-[#FFD966]" />
                    </div>
                    <span className="text-sm font-medium">{unidade.horario}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleWhatsApp(unidade.whatsapp, unidade.mensagem)}
                  className="w-full bg-gradient-to-r from-[#FF6B47] to-[#FF8C47] hover:from-[#FF5533] hover:to-[#FF6B47] text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#FF6B47]/50 group-hover:scale-[1.02]"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-lg">Reservar via WhatsApp</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Voltar */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            ← Voltar para home
          </Link>
        </div>
      </main>

      {/* Floating decoration */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-[#FF6B47]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-[#FFD966]/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  )
}

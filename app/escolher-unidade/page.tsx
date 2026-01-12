"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function EscolherUnidadePage() {
  const unidades = [
    {
      nome: "PARQUE AMAZÔNIA",
      quadras: "5 QUADRAS",
      preco: "80",
      whatsapp: "556282935151",
      mensagem: "Olá! Gostaria de reservar uma quadra no Parque Amazônia",
    },
    {
      nome: "VILA ROSA",
      quadras: "4 QUADRAS",
      preco: "70",
      whatsapp: "556295797965",
      mensagem: "Olá! Gostaria de reservar uma quadra no Vila Rosa",
    },
  ]

  const handleReservar = (whatsapp: string, mensagem: string) => {
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-20"
      style={{
        backgroundImage: "url('/happy-people-playing-beach-sports-outdoors-sunny-d.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-white uppercase mb-3">PLANOS</h1>
          <p className="text-white/90 text-lg">Escolha sua unidade preferida</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {unidades.map((unidade, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-[#FF6B47]/10 p-4 rounded-full">
                  <MapPin className="h-10 w-10 text-[#FF6B47]" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 text-center mb-3 uppercase">{unidade.nome}</h2>

              <p className="text-gray-600 text-center mb-6 text-sm">{unidade.quadras}</p>

              <div className="text-center mb-8">
                <span className="text-5xl font-black text-[#FF6B47]">R$ {unidade.preco}</span>
                <span className="text-gray-600 text-lg">/hora</span>
              </div>

              <Button
                onClick={() => handleReservar(unidade.whatsapp, unidade.mensagem)}
                className="w-full bg-gradient-to-r from-[#FF6B47] to-[#FF8566] hover:from-[#FF5533] hover:to-[#FF6B47] text-white font-bold py-6 rounded-full text-lg uppercase transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                RESERVAR
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  )
}

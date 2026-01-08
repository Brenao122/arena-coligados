"use client"

import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const unidades = [
  {
    id: 1,
    nome: "Parque Amazônia",
    endereco: "Parque Amazônia, Goiânia - GO",
    horario: "06:00 - 23:00",
    whatsapp: "556282935151",
    imagem: "/beach-tennis-court-parque-amazonia.jpg",
    preco: "A partir de R$ 60/hora",
  },
  {
    id: 2,
    nome: "Vila Rosa",
    endereco: "Vila Rosa, Goiânia - GO",
    horario: "06:00 - 23:00",
    whatsapp: "556295797965",
    imagem: "/beach-tennis-court-vila-rosa.jpg",
    preco: "A partir de R$ 60/hora",
  },
]

export default function EscolherUnidadePage() {
  const handleWhatsApp = (whatsapp: string, unidade: string) => {
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de reservar uma quadra na unidade ${unidade} da Arena Coligados.`,
    )
    window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-orange-400">Escolha</span> sua Unidade
          </h1>
          <p className="text-gray-300 text-lg">Selecione a unidade mais próxima de você para reservar sua quadra</p>
        </div>

        {/* Cards das Unidades */}
        <div className="grid md:grid-cols-2 gap-8">
          {unidades.map((unidade) => (
            <div
              key={unidade.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
            >
              {/* Imagem */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={unidade.imagem || "/placeholder.svg"}
                  alt={`Unidade ${unidade.nome}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {unidade.preco}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{unidade.nome}</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-orange-400" />
                    <span>{unidade.endereco}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-5 w-5 mr-3 text-orange-400" />
                    <span>{unidade.horario}</span>
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <Button
                  onClick={() => handleWhatsApp(unidade.whatsapp, unidade.nome)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Reservar via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">Horário de funcionamento: Segunda a Domingo, das 06h às 23h</p>
        </div>
      </div>
    </div>
  )
}

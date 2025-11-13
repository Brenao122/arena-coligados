"use client"

import { Navbar } from "@/components/layout/navbar"
import { Download, Palette, ImageIcon, FileText, BarChart3, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MidiaKitPage() {
  const cores = [
    { nome: "Laranja Principal", hex: "#FB923C", rgb: "251, 146, 60" },
    { nome: "Verde Secundário", hex: "#10B981", rgb: "16, 185, 129" },
    { nome: "Cinza Escuro", hex: "#1F2937", rgb: "31, 41, 55" },
    { nome: "Branco", hex: "#FFFFFF", rgb: "255, 255, 255" },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Mídia Kit
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Recursos oficiais da Arena Coligados para parceiros e imprensa
            </p>
            <Button
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                  "_blank",
                )
              }
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl"
            >
              <Download className="h-5 w-5 mr-2" />
              Baixar Mídia Kit Completo
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Logo */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="h-8 w-8 text-orange-400" />
              <h2 className="text-3xl font-bold text-white">Logo Oficial</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="bg-white rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo Arena Coligados"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full"
                  />
                </div>
                <p className="text-gray-300 text-sm">Logo Principal</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 text-center border border-white/10">
                <div className="bg-gray-900 rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo Arena Coligados"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full ring-2 ring-orange-500"
                  />
                </div>
                <p className="text-gray-300 text-sm">Versão Fundo Escuro</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-300">
                <div className="bg-white rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo Arena Coligados"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full ring-2 ring-orange-500"
                  />
                </div>
                <p className="text-gray-900 text-sm font-medium">Versão Fundo Claro</p>
              </div>
            </div>
          </div>

          {/* Paleta de Cores */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-8 w-8 text-orange-400" />
              <h2 className="text-3xl font-bold text-white">Paleta de Cores</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {cores.map((cor) => (
                <div key={cor.hex} className="text-center">
                  <div
                    className="w-full h-32 rounded-xl mb-4 shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: cor.hex }}
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{cor.nome}</h3>
                  <p className="text-sm text-gray-400">{cor.hex}</p>
                  <p className="text-xs text-gray-500">RGB: {cor.rgb}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dados Estatísticos */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-8 w-8 text-orange-400" />
              <h2 className="text-3xl font-bold text-white">Dados para Parceiros</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-orange-500/20 border border-orange-400/40 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">2</div>
                <p className="text-gray-300">Unidades</p>
              </div>
              <div className="bg-green-500/20 border border-green-400/40 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">9</div>
                <p className="text-gray-300">Quadras Profissionais</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-400/40 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">4</div>
                <p className="text-gray-300">Modalidades</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-400/40 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">12+</div>
                <p className="text-gray-300">Colaboradores</p>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-400/40 rounded-2xl p-10 text-center">
            <FileText className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Para Parcerias e Imprensa</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Entre em contato conosco para mais informações, materiais adicionais ou propostas de parceria
            </p>
            <Button
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                  "_blank",
                )
              }
              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-4"
            >
              Acessar Mídia Kit Completo
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

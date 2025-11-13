"use client"

import { Navbar } from "@/components/layout/navbar"
import { Download, Palette, ImageIcon, FileText, BarChart3, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MidiaKitClientPage() {
  const cores = [
    { nome: "Laranja Principal", hex: "#FB923C", rgb: "251, 146, 60" },
    { nome: "Verde Secundário", hex: "#10B981", rgb: "16, 185, 129" },
    { nome: "Cinza Escuro", hex: "#1F2937", rgb: "31, 41, 55" },
    { nome: "Branco", hex: "#FFFFFF", rgb: "255, 255, 255" },
  ]

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-32 pb-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Mídia Kit
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Recursos oficiais da Arena Coligados para parceiros e imprensa
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              role="group"
              aria-label="Downloads de materiais"
            >
              <Button
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                    "_blank",
                  )
                }
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-orange-300"
                aria-label="Baixar mídia kit completo"
              >
                <Download className="h-5 w-5 mr-2" aria-hidden="true" />
                Mídia Kit Completo
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => window.open("https://www.instagram.com/arenacoligados/", "_blank")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-green-300"
                aria-label="Ver apresentação Arena Coligado Bambu"
              >
                <FileText className="h-5 w-5 mr-2" aria-hidden="true" />
                Apresentação Arena Coligado Bambu
                <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </header>

          <section
            aria-labelledby="logo-heading"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="h-8 w-8 text-orange-400" aria-hidden="true" />
              <h2 id="logo-heading" className="text-3xl font-bold text-white">
                Logo Oficial
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8" role="list">
              <figure className="bg-white/5 rounded-xl p-6 text-center border border-white/10" role="listitem">
                <div className="bg-white rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo principal da Arena Coligados"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full"
                  />
                </div>
                <figcaption className="text-gray-300 text-sm">Logo Principal</figcaption>
              </figure>
              <figure className="bg-gray-900 rounded-xl p-6 text-center border border-white/10" role="listitem">
                <div className="bg-gray-900 rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo da Arena Coligados para fundo escuro"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full ring-2 ring-orange-500"
                  />
                </div>
                <figcaption className="text-gray-300 text-sm">Versão Fundo Escuro</figcaption>
              </figure>
              <figure className="bg-white rounded-xl p-6 text-center border border-gray-300" role="listitem">
                <div className="bg-white rounded-lg p-6 mb-4">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo da Arena Coligados para fundo claro"
                    width={150}
                    height={150}
                    className="mx-auto rounded-full ring-2 ring-orange-500"
                  />
                </div>
                <figcaption className="text-gray-900 text-sm font-medium">Versão Fundo Claro</figcaption>
              </figure>
            </div>
          </section>

          <section
            aria-labelledby="colors-heading"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-8 w-8 text-orange-400" aria-hidden="true" />
              <h2 id="colors-heading" className="text-3xl font-bold text-white">
                Paleta de Cores
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6" role="list">
              {cores.map((cor) => (
                <article key={cor.hex} className="text-center" role="listitem">
                  <div
                    className="w-full h-32 rounded-xl mb-4 shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: cor.hex }}
                    role="img"
                    aria-label={`Cor ${cor.nome}`}
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{cor.nome}</h3>
                  <p className="text-sm text-gray-400" aria-label={`Código hexadecimal ${cor.hex}`}>
                    {cor.hex}
                  </p>
                  <p className="text-xs text-gray-500" aria-label={`RGB ${cor.rgb}`}>
                    RGB: {cor.rgb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="stats-heading"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 shadow-xl mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-8 w-8 text-orange-400" aria-hidden="true" />
              <h2 id="stats-heading" className="text-3xl font-bold text-white">
                Dados para Parceiros
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6" role="list">
              <article
                className="bg-orange-500/20 border border-orange-400/40 rounded-xl p-6 text-center"
                role="listitem"
              >
                <div className="text-4xl font-bold text-orange-400 mb-2" aria-label="2 unidades">
                  2
                </div>
                <p className="text-gray-300">Unidades</p>
              </article>
              <article
                className="bg-green-500/20 border border-green-400/40 rounded-xl p-6 text-center"
                role="listitem"
              >
                <div className="text-4xl font-bold text-green-400 mb-2" aria-label="9 quadras profissionais">
                  9
                </div>
                <p className="text-gray-300">Quadras Profissionais</p>
              </article>
              <article className="bg-blue-500/20 border border-blue-400/40 rounded-xl p-6 text-center" role="listitem">
                <div className="text-4xl font-bold text-blue-400 mb-2" aria-label="4 modalidades">
                  4
                </div>
                <p className="text-gray-300">Modalidades</p>
              </article>
              <article
                className="bg-purple-500/20 border border-purple-400/40 rounded-xl p-6 text-center"
                role="listitem"
              >
                <div className="text-4xl font-bold text-purple-400 mb-2" aria-label="Mais de 12 colaboradores">
                  12+
                </div>
                <p className="text-gray-300">Colaboradores</p>
              </article>
            </div>
          </section>

          <section
            aria-labelledby="contact-heading"
            className="bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-400/40 rounded-2xl p-10 text-center"
          >
            <FileText className="h-12 w-12 text-orange-400 mx-auto mb-4" aria-hidden="true" />
            <h2 id="contact-heading" className="text-3xl font-bold text-white mb-4">
              Para Parcerias e Imprensa
            </h2>
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
              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-4 focus:ring-4 focus:ring-orange-300"
              aria-label="Acessar mídia kit completo no Google Drive"
            >
              Acessar Mídia Kit Completo
              <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </section>
        </div>
      </main>
    </>
  )
}

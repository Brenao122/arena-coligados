"use client"

import { Navbar } from "@/components/layout/navbar"
import { Download, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function MidiaKitClientPage() {
  const cores = [
    { nome: "Coral", hex: "#FF6B47" },
    { nome: "Areia", hex: "#F5D5AE" },
    { nome: "Cinza", hex: "#6B7280" },
    { nome: "Branco", hex: "#FFFFFF" },
  ]

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen bg-white pt-40 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <header className="text-center mb-32 animate-fade-in-luxury">
            <div className="inline-block mb-6">
              <span className="accent-dot mr-3"></span>
              <span className="text-luxury-subtitle">Recursos para Imprensa</span>
              <span className="accent-dot ml-3"></span>
            </div>
            
            <h1 className="text-luxury-hero mb-8">
              Mídia Kit
            </h1>
            
            <div className="divider-luxury"></div>
            
            <p className="text-luxury-body max-w-2xl mx-auto mb-16">
              Materiais oficiais da Arena Coligados disponíveis para parceiros, 
              imprensa e colaboradores
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                    "_blank",
                  )
                }
                className="btn-primary"
                aria-label="Baixar mídia kit completo"
              >
                <Download className="h-4 w-4 mr-3" aria-hidden="true" />
                Mídia Kit Completo
              </Button>
              <Button
                onClick={() => window.open("https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing", "_blank")}
                className="btn-secondary"
                aria-label="Ver apresentação institucional"
              >
                Apresentação Institucional
                <ExternalLink className="h-4 w-4 ml-3" aria-hidden="true" />
              </Button>
            </div>
          </header>

          <section aria-labelledby="logo-heading" className="mb-32">
            <div className="text-center mb-16">
              <h2 id="logo-heading" className="text-luxury-title mb-4">
                Identidade Visual
              </h2>
              <p className="text-luxury-body">Versões aprovadas do logotipo</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8" role="list">
              <figure className="card-luxury text-center group" role="listitem">
                <div className="mb-8 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo principal da Arena Coligados"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="text-sm uppercase tracking-widest text-gray-500 font-medium">
                  Principal
                </figcaption>
              </figure>
              
              <figure className="card-luxury text-center group bg-gray-900" role="listitem">
                <div className="mb-8 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo para fundo escuro"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="text-sm uppercase tracking-widest text-white font-medium">
                  Fundo Escuro
                </figcaption>
              </figure>
              
              <figure className="card-luxury text-center group" role="listitem">
                <div className="mb-8 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                    alt="Logo para fundo claro"
                    width={160}
                    height={160}
                    className="rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="text-sm uppercase tracking-widest text-gray-500 font-medium">
                  Fundo Claro
                </figcaption>
              </figure>
            </div>
          </section>

          <section aria-labelledby="colors-heading" className="mb-32">
            <div className="text-center mb-16">
              <h2 id="colors-heading" className="text-luxury-title mb-4">
                Paleta de Cores
              </h2>
              <p className="text-luxury-body">Cores oficiais da marca</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" role="list">
              {cores.map((cor) => (
                <article key={cor.hex} className="group" role="listitem">
                  <div
                    className="w-full aspect-square rounded-2xl mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    style={{ backgroundColor: cor.hex }}
                    role="img"
                    aria-label={`Cor ${cor.nome}`}
                  />
                  <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">
                    {cor.nome}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono tracking-wider">
                    {cor.hex}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="stats-heading" className="mb-32">
            <div className="text-center mb-16">
              <h2 id="stats-heading" className="text-luxury-title mb-4">
                Em Números
              </h2>
              <p className="text-luxury-body">Informações relevantes para parceiros</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
              <article className="text-center" role="listitem">
                <div className="text-6xl font-light text-[#FF6B47] mb-4" aria-label="2 unidades">
                  02
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-500">Unidades</p>
              </article>
              
              <article className="text-center" role="listitem">
                <div className="text-6xl font-light text-[#FF6B47] mb-4" aria-label="9 quadras">
                  09
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-500">Quadras</p>
              </article>
              
              <article className="text-center" role="listitem">
                <div className="text-6xl font-light text-[#FF6B47] mb-4" aria-label="4 modalidades">
                  04
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-500">Modalidades</p>
              </article>
              
              <article className="text-center" role="listitem">
                <div className="text-6xl font-light text-[#FF6B47] mb-4" aria-label="12 colaboradores">
                  12
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-500">Equipe</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="contact-heading" className="text-center card-luxury">
            <h2 id="contact-heading" className="text-luxury-title mb-6">
              Parcerias
            </h2>
            <p className="text-luxury-body mb-10 max-w-2xl mx-auto">
              Entre em contato para propostas de parceria e colaboração
            </p>
            <Button
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1vaavzxMbSAJVu7WD5geE3Gairi1p82D_/view?usp=sharing",
                  "_blank",
                )
              }
              className="btn-primary"
              aria-label="Acessar materiais completos"
            >
              Acessar Materiais
              <ExternalLink className="h-4 w-4 ml-3" aria-hidden="true" />
            </Button>
          </section>
        </div>
      </main>
    </>
  )
}

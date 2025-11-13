"use client"

import type { Metadata } from "next"
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
        className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-32 pb-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Logo Arena Coligados"
                width={100}
                height={100}
                className="rounded-full ring-4 ring-orange-500/50 shadow-2xl"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Sobre Nós
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mais que uma arena esportiva, somos uma família unida pelo esporte e amizade
            </p>
          </header>

          {/* Nossa História */}
          <NossaHistoria />

          <section aria-labelledby="mvv-heading" className="mt-16">
            <h2 id="mvv-heading" className="sr-only">
              Missão, Visão e Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8" role="list">
              <article
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl"
                role="listitem"
              >
                <Target className="h-12 w-12 text-orange-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-3">Missão</h3>
                <p className="text-gray-300 leading-relaxed">
                  Proporcionar experiências esportivas de qualidade, promovendo saúde, lazer e conexões através do
                  esporte.
                </p>
              </article>

              <article
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl"
                role="listitem"
              >
                <Eye className="h-12 w-12 text-green-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-3">Visão</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ser referência em gestão esportiva, expandindo nossa família para todo o Brasil.
                </p>
              </article>

              <article
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl"
                role="listitem"
              >
                <Heart className="h-12 w-12 text-red-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-3">Valores</h3>
                <p className="text-gray-300 leading-relaxed">
                  Amizade, respeito, excelência e compromisso com a comunidade esportiva.
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="unidades-heading" className="mt-16">
            <h2 id="unidades-heading" className="text-4xl font-bold text-center text-orange-400 mb-10">
              Nossas Unidades
            </h2>
            <div className="grid md:grid-cols-2 gap-8" role="list">
              <article
                className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/40 rounded-2xl p-8 backdrop-blur-md"
                role="listitem"
              >
                <MapPin className="h-10 w-10 text-orange-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-2">Parque Amazônia</h3>
                <p className="text-gray-300 mb-4">5 quadras profissionais de Beach Tennis, Vôlei e Futevôlei</p>
                <address className="text-sm text-gray-400 not-italic">Parque Amazônia, Goiânia - GO</address>
              </article>

              <article
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/40 rounded-2xl p-8 backdrop-blur-md"
                role="listitem"
              >
                <MapPin className="h-10 w-10 text-green-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-2">Vila Rosa</h3>
                <p className="text-gray-300 mb-4">4 quadras equipadas com infraestrutura completa</p>
                <address className="text-sm text-gray-400 not-italic">Setor Vila Rosa, Goiânia - GO</address>
              </article>
            </div>
          </section>

          <section aria-labelledby="team-heading" className="mt-16 text-center">
            <Users className="h-16 w-16 text-orange-400 mx-auto mb-6" aria-hidden="true" />
            <h2 id="team-heading" className="text-4xl font-bold text-white mb-4">
              Nosso Time
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Uma equipe de 12 colaboradores dedicados e centenas de clientes que se tornaram verdadeiros amigos
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" role="list">
              <article className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20" role="listitem">
                <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white mb-2">Gustavo Oliveira</h3>
                <p className="text-gray-400 text-sm">Co-fundador & Diretor</p>
              </article>
              <article className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20" role="listitem">
                <Trophy className="h-8 w-8 text-green-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white mb-2">Rafael Henrique</h3>
                <p className="text-gray-400 text-sm">Co-fundador & Diretor</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

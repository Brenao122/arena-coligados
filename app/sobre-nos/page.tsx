"use client"

import { Navbar } from "@/components/layout/navbar"
import { NossaHistoria } from "@/components/home/nossa-historia"
import { MapPin, Users, Trophy, Target, Heart, Eye } from "lucide-react"
import Image from "next/image"

export default function SobreNosPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Arena Coligados"
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
          </div>

          {/* Nossa História */}
          <NossaHistoria />

          {/* Missão, Visão, Valores */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <Target className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Missão</h3>
              <p className="text-gray-300 leading-relaxed">
                Proporcionar experiências esportivas de qualidade, promovendo saúde, lazer e conexões através do
                esporte.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <Eye className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Visão</h3>
              <p className="text-gray-300 leading-relaxed">
                Ser referência em gestão esportiva, expandindo nossa família para todo o Brasil.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <Heart className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Valores</h3>
              <p className="text-gray-300 leading-relaxed">
                Amizade, respeito, excelência e compromisso com a comunidade esportiva.
              </p>
            </div>
          </div>

          {/* Nossas Unidades */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-center text-orange-400 mb-10">Nossas Unidades</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/40 rounded-2xl p-8 backdrop-blur-md">
                <MapPin className="h-10 w-10 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Parque Amazônia</h3>
                <p className="text-gray-300 mb-4">5 quadras profissionais de Beach Tennis, Vôlei e Futevôlei</p>
                <p className="text-sm text-gray-400">Endereço: Parque Amazônia, Goiânia - GO</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/40 rounded-2xl p-8 backdrop-blur-md">
                <MapPin className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Vila Rosa</h3>
                <p className="text-gray-300 mb-4">4 quadras equipadas com infraestrutura completa</p>
                <p className="text-sm text-gray-400">Endereço: Setor Vila Rosa, Goiânia - GO</p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="mt-16 text-center">
            <Users className="h-16 w-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Nosso Time</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Uma equipe de 12 colaboradores dedicados e centenas de clientes que se tornaram verdadeiros amigos
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Trophy className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Gustavo Oliveira</h4>
                <p className="text-gray-400 text-sm">Co-fundador & Diretor</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Trophy className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Rafael Henrique</h4>
                <p className="text-gray-400 text-sm">Co-fundador & Diretor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

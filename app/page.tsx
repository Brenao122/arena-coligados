"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  DollarSign,
  Users,
  Trophy,
  Star,
  Instagram,
  LogIn,
  MessageCircle,
  Play,
  Award,
  Target,
  Navigation,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [activeUnit, setActiveUnit] = useState<"matriz" | "vila-rosa">("matriz")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const modalidades = [
    {
      name: "Beach Tennis",
      icon: "ðŸ",
      description: "A modalidade que mais cresce no Brasil",
      subtitle: "Quadras profissionais com areia importada",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b8529c78-39c5-4aa4-bdac-94e318b5cf98-cgajBFxQprEq8DDQ2fAAZvwgptQxyM.png",
      features: ["Raquetes profissionais", "Bolas oficiais", "Areia premium"],
    },
    {
      name: "Vôlei",
      icon: "ðŸ",
      description: "Tradição e paixão em cada jogada",
      subtitle: "Quadras com padrão olímpico",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9263210e-51f6-4f5e-aa03-8acec0076252-dtDWKxHsAMXArMoEhIxPacbwmxssar.png",
      features: ["Rede oficial", "Piso profissional", "Iluminação LED"],
    },
    {
      name: "Futevôlei",
      icon: "âš½",
      description: "Arte brasileira em movimento",
      subtitle: "Quadras grandes para máxima performance",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/946a596c-d20e-45cc-9950-9852afc1d697-e7q1ArrposcV5deu9cKjKZORZTDCPe.png",
      features: ["Areia especial", "Rede regulamentada", "Espaço amplo"],
    },
    {
      name: "Futebol Society",
      icon: "âš½",
      description: "Quadras 1, 2 e 4 (Grandes)",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9ea7f297-f7a0-4bff-93ca-3ff9329f50e6-NZh6Js68duFIT3FwT6u0lecZhuE97x.png",
      features: ["Grama sintética", "Iluminação profissional", "Vestiários completos"],
    },
  ]

  const horarios = [
    { periodo: "Segunda a Sexta", horario: "09:00 às 17:00", preco: "R$ 50,00", tipo: "promocional" },
    { periodo: "Segunda a Sexta", horario: "22:00 às 23:00", preco: "R$ 50,00", tipo: "promocional" },
    { periodo: "Demais horários", horario: "Outros", preco: "R$ 80,00", tipo: "normal" },
  ]

  const stats = [
    { number: "7", label: "Quadras Profissionais", icon: Trophy },
    { number: "2", label: "Unidades em Goiânia", icon: MapPin },
    { number: "4", label: "Modalidades Esportivas", icon: Target },
    { number: "100%", label: "Satisfação dos Clientes", icon: Star },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_80%_10%,rgba(255,138,0,0.15),transparent_60%),radial-gradient(90%_60%_at_10%_80%,rgba(255,106,0,0.12),transparent_70%),conic-gradient(from_210deg_at_40%_60%,rgba(255,138,0,0.18),rgba(255,106,0,0.10),rgba(255,138,0,0.18))]"></div>

      {/* Premium grain texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_1.5px)] bg-[length:6px_6px]"></div>

      {/* Subtle vignette for readability */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_35%,transparent,rgba(0,0,0,0.25))]"></div>

      <header className="bg-black/15 backdrop-blur-xl border-b border-orange-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full blur-sm opacity-80"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
                alt="Arena Coligados Logo"
                width={56}
                height={56}
                className="rounded-full ring-2 ring-orange-500/50"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                Arena Coligados
              </h1>
              <p className="text-sm text-gray-300 font-medium">Excelência Esportiva</p>
            </div>
          </div>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 group border-0">
              <LogIn className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Ãrea do Cliente
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2016%20de%20ago.%20de%202025%2C%2020_07_02-vHRYPnHSHDaG7PzpZsDBR8FIIcu3it.png"
            alt="Arena Coligados - Complexo Esportivo Premium"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div
            className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            <h1 className="text-7xl md:text-9xl font-black mb-12 leading-tight">
              <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent">
                ONDE{" "}
                <span className="relative inline-block">
                  <span className="champion-text text-8xl md:text-[10rem] leading-none relative z-10">
                    CAMPEÕES
                  </span>
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-yellow-400/20 to-orange-500/20 rounded-2xl blur-xl champion-glow"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/25 via-yellow-300/25 to-orange-400/25 rounded-xl blur-lg champion-glow"></div>
                </span>
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">NASCEM</span>
            </h1>

            <p className="text-2xl md:text-4xl text-gray-200 mb-16 leading-relaxed font-light max-w-5xl mx-auto drop-shadow-lg">
              Duas unidades premium em Goiânia com{" "}
              <span className="text-orange-300 font-bold">7 quadras profissionais</span> e tecnologia de ponta para sua
              melhor performance
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-20">
              <a
                href="https://wa.me/5562982935151?text=Olá! Gostaria de agendar uma quadra na Arena Coligados. Podem me ajudar com horários e disponibilidade?"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 group border-0">
                  <Play className="h-10 w-10 mr-4 group-hover:scale-110 transition-transform" />
                  AGENDE AGORA
                </Button>
              </a>
              <a
                href="https://wa.me/5562982935151?text=Olá! Tenho interesse em uma aula experimental na Arena Coligados. Podem me informar sobre as modalidades disponíveis e horários?"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="text-2xl px-16 py-8 rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <Award className="h-10 w-10 mr-4" />
                  AULA EXPERIMENTAL
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 group"
                >
                  <stat.icon className="h-16 w-16 text-orange-300 mx-auto mb-6 group-hover:scale-110 transition-transform drop-shadow-lg" />
                  <div className="text-5xl font-black text-white mb-3 drop-shadow-lg">{stat.number}</div>
                  <div className="text-gray-200 font-semibold text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <Badge className="bg-green-500/20 text-green-300 px-8 py-4 text-xl font-bold mb-8 backdrop-blur-sm border border-green-400/30">
              <Trophy className="h-6 w-6 mr-3" />
              MODALIDADES PREMIUM
            </Badge>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
              ESPORTES DE
              <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                {" "}
                ELITE
              </span>
            </h2>
            <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Equipamentos profissionais, estrutura de primeira linha e ambiente inspirador para atletas de todos os
              níveis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {modalidades.map((modalidade, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:scale-105"
              >
                <div className="relative h-[500px] w-full">
                  <Image
                    src={modalidade.image || "/placeholder.svg"}
                    alt={modalidade.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-black text-white mb-3 drop-shadow-lg">{modalidade.name}</h3>
                    <p className="text-orange-300 font-bold mb-3 text-lg">{modalidade.description}</p>
                    <p className="text-gray-200 mb-6 text-base">{modalidade.subtitle}</p>

                    <div className="space-y-2">
                      {modalidade.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-200">
                          <Star className="h-4 w-4 text-orange-400 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
              NOSSAS
              <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                {" "}
                UNIDADES
              </span>
            </h2>
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-3 flex border border-orange-500/30 shadow-2xl">
              <button
                onClick={() => setActiveUnit("matriz")}
                className={`px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 ${
                  activeUnit === "matriz"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30"
                    : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                Matriz Premium
              </button>
              <button
                onClick={() => setActiveUnit("vila-rosa")}
                className={`px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 ${
                  activeUnit === "vila-rosa"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30"
                    : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                Vila Rosa Elite
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            <div className="relative">
              <Image
                src={
                  activeUnit === "matriz"
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9c2a9c65-389e-4efe-ba04-1777a68cceda-CPVmvBi8nvJ9RvOay7Mn5t5CVTdraB.png"
                    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25ddf6be-a813-49c0-9376-be4fee818344-HhiSAmhJpJlEU4TfU88W2DnXZGQ6It.png"
                }
                alt={`Arena Coligados ${activeUnit === "matriz" ? "Matriz" : "Vila Rosa"}`}
                width={700}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
            </div>

            <div className="space-y-10">
              {activeUnit === "matriz" ? (
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                  <h3 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <MapPin className="h-10 w-10 text-orange-400" />
                    Arena Coligados Matriz
                  </h3>
                  <p className="text-gray-200 text-xl mb-8 leading-relaxed">
                    Nossa unidade principal com 5 quadras profissionais e infraestrutura completa
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-200">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <span className="text-xl">
                        R$ 80,00/hora â€¢ <span className="text-orange-300 font-bold">Promocional R$ 50,00</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-200">
                      <Users className="h-8 w-8 text-blue-400" />
                      <span className="text-xl">3 Quadras Grandes â€¢ 2 Quadras Pequenas</span>
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-lg p-8 rounded-2xl mt-8 border border-orange-500/30">
                    <p className="text-orange-300 font-bold mb-3 text-lg">PIX Matriz:</p>
                    <p className="font-mono text-3xl text-white mb-2">53610057000179</p>
                    <p className="text-gray-300 text-lg">Arena Coligados</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                  <h3 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <MapPin className="h-10 w-10 text-orange-400" />
                    Arena Coligados Vila Rosa
                  </h3>
                  <p className="text-gray-200 text-xl mb-8 leading-relaxed">
                    Unidade moderna com 4 quadras padrão e excelente localização
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-200">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <span className="text-xl">
                        R$ 70,00/hora â€¢ <span className="text-orange-300 font-bold">Promocional R$ 50,00</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-200">
                      <Star className="h-8 w-8 text-yellow-400" />
                      <span className="text-xl">Bola totalmente gratuita</span>
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-lg p-8 rounded-2xl mt-8 border border-orange-500/30">
                    <p className="text-orange-300 font-bold mb-3 text-lg">PIX Vila Rosa:</p>
                    <p className="font-mono text-3xl text-white mb-2">74934007172</p>
                    <p className="text-gray-300 text-lg">Rafael Henrique</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Horários e Preços */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Horários e Preços</h3>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {horarios.map((horario, index) => (
              <Card
                key={index}
                className={`bg-gray-800 border-gray-700 ${horario.tipo === "promocional" ? "ring-2 ring-orange-500/50" : ""}`}
              >
                <CardHeader>
                  <CardTitle className={`text-lg ${horario.tipo === "promocional" ? "text-orange-400" : "text-white"}`}>
                    {horario.periodo}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{horario.horario}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold mb-2 ${horario.tipo === "promocional" ? "text-orange-400" : "text-white"}`}
                    >
                      {horario.preco}
                    </div>
                    <div className="text-sm text-gray-400">por hora</div>
                    {horario.tipo === "promocional" && (
                      <Badge className="bg-orange-500/20 text-orange-400 mt-2">ðŸ”¥ PROMOCIONAL</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">Finais de semana: Bola profissional gratuita!</p>
            <p className="text-sm text-gray-500">
              Bola profissional oficial de campeonato por apenas R$ 10,00 nos dias úteis
            </p>
          </div>
        </div>
      </section>

      {/* Sistema Grava Lance */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Sistema Grava Lance</h3>
            <p className="text-gray-300 mb-8 text-lg">
              Todas as nossas quadras têm o sistema Grava Lance! Ã‰ super fácil e totalmente grátis!
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-gray-300 text-sm">Encontre o botão no poste da rede</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-gray-300 text-sm">Baixe o app Grava Lance</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-gray-300 text-sm">Selecione Arena Coligados e sua quadra</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <p className="text-gray-300 text-sm">Baixe seu lance direto na galeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Modalidades Disponíveis</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modalidades.map((modalidade, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors overflow-hidden"
              >
                {modalidade.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={modalidade.image || "/placeholder.svg"}
                      alt={modalidade.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  {!modalidade.image && <div className="text-4xl mb-4">{modalidade.icon}</div>}
                  <h4 className="text-xl font-bold text-white mb-2">{modalidade.name}</h4>
                  <p className="text-gray-400 text-sm">{modalidade.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-black/10">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
              AULAS
              <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                {" "}
                EXPERIMENTAIS
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-center">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/321b5503-4fbf-4643-a30f-5212578e5072-pyy8IRy2VJiTNsTbZJzKnkfv8V1fEt.png"
                alt="Aulas Experimentais - Professor com alunos"
                width={700}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                <h3 className="text-4xl font-black text-white mb-6">Experimente Gratuitamente</h3>
                <p className="text-gray-200 text-xl mb-8 leading-relaxed">
                  Professores qualificados e turmas niveladas para todos os níveis: Aprendiz, Iniciante, Intermediário e
                  Avançado.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-orange-500/20 p-6 rounded-2xl mb-4">
                      <Users className="h-12 w-12 text-orange-400 mx-auto" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Beach Tennis</h4>
                    <p className="text-gray-400 text-sm">Até 6 alunos por quadra</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-blue-500/20 p-6 rounded-2xl mb-4">
                      <Users className="h-12 w-12 text-blue-400 mx-auto" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Vôlei</h4>
                    <p className="text-gray-400 text-sm">Até 10 alunos por quadra</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-500/20 p-6 rounded-2xl mb-4">
                      <Users className="h-12 w-12 text-green-400 mx-auto" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Futevôlei</h4>
                    <p className="text-gray-400 text-sm">Até 10 alunos por quadra</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Badge className="bg-blue-500/20 text-blue-400 px-6 py-3 text-lg">Turmas KIDS até 13-15 anos</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black/30 backdrop-blur-xl py-20 px-4 border-t border-orange-500/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
                alt="Arena Coligados Logo"
                width={80}
                height={80}
                className="rounded-full ring-2 ring-orange-500/50"
              />
              <div>
                <h4 className="text-4xl font-black bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                  Arena Coligados
                </h4>
                <p className="text-gray-300 font-semibold text-lg">Excelência Esportiva</p>
              </div>
            </div>

            <div className="flex justify-center space-x-12 mb-10">
              <a
                href="https://www.instagram.com/arenacoligados/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125"
              >
                <Instagram className="h-10 w-10" />
              </a>
              <a
                href="https://www.waze.com/pt-BR/live-map/directions?to=ll.-16.737392%2C-49.27366"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125"
              >
                <Navigation className="h-10 w-10" />
              </a>
              <a
                href="https://www.google.com/maps/place/Arena+Coligados+-+Av.xingu+Rua+L-2,+4+-+quadra+22+-+Parque+Amazonia,+Goi%C3%A2nia+-+GO,+74840-740/@-16.7374463,-49.2737936,15z/data=!4m6!3m5!1s0x935ef1775a91f175:0x3e1a8918f192b4e6!8m2!3d-16.7374463!4d-49.2737936!16s%2Fg%2F11ld49jlmz?hl=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125"
              >
                <MapPin className="h-10 w-10" />
              </a>
              <a
                href="https://www.canva.com/design/DAGebZXswew/m2uPXjWRGYC1qKyiABjY_w/view?utm_content=DAGebZXswew&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he4cc04c764"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-orange-400 transition-colors transform hover:scale-125"
              >
                <ExternalLink className="h-10 w-10" />
              </a>
            </div>

            <p className="text-gray-400 text-xl">Â© 2024 Arena Coligados. Todos os direitos reservados.</p>
            <p className="text-gray-500 mt-3 text-lg">
              Marque <span className="text-orange-400 font-bold">@arenacoligados</span> em suas postagens!
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/5562982935151?text=Olá! Gostaria de saber mais sobre a Arena Coligados"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 group">
          <MessageCircle className="h-10 w-10 group-hover:rotate-12 transition-transform" />
        </div>
      </a>
    </div>
  )
}


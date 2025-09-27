"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Clock, Trophy, Star, Plus, MapPin, Zap, Target, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AlunoDashboardPage() {
  const { profile } = useAuth()

  const [arenaPower, setArenaPower] = useState({
    pontos: 156,
    nivel: "Atleta",
    proximoNivel: "Campeão",
    pontosProximoNivel: 300,
    streak: 7,
    melhorStreak: 12,
    frequencia: 85,
    ranking: 3,
    totalAlunos: 25,
    conquistas: ["Primeira Aula", "Streak 5 dias", "100 Pontos"],
  })

  const [stats, setStats] = useState({
    proximasAulas: 3,
    aulasRealizadas: 24,
    horasJogadas: 48,
    avaliacaoMedia: 4.8,
  })

  const proximasReservas = [
    {
      id: 1,
      data: "Hoje",
      horario: "16:00 - 17:00",
      quadra: "Quadra 2 - Tênis",
      professor: "Prof. Carlos Santos",
      tipo: "Aula Particular",
    },
    {
      id: 2,
      data: "Amanhã",
      horario: "18:00 - 19:00",
      quadra: "Quadra 1 - Futebol",
      professor: "Prof. Ana Silva",
      tipo: "Treino em Grupo",
    },
    {
      id: 3,
      data: "Sexta-feira",
      horario: "15:00 - 16:00",
      quadra: "Quadra 3 - Vôlei",
      professor: "Prof. João Oliveira",
      tipo: "Aula Experimental",
    },
  ]

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Iniciante":
        return "from-blue-500 to-blue-600"
      case "Atleta":
        return "from-green-500 to-green-600"
      case "Campeão":
        return "from-orange-500 to-orange-600"
      case "Lenda":
        return "from-yellow-400 to-yellow-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case "Iniciante":
        return <Star className="h-6 w-6" />
      case "Atleta":
        return <Trophy className="h-6 w-6" />
      case "Campeão":
        return <Award className="h-6 w-6" />
      case "Lenda":
        return <Zap className="h-6 w-6" />
      default:
        return <Star className="h-6 w-6" />
    }
  }

  const progressoProximoNivel = ((arenaPower.pontos % 100) / 100) * 100

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bem-vindo, {profile?.full_name || "Ana Silva"}!
          </h1>
          <p className="text-gray-400">Acompanhe seu progresso e próximas atividades</p>
        </div>
        <Link href="/dashboard/reservas">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Reserva
          </Button>
        </Link>
      </div>

      {/* Arena Power System */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500/30 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${getNivelColor(arenaPower.nivel)} shadow-lg`}>
                {getNivelIcon(arenaPower.nivel)}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                  Arena Power
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Nível {arenaPower.nivel} • {arenaPower.pontos} pontos
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Ranking</p>
              <p className="text-2xl font-bold text-orange-400">#{arenaPower.ranking}</p>
              <p className="text-xs text-gray-500">de {arenaPower.totalAlunos} alunos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Progresso para {arenaPower.proximoNivel}</span>
              <span className="text-sm text-gray-400">
                {arenaPower.pontos}/{arenaPower.pontosProximoNivel}
              </span>
            </div>
            <Progress value={(arenaPower.pontos / arenaPower.pontosProximoNivel) * 100} className="h-3 bg-gray-700" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-400 mr-1" />
                <span className="text-lg font-bold text-white">{arenaPower.streak}</span>
              </div>
              <p className="text-xs text-gray-400">Streak Atual</p>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-400 mr-1" />
                <span className="text-lg font-bold text-white">{arenaPower.frequencia}%</span>
              </div>
              <p className="text-xs text-gray-400">Frequência</p>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-lg font-bold text-white">{arenaPower.melhorStreak}</span>
              </div>
              <p className="text-xs text-gray-400">Melhor Streak</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Conquistas Recentes</h4>
            <div className="flex flex-wrap gap-2">
              {arenaPower.conquistas.map((conquista, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-500/30 rounded-full text-xs font-medium text-orange-300"
                >
                  {conquista}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Próximas Aulas</p>
                <p className="text-2xl font-bold text-white">{stats.proximasAulas}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Aulas Realizadas</p>
                <p className="text-2xl font-bold text-white">{stats.aulasRealizadas}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Horas Jogadas</p>
                <p className="text-2xl font-bold text-white">{stats.horasJogadas}h</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-800/50 border-yellow-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-300">Avaliação</p>
                <p className="text-2xl font-bold text-white">{stats.avaliacaoMedia}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Próximas Reservas</CardTitle>
          <CardDescription className="text-gray-400">Suas atividades agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximasReservas.map((reserva) => (
              <div
                key={reserva.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{reserva.quadra}</p>
                    <p className="text-sm text-gray-400">{reserva.professor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{reserva.data}</p>
                  <p className="text-sm text-gray-400">{reserva.horario}</p>
                </div>
                <div className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                  <span className="text-xs font-medium text-purple-300">{reserva.tipo}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Users, Calendar, DollarSign, Clock, Plus, User } from "lucide-react"
import Link from "next/link"

export default function ProfessorDashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    aulasSemana: 18,
    alunosAtivos: 12,
    receitaSemana: 1250.0,
    proximaAula: "16:00",
  })

  const proximasAulas = [
    {
      id: 1,
      horario: "16:00 - 17:00",
      aluno: "Maria Silva",
      quadra: "Quadra 2",
      modalidade: "Tênis",
      tipo: "Particular",
    },
    {
      id: 2,
      horario: "17:00 - 18:00",
      aluno: "João Santos",
      quadra: "Quadra 1",
      modalidade: "Futebol",
      tipo: "Treino",
    },
    {
      id: 3,
      horario: "18:00 - 19:00",
      aluno: "Ana Costa",
      quadra: "Quadra 3",
      modalidade: "Vôlei",
      tipo: "Experimental",
    },
  ]

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Olá, Prof. {profile?.full_name || "Professor"}!
          </h1>
          <p className="text-gray-400">Gerencie suas aulas e acompanhe seus alunos</p>
        </div>
        <Link href="/dashboard/reservas">
          <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Aula
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Aulas esta Semana</p>
                <p className="text-2xl font-bold text-white">{stats.aulasSemana}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Alunos Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.alunosAtivos}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-800/50 border-yellow-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-300">Receita Semanal</p>
                <p className="text-2xl font-bold text-white">R$ {stats.receitaSemana.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Próxima Aula</p>
                <p className="text-2xl font-bold text-white">{stats.proximaAula}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Próximas Aulas Hoje</CardTitle>
          <CardDescription className="text-gray-400">Sua agenda para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximasAulas.map((aula) => (
              <div
                key={aula.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <User className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{aula.aluno}</p>
                    <p className="text-sm text-gray-400">
                      {aula.modalidade} - {aula.quadra}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{aula.horario}</p>
                  <div className="bg-blue-500/20 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-blue-300">{aula.tipo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

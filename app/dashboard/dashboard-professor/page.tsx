"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, DollarSign, Clock, Plus, User } from "lucide-react"
import Link from "next/link"

export default function ProfessorDashboardPage() {
  const [stats, setStats] = useState({
    aulasSemana: 18,
    alunosAtivos: 12,
    receitaSemana: 1250.0,
    proximaAula: "16:00",
  })
  const [user, setUser] = useState<any>(null)
  const [proximasAulas, setProximasAulas] = useState<{ id: string; aluno: string; horario: string; quadra: string; tipo: string; modalidade: string }[]>([])

  useEffect(() => {
    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('arena_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        window.location.href = '/login'
        return
      }
    } else {
      window.location.href = '/login'
      return
    }

    // Buscar aulas reais do Google Sheets
    fetchProximasAulas()
  }, [])

  const fetchProximasAulas = async () => {
    try {
      const response = await fetch('/api/sheets/read?sheet=Reservas')
      const result = await response.json()
      
      if (result.ok && result.values) {
        const reservas = result.values.slice(1) // Pular cabeçalho
        setProximasAulas(reservas.slice(0, 5).map((r: any, index: number) => ({
          id: r[0] || index.toString(), // id está na coluna 0
          aluno: r[1] || 'Cliente', // cliente_id está na coluna 1
          horario: r[4] || '16:00', // data_inicio está na coluna 4
          quadra: r[2] || 'Quadra 1', // quadra_id está na coluna 2
          tipo: r[6] || 'Aula', // tipo está na coluna 6
          modalidade: r[11] || 'Futebol' // tipo_aula está na coluna 11
        })))
      }
    } catch (error) {
      console.error('Erro ao buscar aulas:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('arena_user')
    window.location.href = '/login'
  }

  if (!user) {
    return (
      <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Acesso Negado</h1>
          <p className="text-gray-400">Você precisa fazer login para acessar esta página.</p>
          <Button onClick={() => window.location.href = '/login'} className="mt-4">
            Ir para Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard Professor
          </h1>
          <p className="text-gray-400">Bem-vindo, {user.profile?.full_name || 'Professor'}!</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Sair
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
          >
            <Link href="/dashboard/reservas">
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Aulas Esta Semana</p>
                <p className="text-2xl font-bold text-white">{stats.aulasSemana}</p>
                <p className="text-xs text-blue-400">Agendadas</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Alunos Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.alunosAtivos}</p>
                <p className="text-xs text-green-400">Cadastrados</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">Receita Semana</p>
                <p className="text-2xl font-bold text-white">R$ {stats.receitaSemana.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-orange-400">Faturamento</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Próxima Aula</p>
                <p className="text-2xl font-bold text-white">{stats.proximaAula}</p>
                <p className="text-xs text-purple-400">Hoje</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Aulas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            Próximas Aulas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Suas aulas agendadas para hoje e amanhã
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximasAulas.length > 0 ? (
              proximasAulas.map((aula) => (
                <div key={aula.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{aula.aluno}</p>
                      <p className="text-sm text-gray-400">{aula.tipo} - {aula.modalidade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{aula.horario}</p>
                    <p className="text-sm text-gray-400">{aula.quadra}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma aula agendada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Ações Rápidas</CardTitle>
          <CardDescription className="text-gray-400">
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/reservas">
                <Calendar className="h-6 w-6 mb-2" />
                Minhas Aulas
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/clientes">
                <Users className="h-6 w-6 mb-2" />
                Meus Alunos
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/avaliacoes">
                <User className="h-6 w-6 mb-2" />
                Avaliações
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/relatorios">
                <DollarSign className="h-6 w-6 mb-2" />
                Relatórios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

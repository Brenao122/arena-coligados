"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  UserCheck,
  Plus,
  Settings,
  Zap,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalReservas: number
  reservasHoje: number
  totalClientes: number
  receitaMes: number
  quadrasAtivas: number
  professoresAtivos: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservas: 0,
    reservasHoje: 0,
    totalClientes: 0,
    receitaMes: 0,
    quadrasAtivas: 0,
    professoresAtivos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar se há usuário logado
    const savedUser = localStorage.getItem('arena_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        // Se não conseguir parsear, redirecionar para login
        window.location.href = '/login'
        return
      }
    } else {
      // Se não há usuário, redirecionar para login
      window.location.href = '/login'
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Buscar dados do Google Sheets
      const [reservasResponse, clientesResponse, quadrasResponse, professoresResponse] = await Promise.all([
        fetch('/api/sheets/read?sheet=Página1'),
        fetch('/api/sheets/read?sheet=Página1'),
        fetch('/api/sheets/read?sheet=Página1'),
        fetch('/api/sheets/read?sheet=Página1')
      ])

      const [reservasResult, clientesResult, quadrasResult, professoresResult] = await Promise.all([
        reservasResponse.json(),
        clientesResponse.json(),
        quadrasResponse.json(),
        professoresResponse.json()
      ])

      // Processar dados das reservas
      const reservas = reservasResult.ok ? reservasResult.rows.filter((r: any) => r.tipo === 'reserva' || r.Data) : []
      const clientes = clientesResult.ok ? clientesResult.rows.filter((r: any) => r.tipo === 'cliente' || r.Nome) : []
      const quadras = quadrasResult.ok ? quadrasResult.rows.filter((r: any) => r.tipo === 'quadra' || r.nome) : []
      const professores = professoresResult.ok ? professoresResult.rows.filter((r: any) => r.tipo === 'professor' || r.nome) : []

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0]
      const reservasHoje = reservas.filter((r: any) => {
        const dataReserva = r.data_inicio || r.Data || r.created_at
        return dataReserva && dataReserva.includes(hoje)
      }).length

      const receitaMes = reservas.reduce((total: number, r: any) => {
        const valor = parseFloat(r.valor || r.Valor || r.preco || 0)
        return total + (isNaN(valor) ? 0 : valor)
      }, 0)

      setStats({
        totalReservas: reservas.length,
        reservasHoje,
        totalClientes: clientes.length,
        receitaMes,
        quadrasAtivas: quadras.length,
        professoresAtivos: professores.length,
      })

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('arena_user')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-400">Bem-vindo, {user.profile?.full_name || 'Administrador'}!</p>
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
            className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
          >
            <Link href="/dashboard/reservas">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
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
                <p className="text-sm font-medium text-blue-300">Reservas Hoje</p>
                <p className="text-2xl font-bold text-white">{stats.reservasHoje}</p>
                <p className="text-xs text-blue-400">Total: {stats.totalReservas}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Clientes Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.totalClientes}</p>
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
                <p className="text-sm font-medium text-orange-300">Receita do Mês</p>
                <p className="text-2xl font-bold text-white">R$ {stats.receitaMes.toLocaleString("pt-BR")}</p>
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
                <p className="text-sm font-medium text-purple-300">Quadras Ativas</p>
                <p className="text-2xl font-bold text-white">{stats.quadrasAtivas}</p>
                <p className="text-xs text-purple-400">Disponíveis</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-orange-500" />
            Ações Rápidas
          </CardTitle>
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
                Reservas
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/clientes">
                <Users className="h-6 w-6 mb-2" />
                Clientes
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/quadras">
                <MapPin className="h-6 w-6 mb-2" />
                Quadras
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/professores">
                <UserCheck className="h-6 w-6 mb-2" />
                Professores
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/leads">
                <TrendingUp className="h-6 w-6 mb-2" />
                Leads
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/relatorios">
                <BarChart3 className="h-6 w-6 mb-2" />
                Relatórios
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/pagamentos">
                <DollarSign className="h-6 w-6 mb-2" />
                Pagamentos
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-20 flex-col border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Link href="/dashboard/configuracoes">
                <Settings className="h-6 w-6 mb-2" />
                Configurações
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
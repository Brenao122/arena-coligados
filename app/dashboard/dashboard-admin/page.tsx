"use client"

// Forçar renderização dinâmica e não cachear
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

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
  RefreshCw,
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
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState("")

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
      console.log('🔍 Buscando dados do dashboard via sistema híbrido...')

      // Usar nova API com Google Sheets como principal
      const dashboardResponse = await fetch('/api/sheets-primary/dashboard')
      const dashboardResult = await dashboardResponse.json()

      if (dashboardResult.ok) {
        console.log('📊 Dados do dashboard recebidos:', dashboardResult.data)
        console.log('🔄 Fonte dos dados:', dashboardResult.source)
        
        const statsData = dashboardResult.data
        
        setStats({
          totalReservas: statsData.reservas_hoje + statsData.reservas_pendentes || 0,
          reservasHoje: statsData.reservas_hoje || 0,
          totalClientes: statsData.clientes_ativos || 0,
          receitaMes: statsData.receita_mes || 0,
          quadrasAtivas: statsData.quadras_ativas || 0,
          professoresAtivos: 2, // Fixo por enquanto
        })
      } else {
        throw new Error(dashboardResult.error || 'Erro ao buscar dados do dashboard')
      }

    } catch (error) {
      console.error('❌ Erro ao buscar dados do dashboard:', error)
      
      // Fallback: buscar dados individuais
      try {
        console.log('🔄 Tentando fallback com APIs individuais...')
        
        const [reservasResponse, clientesResponse, quadrasResponse] = await Promise.all([
          fetch('/api/sheets-primary/reservas'),
          fetch('/api/sheets-primary/clientes'),
          fetch('/api/sheets-primary/quadras')
        ])

        const [reservasResult, clientesResult, quadrasResult] = await Promise.all([
          reservasResponse.json(),
          clientesResponse.json(),
          quadrasResponse.json()
        ])

        // Processar dados das APIs
        const reservas = reservasResult.ok ? reservasResult.data || [] : []
        const clientes = clientesResult.ok ? clientesResult.data || [] : []
        const quadras = quadrasResult.ok ? quadrasResult.data || [] : []

        // Calcular estatísticas
        const hoje = new Date().toISOString().split('T')[0]
        const reservasHoje = reservas.filter((r: any) => {
          const dataReserva = new Date(r.data_inicio).toISOString().split('T')[0]
          return dataReserva === hoje
        }).length

        const receitaMes = reservas.reduce((total: number, r: any) => {
          const valor = parseFloat(r.valor_total || 0)
          return total + (isNaN(valor) ? 0 : valor)
        }, 0)

        setStats({
          totalReservas: reservas.length,
          reservasHoje,
          totalClientes: clientes.length,
          receitaMes,
          quadrasAtivas: quadras.filter((q: any) => q.ativo).length,
          professoresAtivos: 2,
        })
        
        console.log('✅ Fallback executado com sucesso')
        
      } catch (fallbackError) {
        console.error('❌ Erro no fallback:', fallbackError)
        
        // Último recurso: dados mockados
        setStats({
          totalReservas: 5,
          reservasHoje: 2,
          totalClientes: 5,
          receitaMes: 480,
          quadrasAtivas: 3,
          professoresAtivos: 2,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para sincronizar dados
  const handleSync = async () => {
    setSyncing(true)
    setSyncMessage("Sincronizando dados...")
    
    try {
      console.log('🔄 Iniciando sincronização via API híbrida...')
      
      // Usar nova API de sincronização
      const syncResponse = await fetch('/api/sheets-primary/sync', {
        method: 'POST'
      })
      
      const syncResult = await syncResponse.json()
      
      if (syncResult.ok) {
        console.log('✅ Sincronização bem-sucedida:', syncResult.message)
        
        // Recarregar dados do dashboard
        await fetchDashboardData()
        
        setSyncMessage("✅ Sincronização concluída! Dados atualizados.")
      } else {
        throw new Error(syncResult.error || 'Erro na sincronização')
      }
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSyncMessage("")
      }, 3000)
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
      setSyncMessage("❌ Erro na sincronização. Tente novamente.")
      setTimeout(() => {
        setSyncMessage("")
      }, 3000)
    } finally {
      setSyncing(false)
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
            onClick={handleSync}
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
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

      {/* Mensagem de Sincronização */}
      {syncMessage && (
        <div className={`p-4 rounded-lg text-center ${
          syncMessage.includes('✅') 
            ? 'bg-green-900/20 border border-green-800 text-green-300' 
            : 'bg-red-900/20 border border-red-800 text-red-300'
        }`}>
          {syncMessage}
        </div>
      )}

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
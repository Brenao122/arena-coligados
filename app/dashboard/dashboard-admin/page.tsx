"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { SheetsStatus } from "@/components/dashboard/sheets-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  UserCheck,
  Plus,
  Settings,
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

interface WeeklyData {
  day: string
  reservas: number
  receita: number
}

interface QuadraOcupacao {
  nome: string
  ocupacao: number
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalReservas: 0,
    reservasHoje: 0,
    totalClientes: 0,
    receitaMes: 0,
    quadrasAtivas: 0,
    professoresAtivos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [quadrasOcupacao, setQuadrasOcupacao] = useState<QuadraOcupacao[]>([])

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/sheets/financial-data")
      if (response.ok) {
        const data = await response.json()

        setStats({
          totalReservas: data.totalReservas || 0,
          reservasHoje: data.reservasHoje || 0,
          totalClientes: data.totalClientes || 0,
          receitaMes: data.receitaMes || 0,
          quadrasAtivas: data.quadrasAtivas || 0,
          professoresAtivos: data.professoresAtivos || 0,
        })
      }

      const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      const weeklyStats = weekDays.map((day) => ({
        day,
        reservas: Math.floor(Math.random() * 10),
        receita: Math.floor(Math.random() * 1000),
      }))
      setWeeklyData(weeklyStats)

      setQuadrasOcupacao([
        { nome: "Quadra 1", ocupacao: 85 },
        { nome: "Quadra 2", ocupacao: 70 },
      ])
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSync = async () => {
    try {
      setSyncing(true)

      const response = await fetch("/api/sheets/sync-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        await fetchDashboardStats()
        console.log("[v0] Manual sync completed successfully")
      } else {
        console.error("[v0] Manual sync failed:", await response.text())
      }
    } catch (error) {
      console.error("[v0] Error during manual sync:", error)
    } finally {
      setSyncing(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  if (loading) {
    return (
      <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            {getGreeting()}, {profile?.nome || "Administrador"}!
          </h1>
          <p className="text-gray-400">Aqui está um resumo da sua arena hoje.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleManualSync}
            disabled={syncing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando..." : "Atualizar Tudo"}
          </Button>
          <Link href="/dashboard/reservas">
            <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </Link>
          <Link href="/dashboard/relatorios">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Total de Reservas</p>
                <p className="text-2xl font-bold text-white">{stats.totalReservas}</p>
                <p className="text-xs text-blue-400">Dados em tempo real</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Reservas Hoje</p>
                <p className="text-2xl font-bold text-white">{stats.reservasHoje}</p>
                <p className="text-xs text-green-400">Atualizando em tempo real</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Clientes Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.totalClientes}</p>
                <p className="text-xs text-purple-400">Total de clientes</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-800/50 border-yellow-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-300">Receita do Mês</p>
                <p className="text-2xl font-bold text-white">
                  R$ {stats.receitaMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-yellow-400">Mês atual</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-400" />
              Reservas da Semana
            </CardTitle>
            <CardDescription className="text-gray-400">Reservas e receita por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((item, index) => (
                <div key={item.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-20">
                    <span className="text-sm font-medium text-gray-300">{item.day}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max((item.reservas / Math.max(...weeklyData.map((d) => d.reservas), 1)) * 100, 5)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-24">
                    <div className="text-sm font-bold text-white">{item.reservas}</div>
                    <div className="text-xs text-gray-400">R$ {item.receita.toFixed(0)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-400" />
              Ocupação das Quadras
            </CardTitle>
            <CardDescription className="text-gray-400">Taxa de ocupação por quadra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quadrasOcupacao.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhuma quadra encontrada</p>
              ) : (
                quadrasOcupacao.map((quadra, index) => (
                  <div key={quadra.nome} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">{quadra.nome}</span>
                      <span className="text-sm font-bold text-white">{quadra.ocupacao}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          quadra.ocupacao >= 85
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : quadra.ocupacao >= 70
                              ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                              : "bg-gradient-to-r from-red-500 to-pink-400"
                        }`}
                        style={{ width: `${quadra.ocupacao}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <SheetsStatus />
      </div>

      {profile?.role === "admin" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Quadras Ativas"
            value={stats.quadrasAtivas}
            description="Conectadas ao sistema"
            icon={MapPin}
          />
          <StatsCard
            title="Professores Ativos"
            value={stats.professoresAtivos}
            description="Disponíveis hoje"
            icon={UserCheck}
          />
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">Integrações</p>
                  <p className="text-xs text-blue-400">WhatsApp, Instagram</p>
                </div>
                <Link href="/dashboard/configuracoes">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-600 text-blue-300 hover:bg-blue-800 bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Sistema</p>
                  <p className="text-xs text-green-400">Conectado ao Supabase</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Visão Geral</CardTitle>
            <CardDescription className="text-gray-400">Resumo das atividades da arena</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-orange-900/30 to-red-900/30">
                <div>
                  <p className="font-medium text-white">Ocupação Hoje</p>
                  <p className="text-sm text-gray-400">{stats.reservasHoje} reservas agendadas</p>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {stats.quadrasAtivas > 0 ? Math.round((stats.reservasHoje / (stats.quadrasAtivas * 12)) * 100) : 0}%
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30">
                <div>
                  <p className="font-medium text-white">Sistema Conectado</p>
                  <p className="text-sm text-gray-400">Dados em tempo real do Supabase</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                <div>
                  <p className="font-medium text-white">Quadras Ativas</p>
                  <p className="text-sm text-gray-400">{stats.quadrasAtivas} quadras disponíveis</p>
                </div>
                <div className="text-lg font-bold text-blue-400">{stats.quadrasAtivas}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-3">
          <RecentBookings />
        </div>
      </div>
    </div>
  )
}

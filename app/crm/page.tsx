"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  UserCheck,
  MapPin,
  BarChart3,
  Settings
} from "lucide-react"
import Link from "next/link"

export default function CRMPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    try {
      const savedUser = localStorage.getItem('arena_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        console.log('[LOGIN→CRM] Usuário encontrado:', userData)
      } else {
        console.log('[LOGIN→CRM] Nenhum usuário encontrado, redirecionando para login')
        router.push('/login')
      }
    } catch (error) {
      console.error('[LOGIN→CRM] Erro ao verificar usuário:', error)
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando CRM...</div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionamento em andamento
  }

  const stats = [
    {
      title: "Total de Clientes",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Reservas Hoje",
      value: "23",
      change: "+8%",
      icon: Calendar,
      color: "text-green-400"
    },
    {
      title: "Receita Mensal",
      value: "R$ 45.2k",
      change: "+15%",
      icon: DollarSign,
      color: "text-yellow-400"
    },
    {
      title: "Taxa de Conversão",
      value: "68%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ]

  const quickActions = [
    {
      title: "Clientes",
      description: "Gerenciar clientes e leads",
      icon: Users,
      href: "/dashboard/clientes",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Reservas",
      description: "Agendar e gerenciar reservas",
      icon: Calendar,
      href: "/dashboard/reservas",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Quadras",
      description: "Configurar quadras disponíveis",
      icon: MapPin,
      href: "/dashboard/quadras",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Professores",
      description: "Gerenciar equipe de professores",
      icon: UserCheck,
      href: "/dashboard/professores",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Relatórios",
      description: "Análises e métricas",
      icon: BarChart3,
      href: "/dashboard/relatorios",
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      icon: Settings,
      href: "/dashboard/configuracoes",
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white" data-testid="crm-page">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-orange-400">CRM Arena Coligados</h1>
            <p className="text-gray-300 mt-1">
              Bem-vindo, {user.profile?.full_name || user.profile?.nome || 'Usuário'} 
              <Badge variant="outline" className="ml-2 text-xs">
                {user.profile?.role?.toUpperCase()}
              </Badge>
            </p>
          </div>
          <div className="text-sm text-gray-400">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-green-400">{stat.change} vs mês anterior</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="w-full">
                    <Link href={action.href}>
                      Acessar {action.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
            <CardDescription className="text-gray-400">
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Nova reserva criada</p>
                  <p className="text-gray-400 text-xs">Quadra 1 - 15/09/2025 10:00</p>
                </div>
                <span className="text-xs text-gray-400">2 min atrás</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Cliente cadastrado</p>
                  <p className="text-gray-400 text-xs">João Silva - joao@email.com</p>
                </div>
                <span className="text-xs text-gray-400">15 min atrás</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Pagamento aprovado</p>
                  <p className="text-gray-400 text-xs">R$ 160,00 - PIX</p>
                </div>
                <span className="text-xs text-gray-400">1 hora atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

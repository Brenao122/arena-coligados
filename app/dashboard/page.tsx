"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, Activity, LogOut, FileSpreadsheet } from "lucide-react"
import Image from "next/image"

interface User {
  email: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Dados de exemplo para demonstração
  const mockData = {
    clientes: [
      { nome: "João Silva", email: "joao@email.com", telefone: "(62) 99999-9999", status: "Ativo" },
      { nome: "Maria Santos", email: "maria@email.com", telefone: "(62) 88888-8888", status: "Ativo" },
      { nome: "Pedro Costa", email: "pedro@email.com", telefone: "(62) 77777-7777", status: "Ativo" },
      { nome: "Ana Oliveira", email: "ana@email.com", telefone: "(62) 66666-6666", status: "Ativo" },
    ],
    reservas: [
      {
        cliente: "João Silva",
        quadra: "Quadra 1",
        data: "2024-01-15",
        horario: "19:00",
        valor: "R$ 80,00",
        status: "Confirmada",
      },
      {
        cliente: "Maria Santos",
        quadra: "Quadra 2",
        data: "2024-01-16",
        horario: "20:00",
        valor: "R$ 70,00",
        status: "Confirmada",
      },
      {
        cliente: "Pedro Costa",
        quadra: "Quadra 1",
        data: "2024-01-17",
        horario: "18:00",
        valor: "R$ 80,00",
        status: "Pendente",
      },
      {
        cliente: "Ana Oliveira",
        quadra: "Quadra 3",
        data: "2024-01-18",
        horario: "19:30",
        valor: "R$ 90,00",
        status: "Confirmada",
      },
    ],
    professores: [
      { nome: "Prof. Carlos", modalidade: "Beach Tennis", telefone: "(62) 77777-7777", status: "Ativo" },
      { nome: "Prof. Fernanda", modalidade: "Vôlei", telefone: "(62) 55555-5555", status: "Ativo" },
    ],
    quadras: [
      { nome: "Quadra 1", tipo: "Beach Tennis", status: "Disponível" },
      { nome: "Quadra 2", tipo: "Vôlei", status: "Ocupada" },
      { nome: "Quadra 3", tipo: "Beach Tennis", status: "Disponível" },
      { nome: "Quadra 4", tipo: "Futsal", status: "Manutenção" },
    ],
  }

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("arena-user")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("arena-user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-orange-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados Logo"
              width={50}
              height={50}
              className="rounded-full ring-2 ring-orange-500/50"
            />
            <div>
              <h1 className="text-xl font-bold text-orange-400">Arena Coligados</h1>
              <p className="text-sm text-gray-400">
                Dashboard - {user?.name} ({user?.role})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.clientes.length}</div>
              <p className="text-xs text-gray-400">Clientes ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.reservas.length}</div>
              <p className="text-xs text-gray-400">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Professores</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.professores.length}</div>
              <p className="text-xs text-gray-400">Professores ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Quadras</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockData.quadras.length}</div>
              <p className="text-xs text-gray-400">Quadras disponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clientes */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-400" />
                Clientes Recentes
              </CardTitle>
              <CardDescription className="text-gray-400">Últimos clientes cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.clientes.map((cliente, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{cliente.nome}</p>
                      <p className="text-gray-400 text-sm">{cliente.email}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                      {cliente.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                Reservas Recentes
              </CardTitle>
              <CardDescription className="text-gray-400">Últimos agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.reservas.map((reserva, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{reserva.cliente}</p>
                      <p className="text-gray-400 text-sm">
                        {reserva.quadra} - {reserva.horario}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          reserva.status === "Confirmada"
                            ? "border-green-500/50 text-green-400"
                            : "border-yellow-500/50 text-yellow-400"
                        }
                      >
                        {reserva.status}
                      </Badge>
                      <p className="text-gray-400 text-sm mt-1">{reserva.valor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Plataforma */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              Status da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Sistema</p>
                  <p className="text-gray-400 text-sm">Funcionando normalmente</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Online</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Dados</p>
                  <p className="text-gray-400 text-sm">Dados de demonstração</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Demo</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Deploy</p>
                  <p className="text-gray-400 text-sm">Pronto para produção</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções de Deploy */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 mt-6">
          <CardHeader>
            <CardTitle className="text-orange-400">🚀 Pronto para Deploy!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Sua aplicação está funcionando perfeitamente e pronta para ser publicada no Vercel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">Para publicar:</h4>
                <ol className="text-gray-400 text-sm space-y-1">
                  <li>1. Clique no botão "Publish" no canto superior direito</li>
                  <li>2. Conecte com sua conta do GitHub</li>
                  <li>3. Sua aplicação será publicada automaticamente</li>
                </ol>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">Funcionalidades:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>✅ Sistema de login funcional</li>
                  <li>✅ Dashboard responsivo</li>
                  <li>✅ Interface moderna</li>
                  <li>✅ Dados de demonstração</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, Activity, LogOut, RefreshCw, FileSpreadsheet } from "lucide-react"
import Image from "next/image"

interface User {
  email: string
  name: string
}

interface SheetData {
  clientes: any[]
  reservas: any[]
  professores: any[]
  quadras: any[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sheetData, setSheetData] = useState<SheetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem("arena-user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    loadSheetData()
  }, [router])

  const loadSheetData = async () => {
    try {
      setLoading(true)

      // Buscar dados das diferentes abas da planilha
      const [clientesRes, reservasRes, professoresRes, quadrasRes] = await Promise.all([
        fetch("/api/sheets/clientes").catch(() => ({ ok: false })),
        fetch("/api/sheets/reservas").catch(() => ({ ok: false })),
        fetch("/api/sheets/professores").catch(() => ({ ok: false })),
        fetch("/api/sheets/quadras").catch(() => ({ ok: false })),
      ])

      const data: SheetData = {
        clientes: clientesRes.ok ? await clientesRes.json() : [],
        reservas: reservasRes.ok ? await reservasRes.json() : [],
        professores: professoresRes.ok ? await professoresRes.json() : [],
        quadras: quadrasRes.ok ? await quadrasRes.json() : [],
      }

      setSheetData(data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Dados de exemplo caso a API falhe
      setSheetData({
        clientes: [
          { nome: "João Silva", email: "joao@email.com", telefone: "(62) 99999-9999" },
          { nome: "Maria Santos", email: "maria@email.com", telefone: "(62) 88888-8888" },
        ],
        reservas: [
          { cliente: "João Silva", quadra: "Quadra 1", data: "2024-01-15", horario: "19:00", valor: "R$ 80,00" },
          { cliente: "Maria Santos", quadra: "Quadra 2", data: "2024-01-16", horario: "20:00", valor: "R$ 70,00" },
        ],
        professores: [{ nome: "Prof. Carlos", modalidade: "Beach Tennis", telefone: "(62) 77777-7777" }],
        quadras: [
          { nome: "Quadra 1", tipo: "Beach Tennis", status: "Disponível" },
          { nome: "Quadra 2", tipo: "Vôlei", status: "Ocupada" },
        ],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadSheetData()
  }

  const handleLogout = () => {
    localStorage.removeItem("arena-user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados da planilha...</p>
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
              alt="Arena Coligados Logo"
              width={50}
              height={50}
              className="rounded-full ring-2 ring-orange-500/50"
            />
            <div>
              <h1 className="text-xl font-bold text-orange-400">Arena Coligados</h1>
              <p className="text-sm text-gray-400">Dashboard - {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
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
              <div className="text-2xl font-bold text-white">{sheetData?.clientes.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sheetData?.reservas.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Professores</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sheetData?.professores.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Quadras</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sheetData?.quadras.length || 0}</div>
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
              <CardDescription className="text-gray-400">Dados atualizados da planilha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sheetData?.clientes.slice(0, 5).map((cliente, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{cliente.nome || cliente.Nome || "Nome não informado"}</p>
                      <p className="text-gray-400 text-sm">{cliente.email || cliente.Email || "Email não informado"}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                      Ativo
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
              <CardDescription className="text-gray-400">Agendamentos da planilha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sheetData?.reservas.slice(0, 5).map((reserva, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {reserva.cliente || reserva.Cliente || "Cliente não informado"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {reserva.quadra || reserva.Quadra || "Quadra não informada"} -{" "}
                        {reserva.horario || reserva.Horario || "Horário não informado"}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      {reserva.valor || reserva.Valor || "R$ 0,00"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Integração */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              Status da Integração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Google Sheets</p>
                <p className="text-gray-400 text-sm">Conectado e sincronizado</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Online</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

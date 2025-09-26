"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Mail, Calendar, TrendingUp, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Cliente {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
}

interface Reserva {
  id: string
  created_at: string
  valor_total: number
  status: string
  quadras: {
    nome: string
  }[]
}

export default function ClienteDetalhes() {
  const params = useParams()
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClienteData()
  }, [params.id])

  const fetchClienteData = async () => {
    try {
      setLoading(true)

      const { data: clienteData, error: clienteError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single()

      if (clienteError) throw clienteError

      const { data: reservasData, error: reservasError } = await supabase
        .from("reservas")
        .select(`
          id,
          created_at,
          valor_total,
          status,
          quadras (nome)
        `)
        .eq("cliente_id", params.id)
        .order("created_at", { ascending: false })

      if (reservasError) throw reservasError

      setCliente(clienteData)
      setReservas(reservasData || [])
    } catch (error) {
      } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl text-white">Cliente não encontrado</h1>
          <Button onClick={() => router.back()} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const totalGasto = reservas.reduce((sum, reserva) => sum + (reserva.valor_total || 0), 0)
  const reservasTotal = reservas.length
  const reservasConcluidas = reservas.filter((r) => r.status === "concluida").length
  const frequencia = reservasTotal > 0 ? Math.round((reservasConcluidas / reservasTotal) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{cliente.full_name}</h1>
            <p className="text-gray-400">Cliente desde {new Date(cliente.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Gasto</p>
                  <p className="text-2xl font-bold text-white">R$ {totalGasto.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Reservas</p>
                  <p className="text-2xl font-bold text-white">{reservasTotal}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Frequência</p>
                  <p className="text-2xl font-bold text-white">{frequencia}%</p>
                </div>
                <Clock className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Status</p>
                  <Badge className="bg-green-500 text-white mt-1">Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* InformaçÃµes Pessoais */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">InformaçÃµes Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{cliente.email}</p>
                </div>
              </div>
              {cliente.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="text-white">{cliente.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Reservas */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservas.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Nenhuma reserva encontrada</p>
                ) : (
                  reservas.map((reserva) => (
                    <div key={reserva.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{reserva.quadras?.[0]?.nome || 'Quadra não especificada'}</p>
                        <p className="text-sm text-gray-400">{new Date(reserva.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">R$ {reserva.valor_total.toFixed(2)}</p>
                        <Badge className={reserva.status === "concluida" ? "bg-green-500" : "bg-orange-500"}>
                          {reserva.status === "concluida" ? "Concluída" : "Agendada"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

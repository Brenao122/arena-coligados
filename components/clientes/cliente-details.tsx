"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Cliente {
  id: string
  full_name: string
  email?: string
  phone?: string
}

interface Reserva {
  id: string
  data_inicio: string
  data_fim: string
  tipo: string
  status: string
  valor: number
  observacoes: string
  profiles: {
    full_name: string
    email: string
  }
  quadras: {
    nome: string
    tipo: string
  }
  professores?: {
    profiles: {
      full_name: string
    }
  }
}

interface ClienteDetailsProps {
  clienteId: string
  onBack: () => void
}

export function ClienteDetails({ clienteId, onBack }: ClienteDetailsProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReservas: 0,
    totalGasto: 0,
    reservasPendentes: 0,
    ultimaReserva: null as string | null,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClienteDetails()
  }, [clienteId])

  const fetchClienteDetails = async () => {
    try {
      setLoading(true)

      // Buscar dados da planilha N8N via API
      const response = await fetch('/api/sheets/read?sheet=Página1')
      const result = await response.json()
      
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao buscar dados')
      }

      const dados = result.rows || []
      
      // Encontrar cliente pelo ID (usando telefone como ID temporário)
      const clienteEncontrado = dados.find((item: any) => 
        item.Telefone === clienteId || item.Nome === clienteId
      )
      
      if (clienteEncontrado) {
        setCliente({
          id: clienteEncontrado.Telefone,
          full_name: clienteEncontrado.Nome,
          email: clienteEncontrado.Email,
          phone: clienteEncontrado.Telefone
        })
      }

      // Filtrar reservas do cliente
      const reservasCliente = dados.filter((item: any) => 
        item.Telefone === clienteId || item.Nome === clienteId
      )

      const transformedReservas = reservasCliente.map((reserva: any) => ({
        id: reserva.Telefone + '_' + reserva.Data,
        data_inicio: reserva.Data || new Date().toISOString(),
        data_fim: reserva.Data || new Date().toISOString(),
        tipo: reserva.Serviço || 'Reserva',
        status: reserva.Status || 'Pendente',
        valor: 0,
        observacoes: '',
        profiles: { full_name: reserva.Nome, email: reserva.Email },
        quadras: { nome: 'Quadra N8N', tipo: 'N8N' },
        professores: { profiles: { full_name: 'Professor N8N' } },
      }))

      setReservas(transformedReservas)

      // Calcular estatísticas
      const totalReservas = transformedReservas.length
      const totalGasto = transformedReservas.reduce((sum: number, r: any) => sum + r.valor, 0)
      const reservasPendentes = transformedReservas.filter((r: any) => r.status === 'Pendente').length
      const ultimaReserva = transformedReservas.length > 0 ? transformedReservas[0].data_inicio : null

      setStats({
        totalReservas,
        totalGasto,
        reservasPendentes,
        ultimaReserva
      })

    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error)
      setError('Erro ao carregar dados do cliente')
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      case "concluida":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Erro</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">Cliente com ID {clienteId} não foi encontrado.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{cliente.full_name}</h1>
          <p className="text-gray-600">{cliente.email}</p>
          <p className="text-gray-600">{cliente.phone}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Reservas</p>
                <p className="text-2xl font-bold">{stats.totalReservas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold">R$ {stats.totalGasto.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{stats.reservasPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Última Reserva</p>
                <p className="text-sm font-medium">
                  {stats.ultimaReserva 
                    ? format(new Date(stats.ultimaReserva), "dd/MM/yyyy", { locale: ptBR })
                    : "Nenhuma"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reservas</CardTitle>
          <CardDescription>Reservas realizadas por este cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {reservas.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Nenhuma reserva encontrada</p>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{reserva.profiles.full_name}</h4>
                      <Badge className={getStatusColor(reserva.status)}>
                        {reserva.status}
                      </Badge>
                      <Badge variant="secondary">
                        {reserva.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📅 {format(new Date(reserva.data_inicio), "dd/MM/yyyy", { locale: ptBR })}</span>
                      <span>🏟️ {reserva.quadras.nome}</span>
                      <span>👨‍🏫 {reserva.professores?.profiles.full_name || "Sem professor"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {reserva.valor.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

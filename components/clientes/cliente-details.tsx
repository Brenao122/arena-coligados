"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowLeft, Calendar, DollarSign, MapPin, Phone, Mail, User } from "lucide-react"
import { detectReservasSchema } from "@/lib/supabase/schema-detector"
import { handleDatabaseError } from "@/lib/supabase/error-handler"

interface ClienteDetailsProps {
  clienteId: string
  onBack: () => void
}

interface Cliente {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
}

interface Reserva {
  id: string
  data_inicio: string
  data_fim: string
  tipo: string
  status: string
  valor: number
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

      // Fetch client info
      const { data: clienteData, error: clienteError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clienteId)
        .single()

      if (clienteError) throw clienteError
      setCliente(clienteData)

      const schema = await detectReservasSchema()

      const query = supabase
        .from("reservas")
        .select(`
          id,
          ${schema === "tstzrange" ? "duracao" : "data_inicio, data_fim"},
          tipo,
          status,
          valor_total,
          quadras:quadra_id (nome, tipo),
          professores:professor_id (
            profiles:profile_id (full_name)
          )
        `)
        .eq("cliente_id", clienteId)
        .order(schema === "tstzrange" ? "duracao" : "data_inicio", { ascending: false })

      const { data: reservasData, error: reservasError } = await query

      if (reservasError) throw reservasError

      const transformedReservas = (reservasData || []).map((reserva: any) => {
        let dataInicio = new Date().toISOString()
        let dataFim = new Date().toISOString()

        if (schema === "tstzrange" && reserva.duracao) {
          try {
            const duracaoStr = reserva.duracao.toString()
            const match = duracaoStr.match(/\["([^"]+)","([^"]+)"\)/) || duracaoStr.match(/\[([^,]+),([^)]+)\)/)

            if (match) {
              dataInicio = new Date(match[1].replace(/"/g, "")).toISOString()
              dataFim = new Date(match[2].replace(/"/g, "")).toISOString()
            }
          } catch (error) {
            console.error("Erro ao parsear duracao:", error)
          }
        } else if (reserva.data_inicio && reserva.data_fim) {
          dataInicio = reserva.data_inicio
          dataFim = reserva.data_fim
        }

        return {
          ...reserva,
          data_inicio: dataInicio,
          data_fim: dataFim,
          valor: reserva.valor_total || reserva.valor || 0,
        }
      })

      setReservas(transformedReservas)

      // Calculate stats
      const totalReservas = transformedReservas.length
      const totalGasto = transformedReservas.reduce((sum, r) => sum + r.valor, 0)
      const reservasPendentes = transformedReservas.filter((r) => r.status === "pendente").length
      const ultimaReserva = transformedReservas[0]?.data_inicio || null

      setStats({
        totalReservas,
        totalGasto,
        reservasPendentes,
        ultimaReserva,
      })
    } catch (error) {
      console.error("Error fetching cliente details:", error)
      const dbError = handleDatabaseError(error)
      setError(dbError.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cliente não encontrado</p>
        <Button onClick={onBack} className="mt-4">
          Voltar
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <Button onClick={onBack} className="mt-4">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cliente.full_name}</h1>
          <p className="text-muted-foreground">Detalhes do cliente</p>
        </div>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{cliente.phone || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente desde</p>
                <p className="font-medium">
                  {format(new Date(cliente.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total gasto</p>
                <p className="font-medium text-brand-primary">R$ {stats.totalGasto.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Reservas</p>
                <p className="text-2xl font-bold">{stats.totalReservas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold">R$ {stats.totalGasto.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.reservasPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Última Reserva</p>
                <p className="text-sm font-bold">
                  {stats.ultimaReserva
                    ? format(new Date(stats.ultimaReserva), "dd/MM/yyyy", { locale: ptBR })
                    : "Nunca"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reservas</CardTitle>
          <CardDescription>Todas as reservas realizadas pelo cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {reservas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reserva encontrada</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Quadra</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(reserva.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(reserva.data_inicio), "HH:mm", { locale: ptBR })} -{" "}
                            {format(new Date(reserva.data_fim), "HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reserva.quadras?.nome}</p>
                          <p className="text-sm text-muted-foreground capitalize">{reserva.quadras?.tipo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {reserva.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reserva.professores ? (
                          <p className="text-sm">{reserva.professores.profiles?.full_name}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">-</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reserva.status)}>{reserva.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">R$ {reserva.valor.toFixed(2)}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

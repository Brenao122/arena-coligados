"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2, Search } from "lucide-react"
import { detectReservasSchema } from "@/lib/supabase/schema-detector"
import { handleDatabaseError } from "@/lib/supabase/error-handler"

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

interface ReservasListProps {
  onEdit: (reservaId: string) => void
  refresh: boolean
}

export function ReservasList({ onEdit, refresh }: ReservasListProps) {
  const { profile } = useAuth()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tipoFilter, setTipoFilter] = useState("all")

  useEffect(() => {
    fetchReservas()
  }, [refresh])

  const fetchReservas = async () => {
    try {
      setLoading(true)
      const supabase = getBrowserClient()

      const schema = await detectReservasSchema()

      let query = supabase
        .from("reservas")
        .select(`
          id,
          ${schema === "tstzrange" ? "duracao" : "data_inicio, data_fim"},
          tipo,
          status,
          ${schema === "tstzrange" ? "valor_total" : "valor"},
          observacoes,
          profiles:cliente_id (full_name, email),
          quadras:quadra_id (nome, tipo),
          professores:professor_id (
            profiles:profile_id (full_name)
          )
        `)
        .order(schema === "tstzrange" ? "duracao" : "data_inicio", { ascending: false })

      if (profile?.role === "cliente") {
        query = query.eq("cliente_id", profile.id)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching reservas:", error)
        setReservas([])
      } else {
        const transformedReservas = (data || []).map((reserva: any) => {
          let dataInicio = new Date().toISOString()
          let dataFim = new Date().toISOString()

          if (schema === "tstzrange" && reserva.duracao) {
            try {
              const duracaoStr = reserva.duracao.toString()
              const match = duracaoStr.match(/\["([^"]+)","([^"]+)"\]/) || duracaoStr.match(/\[([^,]+),([^)]+)\]/)

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
      }
    } catch (error) {
      console.error("Error fetching reservas:", error)
      const dbError = handleDatabaseError(error)
      console.error("Database error:", dbError.message)
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reservaId: string, newStatus: string) => {
    try {
      const supabase = getBrowserClient()
      const { error } = await supabase.from("reservas").update({ status: newStatus }).eq("id", reservaId)

      if (error) throw error
      fetchReservas()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDelete = async (reservaId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta reserva?")) return

    try {
      const supabase = getBrowserClient()
      const { error } = await supabase.from("reservas").delete().eq("id", reservaId)

      if (error) throw error
      fetchReservas()
    } catch (error) {
      console.error("Error deleting reserva:", error)
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

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.quadras?.nome.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reserva.status === statusFilter
    const matchesTipo = tipoFilter === "all" || reserva.tipo === tipoFilter

    return matchesSearch && matchesStatus && matchesTipo
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
        <CardDescription>Gerencie todas as reservas da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou quadra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="Locação">Locação</SelectItem>
              <SelectItem value="Aula Experimental">Aula Experimental</SelectItem>
              <SelectItem value="Aula Particular">Aula Particular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Quadra</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                {(profile?.role === "admin" || profile?.role === "professor") && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma reserva encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reserva.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{reserva.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reserva.quadras?.nome}</p>
                        <p className="text-sm text-muted-foreground capitalize">{reserva.quadras?.tipo}</p>
                      </div>
                    </TableCell>
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
                      <Badge variant="secondary" className="capitalize">
                        {reserva.tipo}
                      </Badge>
                      {reserva.professores && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Prof: {reserva.professores.profiles?.full_name}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile?.role === "admin" ? (
                        <Select value={reserva.status} onValueChange={(value) => handleStatusChange(reserva.id, value)}>
                          <SelectTrigger className="w-[120px]">
                            <Badge className={getStatusColor(reserva.status)}>{reserva.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmada">Confirmada</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getStatusColor(reserva.status)}>{reserva.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">R$ {reserva.valor.toFixed(2)}</p>
                    </TableCell>
                    {(profile?.role === "admin" || profile?.role === "professor") && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onEdit(reserva.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {profile?.role === "admin" && (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(reserva.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

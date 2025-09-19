"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Removido import direto do repo - será usado via API
import { useAuth } from "@/hooks/use-auth-simple"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2, Search } from "lucide-react"

interface ReservaCompleta {
  id: string
  cliente_id: string
  quadra_id: string
  professor_id?: string
  data_inicio: string
  data_fim: string
  tipo: string
  status: string
  valor_total?: number
  observacoes?: string
  created_at?: string
  cliente_nome?: string
  quadra_nome?: string
  professor_nome?: string
}

interface ReservasListProps {
  onEdit?: (reserva: ReservaCompleta) => void
  refresh: boolean
}

export function ReservasList({ onEdit, refresh }: ReservasListProps) {
  const { profile } = useAuth()
  const [reservas, setReservas] = useState<ReservaCompleta[]>([])
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
      
      // Buscar dados de todas as planilhas via API
      const [reservasRes, clientesRes, quadrasRes, professoresRes] = await Promise.all([
        fetch('/api/sheets/read?sheet=reservas'),
        fetch('/api/sheets/read?sheet=clientes'),
        fetch('/api/sheets/read?sheet=quadras'),
        fetch('/api/sheets/read?sheet=professores')
      ])

      const [reservasData, clientesData, quadrasData, professoresData] = await Promise.all([
        reservasRes.json(),
        clientesRes.json(),
        quadrasRes.json(),
        professoresRes.json()
      ])

      if (!reservasData.ok) {
        console.error('Erro ao buscar reservas:', reservasData.error)
        setReservas([])
        return
      }

      // Criar mapas para lookup rápido
      const clientesMap = new Map((clientesData.rows || []).map((c: any) => [c.id, c]))
      const quadrasMap = new Map((quadrasData.rows || []).map((q: any) => [q.id, q]))
      const professoresMap = new Map((professoresData.rows || []).map((p: any) => [p.id, p]))

      // Enriquecer reservas com dados relacionados
      const reservasCompletas = (reservasData.rows || []).map((reserva: any) => ({
        ...reserva,
        cliente_nome: (clientesMap.get(reserva.cliente_id) as any)?.nome || `Cliente ${reserva.cliente_id}`,
        quadra_nome: (quadrasMap.get(reserva.quadra_id) as any)?.nome || `Quadra ${reserva.quadra_id}`,
        professor_nome: reserva.professor_id ? 
          ((professoresMap.get(reserva.professor_id) as any)?.nome || `Professor ${reserva.professor_id}`) : 
          undefined
      }))

      setReservas(reservasCompletas)
    } catch (error) {
      console.error('Erro ao buscar reservas:', error)
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-500 text-white"
      case "confirmada":
        return "bg-green-500 text-white"
      case "cancelada":
        return "bg-red-500 text-white"
      case "concluida":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "locacao":
        return "bg-blue-500 text-white"
      case "aula":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.quadra_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.professor_nome?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatusFilter = statusFilter === "all" || reserva.status === statusFilter
    const matchesTipoFilter = tipoFilter === "all" || reserva.tipo === tipoFilter

    return matchesSearch && matchesStatusFilter && matchesTipoFilter
  })

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Gestão de Reservas</CardTitle>
        <CardDescription className="text-gray-400">Acompanhe todas as reservas da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Pendentes</p>
                  <p className="text-2xl font-bold text-white">{reservas.filter(r => r.status === "pendente").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Confirmadas</p>
                  <p className="text-2xl font-bold text-white">{reservas.filter(r => r.status === "confirmada").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Locações</p>
                  <p className="text-2xl font-bold text-white">{reservas.filter(r => r.tipo === "locacao").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-purple-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Aulas</p>
                  <p className="text-2xl font-bold text-white">{reservas.filter(r => r.tipo === "aula").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, quadra ou professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="locacao">Locação</SelectItem>
              <SelectItem value="aula">Aula</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Cliente</TableHead>
                <TableHead className="text-gray-300">Quadra</TableHead>
                <TableHead className="text-gray-300">Professor</TableHead>
                <TableHead className="text-gray-300">Data/Hora</TableHead>
                <TableHead className="text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservas.length === 0 ? (
                <TableRow className="border-gray-600">
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                    Nenhuma reserva encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id} className="border-gray-600">
                    <TableCell>
                      <p className="font-medium text-white">{reserva.cliente_nome}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-300">{reserva.quadra_nome}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-300">{reserva.professor_nome || "Sem professor"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-white">{format(new Date(reserva.data_inicio), "dd/MM/yyyy", { locale: ptBR })}</p>
                        <p className="text-gray-400">
                          {format(new Date(reserva.data_inicio), "HH:mm", { locale: ptBR })} - 
                          {format(new Date(reserva.data_fim), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(reserva.tipo)}>
                        {reserva.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reserva.status)}>
                        {reserva.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-white font-medium">
                        R$ {reserva.valor_total?.toFixed(2) || "0,00"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(reserva)}
                          className="hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-600"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2, Search } from "lucide-react"

interface Reserva {
  id: string
  data_inicio: string
  data_fim: string
  tipo: string
  status: string
  valor: number
  cliente_nome: string
  cliente_email: string
  quadra_nome: string
  quadra_tipo: string
}

interface ReservasListProps {
  onEdit: (reservaId: string) => void
  refresh: boolean
}

export function ReservasList({ onEdit, refresh }: ReservasListProps) {
  const [reservas] = useState<Reserva[]>([
    {
      id: "1",
      data_inicio: new Date().toISOString(),
      data_fim: new Date(Date.now() + 3600000).toISOString(),
      tipo: "Locação",
      status: "confirmada",
      valor: 150.0,
      cliente_nome: "João Silva",
      cliente_email: "joao@email.com",
      quadra_nome: "Quadra 1 - Futsal",
      quadra_tipo: "Futsal",
    },
    {
      id: "2",
      data_inicio: new Date(Date.now() + 86400000).toISOString(),
      data_fim: new Date(Date.now() + 90000000).toISOString(),
      tipo: "Aula",
      status: "pendente",
      valor: 120.0,
      cliente_nome: "Maria Santos",
      cliente_email: "maria@email.com",
      quadra_nome: "Quadra 2 - Beach Tennis",
      quadra_tipo: "Beach Tennis",
    },
  ])
  const [loading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tipoFilter, setTipoFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-500 text-white"
      case "pendente":
        return "bg-yellow-500 text-white"
      case "cancelada":
        return "bg-red-500 text-white"
      case "concluida":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.quadra_nome.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reserva.status === statusFilter
    const matchesTipo = tipoFilter === "all" || reserva.tipo === tipoFilter

    return matchesSearch && matchesStatus && matchesTipo
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
        <CardTitle className="text-white">Lista de Reservas</CardTitle>
        <CardDescription className="text-gray-400">Gerencie todas as reservas da arena</CardDescription>
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
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="Locação">Locação</SelectItem>
              <SelectItem value="Aula">Aula</SelectItem>
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
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Nenhuma reserva encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id} className="border-gray-600">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{reserva.cliente_nome}</p>
                        <p className="text-sm text-gray-400">{reserva.cliente_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{reserva.quadra_nome}</p>
                        <p className="text-sm text-gray-400 capitalize">{reserva.quadra_tipo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {format(new Date(reserva.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-gray-400">
                          {format(new Date(reserva.data_inicio), "HH:mm", { locale: ptBR })} -{" "}
                          {format(new Date(reserva.data_fim), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize bg-gray-600 text-white">
                        {reserva.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reserva.status)}>{reserva.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">R$ {reserva.valor.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(reserva.id)}
                          className="hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-600">
                          <Trash2 className="h-4 w-4 text-red-400" />
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

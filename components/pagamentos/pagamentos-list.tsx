"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, DollarSign, CreditCard, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pagamento {
  id: string
  reserva_id: string
  amount: number
  method: string
  status: string
  transaction_id: string | null
  paid_at: string | null
  created_at: string
  reservas: {
    cliente_id: string
    quadra_id: string
    duracao: string
    profiles: {
      full_name: string
    }
    quadras: {
      nome: string
    }
  }
}

interface PagamentosListProps {
  refresh: boolean
}

const mockPagamentos: Pagamento[] = [
  {
    id: "1",
    reserva_id: "res1",
    amount: 150.0,
    method: "pix",
    status: "aprovado",
    transaction_id: "TXN001",
    paid_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reservas: {
      cliente_id: "cli1",
      quadra_id: "q1",
      duracao: '["2025-01-10T14:00:00Z","2025-01-10T15:00:00Z")',
      profiles: { full_name: "João Silva" },
      quadras: { nome: "Quadra 1" },
    },
  },
  {
    id: "2",
    reserva_id: "res2",
    amount: 120.0,
    method: "cartao",
    status: "pendente",
    transaction_id: "TXN002",
    paid_at: null,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reservas: {
      cliente_id: "cli2",
      quadra_id: "q2",
      duracao: '["2025-01-10T16:00:00Z","2025-01-10T17:00:00Z")',
      profiles: { full_name: "Maria Santos" },
      quadras: { nome: "Quadra 2" },
    },
  },
]

export function PagamentosList({ refresh }: PagamentosListProps) {
  const { data: pagamentosData, error } = useSWR("/api/sheets/pagamentos", (url) => fetch(url).then((r) => r.json()), {
    refreshInterval: 30000, // Atualiza a cada 30 segundos
  })

  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [metodoFilter, setMetodoFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    if (pagamentosData && Array.isArray(pagamentosData) && pagamentosData.length > 0) {
      const mappedPagamentos = pagamentosData.map((row: any, index: number) => ({
        id: row.id || `pag-${index}`,
        reserva_id: row.reserva_id || "",
        amount: Number.parseFloat(row.valor || row.amount || "0"),
        method: row.metodo || row.method || "pix",
        status: row.status || "pendente",
        transaction_id: row.transaction_id || row.id_transacao || null,
        paid_at: row.paid_at || row.data_pagamento || null,
        created_at: row.created_at || row.data_criacao || new Date().toISOString(),
        reservas: {
          cliente_id: row.cliente_id || "",
          quadra_id: row.quadra_id || "",
          duracao: row.duracao || "",
          profiles: {
            full_name: row.cliente_nome || row.nome_cliente || "Cliente",
          },
          quadras: {
            nome: row.quadra_nome || row.nome_quadra || "Quadra",
          },
        },
      }))
      setPagamentos(mappedPagamentos)
      setLoading(false)
    } else if (!pagamentosData) {
      // Usar dados mock se não houver dados do Google Sheets
      setPagamentos(mockPagamentos)
      setLoading(false)
    }
  }, [pagamentosData])

  const fetchPagamentos = async () => {
    try {
      setLoading(true)
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPagamentos(mockPagamentos)
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pagamentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!pagamentosData) {
      fetchPagamentos()
    }
  }, [refresh])

  const handleStatusChange = async (pagamentoId: string, newStatus: string) => {
    try {
      // Atualizar localmente
      setPagamentos((prev) =>
        prev.map((p) =>
          p.id === pagamentoId
            ? {
                ...p,
                status: newStatus,
                paid_at: newStatus === "aprovado" ? new Date().toISOString() : null,
              }
            : p,
        ),
      )

      toast({
        title: "Sucesso",
        description: `Pagamento ${newStatus} com sucesso`,
      })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "rejeitado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "pix":
        return <Smartphone className="h-4 w-4" />
      case "cartao":
        return <CreditCard className="h-4 w-4" />
      case "dinheiro":
        return <DollarSign className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const filteredPagamentos = pagamentos.filter((pagamento) => {
    const clienteNome = pagamento.reservas?.profiles?.full_name || ""
    const quadraNome = pagamento.reservas?.quadras?.nome || ""

    const matchesSearch =
      clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quadraNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || pagamento.status === statusFilter
    const matchesMetodo = metodoFilter === "all" || pagamento.method === metodoFilter

    return matchesSearch && matchesStatus && matchesMetodo
  })

  const totalReceita = pagamentos.filter((p) => p.status === "aprovado").reduce((sum, p) => sum + p.amount, 0)
  const totalPendente = pagamentos.filter((p) => p.status === "pendente").reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Gestão de Pagamentos</CardTitle>
        <CardDescription className="text-gray-400">Acompanhe todos os pagamentos da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Receita Aprovada</p>
                  <p className="text-2xl font-bold text-green-400">R$ {totalReceita.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Pendente</p>
                  <p className="text-2xl font-bold text-yellow-400">R$ {totalPendente.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-orange-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Total de Transações</p>
                  <p className="text-2xl font-bold text-white">{pagamentos.length}</p>
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
                placeholder="Buscar por cliente, quadra ou ID da transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metodoFilter} onValueChange={setMetodoFilter}>
            <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Todos Métodos</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Cliente</TableHead>
                <TableHead className="text-gray-300">Reserva</TableHead>
                <TableHead className="text-gray-300">Método</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">ID Transação</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id} className="border-gray-700">
                    <TableCell>
                      <p className="font-medium text-white">{pagamento.reservas?.profiles?.full_name || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{pagamento.reservas?.quadras?.nome || "N/A"}</p>
                        <p className="text-sm text-gray-400">
                          {pagamento.reservas?.duracao
                            ? (() => {
                                try {
                                  const duracaoStr = pagamento.reservas.duracao.toString()
                                  const match = duracaoStr.match(/\["([^"]+)","([^"]+)"\)/)
                                  if (match) {
                                    const startDate = new Date(match[1])
                                    return format(startDate, "dd/MM/yyyy HH:mm", { locale: ptBR })
                                  }
                                  return "Data inválida"
                                } catch {
                                  return "Data inválida"
                                }
                              })()
                            : "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMetodoIcon(pagamento.method)}
                        <Badge variant="outline" className="capitalize border-gray-600 text-gray-300">
                          {pagamento.method}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">R$ {pagamento.amount.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(pagamento.status)}>{pagamento.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">
                        {format(new Date(pagamento.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-mono text-gray-300">{pagamento.transaction_id || "-"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {pagamento.status === "pendente" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(pagamento.id, "aprovado")}
                              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(pagamento.id, "rejeitado")}
                              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-black"
                            >
                              Recusar
                            </Button>
                          </>
                        )}
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

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, DollarSign, CreditCard, Smartphone } from "lucide-react"
// Migrado para Google Sheets
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

export function PagamentosList({ refresh }: PagamentosListProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [metodoFilter, setMetodoFilter] = useState("all")
  const { toast } = useToast()

  const fetchPagamentos = async () => {
    try {
      setLoading(true)
      // Buscar dados de pagamentos do Google Sheets (usando reservas como base)
      const response = await fetch('/api/sheets/read?sheet=Reservas')
      const result = await response.json()
      
      if (!result.ok) throw new Error('Erro ao buscar pagamentos')
      
      const reservas = result.values?.slice(1) || []
      const pagamentos = reservas
        .filter((r: any[]) => r[8] && parseFloat(r[8]) > 0) // apenas reservas com valor
        .map((r: any[]): Pagamento => ({
          id: r[0] || '',
          reserva_id: r[0] || '',
          amount: parseFloat(r[8]) || 0, // valor_total
          method: r[9] || 'pix', // método de pagamento (assumindo coluna 9)
          status: r[7] === 'concluida' ? 'aprovado' : 'pendente', // status
          transaction_id: r[10] || null, // transaction_id (assumindo coluna 10)
          paid_at: r[7] === 'concluida' ? r[4] : null, // data_inicio se concluida
          created_at: r[4] || new Date().toISOString(), // data_inicio
          reservas: {
            cliente_id: r[1] || '',
            quadra_id: r[2] || '',
            duracao: r[6] || '',
            profiles: {
              full_name: r[1] || 'Cliente'
            },
            quadras: {
              nome: r[2] || 'Quadra'
            }
          }
        }))

      setPagamentos(pagamentos)
    } catch (error) {
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
    fetchPagamentos()
  }, [refresh])

  const handleStatusChange = async (pagamentoId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("pagamentos")
        .update({
          status: newStatus,
          paid_at: newStatus === "aprovado" ? new Date().toISOString() : null,
        })
        .eq("id", pagamentoId)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: `Pagamento ${newStatus} com sucesso`,
      })

      fetchPagamentos() // Recarregar dados
    } catch (error) {
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
                  <p className="text-sm text-gray-400">Total de TransaçÃµes</p>
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
                <TableHead className="text-gray-300">AçÃµes</TableHead>
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


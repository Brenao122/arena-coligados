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
import { Search, DollarSign, CreditCard, Smartphone, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pagamento {
  id: string
  reserva_id: string
  valor: number
  metodo: string
  status: string
  data_pagamento: string
  created_at: string
  updated_at: string
}

interface PagamentosListSheetsProps {
  refresh: boolean
}

export function PagamentosListSheets({ refresh }: PagamentosListSheetsProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [metodoFilter, setMetodoFilter] = useState("all")
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()

  const fetchPagamentos = async () => {
    try {
      setLoading(true)

      // Buscar dados da planilha Google Sheets
      const response = await fetch("/api/sheets/read?sheet=pagamentos")
      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || "Erro ao buscar dados")
      }

      const dados = result.rows || []

      // Processar dados da planilha
      const pagamentosProcessados = dados.map((item: any, index: number) => ({
        id: item.id || `pag-${index + 1}`,
        reserva_id: item.reserva_id || "",
        valor: Number.parseFloat(item.valor) || 0,
        metodo: item.metodo || "pix",
        status: item.status || "pendente",
        data_pagamento: item.data_pagamento || "",
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
      }))

      setPagamentos(pagamentosProcessados)
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pagamentos da planilha",
        variant: "destructive",
      })
      setPagamentos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPagamentos()
  }, [refresh])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetchPagamentos()
      toast({
        title: "Sucesso",
        description: "Dados sincronizados com Google Sheets",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro na sincronização",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
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
    const matchesSearch =
      pagamento.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.reserva_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || pagamento.status === statusFilter
    const matchesMetodo = metodoFilter === "all" || pagamento.metodo === metodoFilter

    return matchesSearch && matchesStatus && matchesMetodo
  })

  const totalReceita = pagamentos.filter((p) => p.status === "aprovado").reduce((sum, p) => sum + p.valor, 0)
  const totalPendente = pagamentos.filter((p) => p.status === "pendente").reduce((sum, p) => sum + p.valor, 0)

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Pagamentos - Google Sheets</CardTitle>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gestão de Pagamentos - Google Sheets</CardTitle>
            <CardDescription className="text-gray-400">Dados sincronizados com a planilha</CardDescription>
          </div>
          <Button onClick={handleSync} disabled={syncing} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </Button>
        </div>
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
                placeholder="Buscar por ID do pagamento ou reserva..."
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
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Reserva</TableHead>
                <TableHead className="text-gray-300">Método</TableHead>
                <TableHead className="text-gray-300">Valor</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Data Criação</TableHead>
                <TableHead className="text-gray-300">Data Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Nenhum pagamento encontrado na planilha
                  </TableCell>
                </TableRow>
              ) : (
                filteredPagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id} className="border-gray-700">
                    <TableCell>
                      <p className="font-mono text-sm text-white">{pagamento.id}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">{pagamento.reserva_id || "N/A"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMetodoIcon(pagamento.metodo)}
                        <Badge variant="outline" className="capitalize border-gray-600 text-gray-300">
                          {pagamento.metodo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">R$ {pagamento.valor.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(pagamento.status)}>{pagamento.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">
                        {pagamento.created_at
                          ? format(new Date(pagamento.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : "N/A"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">
                        {pagamento.data_pagamento
                          ? format(new Date(pagamento.data_pagamento), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : "-"}
                      </p>
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

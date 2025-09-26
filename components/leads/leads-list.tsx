"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Removido import direto do repo - será usado via API
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Search, MessageSquare, Phone, Mail, UserPlus } from "lucide-react"

interface Lead {
  id: string
  nome: string
  telefone: string
  email: string
  origem: string
  status: string
  observacoes: string
  created_at: string
}

interface LeadsListProps {
  refresh: boolean
}

export function LeadsList({ refresh }: LeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [origemFilter, setOrigemFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchLeads()
  }, [refresh])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sheets/read?sheet=leads')
      const result = await response.json()
      
      if (result.ok) {
        setLeads(result.rows || [])
      } else {
        console.error('Erro ao buscar leads:', result.error)
        setLeads([])
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      // Para Google Sheets, vamos apenas atualizar o estado local
      // Em uma implementação completa, você criaria uma função de update no repo
      setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)))
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-500 text-white"
      case "contatado":
        return "bg-yellow-500 text-white"
      case "interessado":
        return "bg-purple-500 text-white"
      case "convertido":
        return "bg-green-500 text-white"
      case "perdido":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getOrigemIcon = (origem: string) => {
    switch (origem) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      case "instagram":
        return <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
      case "site":
        return <div className="h-4 w-4 bg-blue-500 rounded" />
      case "indicacao":
        return <UserPlus className="h-4 w-4" />
      default:
        return <div className="h-4 w-4 bg-gray-500 rounded" />
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesOrigemFilter = origemFilter === "all" || lead.origem === origemFilter
    const matchesStatusFilter = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesOrigemFilter && matchesStatusFilter
  })

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Leads</CardTitle>
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
        <CardTitle className="text-white">Gestão de Leads</CardTitle>
        <CardDescription className="text-gray-400">Acompanhe e converta seus leads em clientes</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Novos</p>
                  <p className="text-2xl font-bold text-white">{leads.filter((l) => l.status === "novo").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Contatados</p>
                  <p className="text-2xl font-bold text-white">
                    {leads.filter((l) => l.status === "contatado").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Convertidos</p>
                  <p className="text-2xl font-bold text-white">
                    {leads.filter((l) => l.status === "convertido").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gradient-to-r from-orange-500 to-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-white">
                    {leads.length > 0
                      ? Math.round((leads.filter((l) => l.status === "convertido").length / leads.length) * 100)
                      : 0}
                    %
                  </p>
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
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={origemFilter} onValueChange={setOrigemFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todas Origens</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contatado">Contatado</SelectItem>
              <SelectItem value="interessado">Interessado</SelectItem>
              <SelectItem value="convertido">Convertido</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Lead</TableHead>
                <TableHead className="text-gray-300">Contato</TableHead>
                <TableHead className="text-gray-300">Origem</TableHead>
                <TableHead className="text-gray-300">Notas</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow className="border-gray-600">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Nenhum lead encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-gray-600">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{lead.nome?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{lead.nome}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-300">{lead.telefone}</p>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <p className="text-sm text-gray-300">{lead.email}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getOrigemIcon(lead.origem)}
                        <Badge variant="outline" className="capitalize border-gray-500 text-gray-300">
                          {lead.origem}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">{lead.observacoes || "Sem notas"}</p>
                    </TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value)}>
                        <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600">
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="contatado">Contatado</SelectItem>
                          <SelectItem value="interessado">Interessado</SelectItem>
                          <SelectItem value="convertido">Convertido</SelectItem>
                          <SelectItem value="perdido">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">
                        {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-gray-600">
                          <a
                            href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="h-4 w-4 text-green-500" />
                          </a>
                        </Button>
                        {lead.email && (
                          <Button variant="ghost" size="sm" asChild className="hover:bg-gray-600">
                            <a href={`mailto:${lead.email}`}>
                              <Mail className="h-4 w-4 text-blue-500" />
                            </a>
                          </Button>
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

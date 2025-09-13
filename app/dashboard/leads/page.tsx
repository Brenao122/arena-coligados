"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Phone, Mail, MessageCircle, TrendingUp, Users, Target } from "lucide-react"
import { LeadForm } from "@/components/leads/lead-form"

interface Lead {
  id: string
  nome: string
  telefone: string
  email: string
  origem: string
  interesse: string
  status: "novo" | "contatado" | "qualificado" | "proposta" | "convertido" | "perdido"
  created_at: string
  valor_estimado?: number
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchLeads()
  }, [refreshKey])

  const fetchLeads = async () => {
    try {
      setLoading(true)

      // Buscar leads do Google Sheets
      const response = await fetch('/api/sheets/read?sheet=Página1')
      const result = await response.json()

      if (result.ok && result.rows) {
        // Filtrar apenas os leads (assumindo que estão na planilha)
        const leadsData = result.rows.filter((row: any) => 
          row.nome && row.telefone && row.origem
        ).map((row: any) => ({
          id: row.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          nome: row.nome || row.Nome || '',
          telefone: row.telefone || row.Telefone || '',
          email: row.email || row.Email || '',
          origem: row.origem || row.Origem || 'site',
          interesse: row.interesse || row.Interesse || '',
          status: row.status || row.Status || 'novo',
          created_at: row.created_at || row.Created_at || new Date().toISOString(),
          valor_estimado: row.valor_estimado || row.Valor_estimado || 0
        }))

        setLeads(leadsData)
      } else {
        setLeads([])
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-500"
      case "contatado":
        return "bg-orange-500"
      case "qualificado":
        return "bg-purple-500"
      case "proposta":
        return "bg-yellow-500"
      case "convertido":
        return "bg-green-500"
      case "perdido":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOrigemIcon = (origem: string) => {
    switch (origem) {
      case "instagram":
        return "📷"
      case "whatsapp":
        return "📱"
      case "site":
        return "🌐"
      case "google":
        return "🔍"
      default:
        return "📞"
    }
  }

  const handleLeadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const leadsNovos = leads.filter((l) => l.status === "novo").length
  const leadsContato = leads.filter((l) => l.status === "contatado").length
  const leadsConvertidos = leads.filter((l) => l.status === "convertido").length
  const taxaConversao = leads.length > 0 ? Math.round((leadsConvertidos / leads.length) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="text-gray-400">Gerencie e converta seus leads em clientes</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Leads Novos</p>
                <p className="text-2xl font-bold text-white">{leadsNovos}</p>
                <p className="text-xs text-blue-400">Aguardando contato</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">Em Contato</p>
                <p className="text-2xl font-bold text-white">{leadsContato}</p>
                <p className="text-xs text-orange-400">Aguardando retorno</p>
              </div>
              <MessageCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Convertidos</p>
                <p className="text-2xl font-bold text-white">{leadsConvertidos}</p>
                <p className="text-xs text-green-400">Este mês</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">Taxa Conversão</p>
                <p className="text-2xl font-bold text-white">{taxaConversao}%</p>
                <p className="text-xs text-purple-400">Baseado nos dados</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Gestão de Leads</CardTitle>
          <CardDescription className="text-gray-400">Acompanhe e converta seus leads em clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhum lead encontrado</p>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {lead.nome.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{lead.nome}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.telefone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Origem</div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {getOrigemIcon(lead.origem)} {lead.origem}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-400">Interesse</div>
                      <div className="text-sm text-white">{lead.interesse || "Não informado"}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-400">Status</div>
                      <Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge>
                    </div>

                    {lead.valor_estimado && (
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Valor Potencial</div>
                        <div className="text-sm font-medium text-green-400">
                          R$ {lead.valor_estimado.toLocaleString("pt-BR")}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <LeadForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleLeadSuccess} />
    </div>
  )
}
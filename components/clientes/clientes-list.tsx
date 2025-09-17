"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2, Search, Users, Eye, Calendar } from "lucide-react"

interface Cliente {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  reservas_count?: number
  ultima_reserva?: string
  total_gasto?: number
}

interface ClientesListProps {
  onEdit: (clienteId: string) => void
  onView: (clienteId: string) => void
  refresh: boolean
}

export function ClientesList({ onEdit, onView, refresh }: ClientesListProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchClientes()
  }, [refresh])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      console.log('🔍 Buscando clientes via sistema híbrido...')

      // Usar nova API híbrida
      const response = await fetch('/api/sheets-primary/clientes')
      const result = await response.json()
      
      console.log('📊 Resposta da API híbrida:', result)
      
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao buscar dados')
      }

      const clientesData = result.data || []
      console.log('📋 Dados dos clientes:', clientesData)
      console.log('🔄 Fonte dos dados:', result.source)
      
      if (clientesData.length === 0) {
        console.log('⚠️ Nenhum cliente encontrado')
        setClientes([])
        return
      }

      // Mapear dados para estrutura esperada
      const clientesMapeados = clientesData.map((cliente: any) => ({
        id: cliente.id,
        full_name: cliente.nome || cliente.full_name || '',
        email: cliente.email || '',
        phone: cliente.telefone || cliente.phone || '',
        created_at: cliente.created_at || new Date().toISOString(),
        reservas_count: cliente.reservas_count || 0,
        ultima_reserva: cliente.ultima_reserva || '',
        total_gasto: cliente.total_gasto || 0
      })).filter(cliente => cliente.full_name && cliente.email) // Filtrar clientes válidos

      console.log('✅ Clientes mapeados:', clientesMapeados)
      setClientes(clientesMapeados)
      
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error)
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (clienteId: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    try {
      // Para Google Sheets, vamos apenas atualizar o estado local
      // Em uma implementação completa, você criaria uma função de delete no repo
      setClientes((prev) => prev.filter((c) => c.id !== clienteId))
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
    }
  }

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Clientes</CardTitle>
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
        <CardTitle className="text-white">Gestão de Clientes</CardTitle>
        <CardDescription className="text-gray-400">Gerencie todos os clientes da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-400">Total de Clientes</p>
                  <p className="text-2xl font-bold text-white">{clientes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-white">
                    {clientes.filter((c) => c.reservas_count && c.reservas_count > 0).length}
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
                  <p className="text-sm text-gray-400">Novos este Mês</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      clientes.filter((c) => {
                        const created = new Date(c.created_at)
                        const now = new Date()
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600">
                <TableHead className="text-gray-300">Cliente</TableHead>
                <TableHead className="text-gray-300">Contato</TableHead>
                <TableHead className="text-gray-300">Reservas</TableHead>
                <TableHead className="text-gray-300">Última Reserva</TableHead>
                <TableHead className="text-gray-300">Total Gasto</TableHead>
                <TableHead className="text-gray-300">Cadastro</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow className="border-gray-600">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id} className="border-gray-600">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {cliente.full_name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{cliente.full_name}</p>
                          <p className="text-sm text-gray-400">{cliente.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">{cliente.phone || "Não informado"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                          {cliente.reservas_count || 0}
                        </Badge>
                        {(cliente.reservas_count || 0) > 0 && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Ativo
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cliente.ultima_reserva ? (
                        <p className="text-sm text-gray-300">
                          {format(new Date(cliente.ultima_reserva), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Nunca</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">R$ {(cliente.total_gasto || 0).toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-300">
                        {format(new Date(cliente.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(cliente.id)}
                          className="hover:bg-gray-600"
                        >
                          <Eye className="h-4 w-4 text-gray-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(cliente.id)}
                          className="hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 text-gray-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
                          className="hover:bg-gray-600"
                        >
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

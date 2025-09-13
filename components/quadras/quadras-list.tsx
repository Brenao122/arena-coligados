"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, MapPin, Plus, Camera } from "lucide-react"
import Image from "next/image"

interface Quadra {
  id: string
  nome?: string
  tipo?: string
  preco_hora?: number
  ativa: boolean
  descricao?: string
  image_url?: string
  created_at: string
}

interface QuadrasListProps {
  onEdit: (quadraId: string) => void
  refresh: boolean
}

export function QuadrasList({ onEdit, refresh }: QuadrasListProps) {
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchQuadras = async () => {
    try {
      setLoading(true)
      
      // Buscar dados reais da planilha
      const response = await fetch('/api/sheets/read?sheet=quadras')
      const result = await response.json()
      
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao buscar dados')
      }

      const quadrasData = result.rows || []
      
      // Converter dados da planilha para o formato esperado
      const quadrasFormatadas = quadrasData.map((quadra: any) => ({
        id: quadra.id || `quadra-${Math.random().toString(36).substr(2, 9)}`,
        nome: quadra.nome || 'Quadra sem nome',
        tipo: quadra.tipo || 'Não especificado',
        preco_hora: parseFloat(quadra.preco_hora) || 0,
        ativa: quadra.ativa === 'true' || quadra.ativa === true,
        descricao: quadra.descricao || '',
        image_url: quadra.imagem_url || '/default-court.png',
        created_at: quadra.created_at || new Date().toISOString()
      }))

      setQuadras(quadrasFormatadas)
    } catch (error) {
      console.error('Erro ao buscar quadras:', error)
      setQuadras([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuadras()
  }, [refresh])

  const handleDelete = async (quadraId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta quadra?")) return

    try {
      // Para Google Sheets, vamos apenas atualizar o estado local
      // Em uma implementação completa, você criaria uma função de delete no repo
      setQuadras((prev) => prev.filter((q) => q.id !== quadraId))
    } catch (error) {
      console.error('Erro ao excluir quadra:', error)
    }
  }

  const filteredQuadras = quadras.filter((quadra) => {
    const matchesSearch =
      quadra.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quadra.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quadra.descricao?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipo = tipoFilter === "all" || quadra.tipo === tipoFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && quadra.ativa) ||
      (statusFilter === "inactive" && !quadra.ativa)

    return matchesSearch && matchesTipo && matchesStatus
  })

  const tipos = Array.from(new Set(quadras.map(q => q.tipo).filter(Boolean)))

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quadras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Gestão de Quadras</CardTitle>
        <CardDescription className="text-gray-400">Gerencie todas as quadras da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, tipo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all" className="text-white hover:bg-gray-600">Todos</SelectItem>
              {tipos.map((tipo) => (
                <SelectItem key={tipo} value={tipo} className="text-white hover:bg-gray-600">
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all" className="text-white hover:bg-gray-600">Todos</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-gray-600">Ativas</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-gray-600">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Quadras</p>
                  <p className="text-2xl font-bold text-white">{quadras.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Ativas</p>
                  <p className="text-2xl font-bold text-white">
                    {quadras.filter(q => q.ativa).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Tipos</p>
                  <p className="text-2xl font-bold text-white">{tipos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-orange-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Preço Médio</p>
                  <p className="text-2xl font-bold text-white">
                    R$ {(quadras.reduce((sum, q) => sum + (q.preco_hora || 0), 0) / quadras.length || 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Quadras */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuadras.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              Nenhuma quadra encontrada
            </div>
          ) : (
            filteredQuadras.map((quadra) => (
              <Card key={quadra.id} className="bg-gray-700 border-gray-600 overflow-hidden">
                <div className="relative h-48">
                  {quadra.image_url ? (
                    <Image
                      src={quadra.image_url}
                      alt={quadra.nome || "Quadra"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={quadra.ativa ? "bg-green-500" : "bg-red-500"}>
                      {quadra.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-white">{quadra.nome}</h3>
                      <p className="text-sm text-gray-400">{quadra.tipo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">R$ {quadra.preco_hora}/h</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{quadra.descricao}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(quadra.id)}
                      className="flex-1 hover:bg-gray-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(quadra.id)}
                      className="hover:bg-gray-600"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

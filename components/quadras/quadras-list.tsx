"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, MapPin, Plus, Camera } from "lucide-react"

interface Quadra {
  id: string
  nome: string
  tipo: string
  preco_hora: number
  ativa: boolean
  descricao: string
  image_url?: string
}

interface QuadrasListProps {
  onEdit: (quadraId: string) => void
  refresh: boolean
}

export function QuadrasList({ onEdit, refresh }: QuadrasListProps) {
  const [quadras] = useState<Quadra[]>([
    {
      id: "1",
      nome: "Quadra 1 - Futsal",
      tipo: "Futsal",
      preco_hora: 150.0,
      ativa: true,
      descricao: "Quadra coberta com grama sintética",
      image_url: "/quadra-futsal.jpg",
    },
    {
      id: "2",
      nome: "Quadra 2 - Beach Tennis",
      tipo: "Beach Tennis",
      preco_hora: 120.0,
      ativa: true,
      descricao: "Quadra de areia com iluminação",
      image_url: "/quadra-beach-tennis.jpg",
    },
  ])
  const [loading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredQuadras = quadras.filter((quadra) => {
    const matchesSearch = quadra.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "all" || quadra.tipo === tipoFilter
    const matchesStatus = statusFilter === "all" || (statusFilter === "ativa" ? quadra.ativa : !quadra.ativa)

    return matchesSearch && matchesTipo && matchesStatus
  })

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quadras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Gestão de Quadras</CardTitle>
          <CardDescription className="text-gray-400">Gerencie todas as quadras da arena</CardDescription>
        </div>
        <Button
          onClick={() => onEdit("new")}
          className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Quadra
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar quadras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="Futsal">Futsal</SelectItem>
              <SelectItem value="Vôlei">Vôlei</SelectItem>
              <SelectItem value="Basquete">Basquete</SelectItem>
              <SelectItem value="Society">Society</SelectItem>
              <SelectItem value="Tênis">Tênis</SelectItem>
              <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="ativa">Ativas</SelectItem>
              <SelectItem value="inativa">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quadras Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuadras.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma quadra encontrada</p>
            </div>
          ) : (
            filteredQuadras.map((quadra) => (
              <Card
                key={quadra.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-700 border-gray-600"
              >
                <div className="aspect-video relative">
                  <img
                    src={quadra.image_url || "/placeholder.svg?height=200&width=300&query=quadra esportiva"}
                    alt={quadra.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge
                      variant={quadra.ativa ? "default" : "secondary"}
                      className={quadra.ativa ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {quadra.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white border-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white">{quadra.nome}</h3>
                      <Badge variant="outline" className="capitalize border-gray-500 text-gray-300">
                        {quadra.tipo}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-orange-500">R$ {quadra.preco_hora.toFixed(2)}/h</p>
                    {quadra.descricao && <p className="text-sm text-gray-400 line-clamp-2">{quadra.descricao}</p>}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(quadra.id)}
                      className="flex-1 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-600 bg-transparent">
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

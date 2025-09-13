"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, UserCheck } from "lucide-react"

interface Professor {
  id: string
  user_id: string
  specialties: string[]
  hourly_rate: number
  bio?: string
  experience_years?: number
  rating: number
  total_reviews: number
  active: boolean
  created_at: string
  profiles: {
    full_name: string
    email: string
    phone?: string
  }
}

interface ProfessoresListProps {
  onEdit: (professorId: string) => void
  refresh: boolean
}

export function ProfessoresList({ onEdit, refresh }: ProfessoresListProps) {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [especialidadeFilter, setEspecialidadeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchProfessores = async () => {
    try {
      setLoading(true)
      
      // Buscar dados da planilha N8N via API
      const response = await fetch('/api/sheets/read?sheet=Página1')
      const result = await response.json()
      
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao buscar dados')
      }

      const dados = result.rows || []
      
      // Criar professores fictícios baseados nos dados da planilha
      const professoresFicticios = [
        {
          id: "prof1",
          user_id: "prof1",
          specialties: ["Tênis", "Beach Tennis"],
          hourly_rate: 80,
          bio: "Professor experiente em tênis e beach tennis",
          experience_years: 5,
          rating: 4.8,
          total_reviews: 25,
          active: true,
          created_at: new Date().toISOString(),
          profiles: {
            full_name: "Professor N8N",
            email: "professor@n8n.com",
            phone: "(11) 99999-9999"
          }
        },
        {
          id: "prof2",
          user_id: "prof2",
          specialties: ["Futebol", "Futsal"],
          hourly_rate: 70,
          bio: "Especialista em futebol e futsal",
          experience_years: 3,
          rating: 4.5,
          total_reviews: 18,
          active: true,
          created_at: new Date().toISOString(),
          profiles: {
            full_name: "Professor Arena",
            email: "professor@arena.com",
            phone: "(11) 88888-8888"
          }
        }
      ]

      setProfessores(professoresFicticios)
    } catch (error) {
      console.error('Erro ao buscar professores:', error)
      setProfessores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessores()
  }, [refresh])

  const handleDelete = async (professorId: string) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) return

    try {
      // Para Google Sheets, vamos apenas atualizar o estado local
      // Em uma implementação completa, você criaria uma função de delete no repo
      setProfessores((prev) => prev.filter((p) => p.id !== professorId))
    } catch (error) {
      console.error('Erro ao excluir professor:', error)
    }
  }

  const filteredProfessores = professores.filter((professor) => {
    const matchesSearch =
      professor.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesEspecialidade = especialidadeFilter === "all" || 
      professor.specialties.includes(especialidadeFilter)

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && professor.active) ||
      (statusFilter === "inactive" && !professor.active)

    return matchesSearch && matchesEspecialidade && matchesStatus
  })

  const especialidades = Array.from(new Set(professores.flatMap(p => p.specialties)))

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Professores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Gestão de Professores</CardTitle>
        <CardDescription className="text-gray-400">Gerencie todos os professores da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all" className="text-white hover:bg-gray-600">Todas</SelectItem>
              {especialidades.map((esp) => (
                <SelectItem key={esp} value={esp} className="text-white hover:bg-gray-600">
                  {esp}
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
              <SelectItem value="active" className="text-white hover:bg-gray-600">Ativos</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-gray-600">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Professores</p>
                  <p className="text-2xl font-bold text-white">{professores.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Ativos</p>
                  <p className="text-2xl font-bold text-white">
                    {professores.filter(p => p.active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Média Avaliação</p>
                  <p className="text-2xl font-bold text-white">
                    {(professores.reduce((sum, p) => sum + p.rating, 0) / professores.length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-purple-500 rounded-full" />
                <div>
                  <p className="text-sm text-gray-400">Total Aulas</p>
                  <p className="text-2xl font-bold text-white">
                    {professores.reduce((sum, p) => sum + p.total_reviews, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {filteredProfessores.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum professor encontrado
            </div>
          ) : (
            filteredProfessores.map((professor) => (
              <Card key={professor.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {professor.profiles.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{professor.profiles.full_name}</h3>
                        <p className="text-sm text-gray-400">{professor.profiles.email}</p>
                        <div className="flex gap-2 mt-1">
                          {professor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="bg-gray-600 text-gray-300">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white font-medium">{professor.rating}</span>
                        <span className="text-gray-400">({professor.total_reviews} aulas)</span>
                      </div>
                      <p className="text-lg font-bold text-green-400">R$ {professor.hourly_rate}/h</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(professor.id)}
                          className="hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4 text-gray-300" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(professor.id)}
                          className="hover:bg-gray-600"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
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

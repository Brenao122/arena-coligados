"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, UserCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Professor {
  id: string
  user_id: string
  specialties: string[]
  hourly_rate: number
  bio?: string
  experience_years?: number
  rating: number
  total_reviews: number
  ativo: boolean
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
      console.log("[v0] Fetching professores from database...")

      const { data, error } = await supabase
        .from("professores")
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false })

      console.log("[v0] Professores query result:", { data, error })

      if (error) {
        console.error("Erro ao buscar professores:", error)
        setProfessores([])
        return
      }

      console.log("[v0] Found", data?.length || 0, "professores")
      setProfessores(data || [])
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error)
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
      const { error } = await supabase.from("professores").delete().eq("id", professorId)

      if (error) {
        console.error("Erro ao deletar professor:", error)
        return
      }

      setProfessores((prev) => prev.filter((prof) => prof.id !== professorId))
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error)
    }
  }

  const toggleStatus = async (professorId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("professores").update({ ativo: !currentStatus }).eq("id", professorId)

      if (error) {
        console.error("Erro ao atualizar status:", error)
        return
      }

      setProfessores((prev) =>
        prev.map((prof) => (prof.id === professorId ? { ...prof, ativo: !currentStatus } : prof)),
      )
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error)
    }
  }

  const getAllEspecialidades = () => {
    const especialidades = new Set<string>()
    professores.forEach((prof) => {
      prof.specialties?.forEach((esp) => especialidades.add(esp))
    })
    return Array.from(especialidades).sort()
  }

  const filteredProfessores = professores.filter((professor) => {
    const matchesSearch =
      professor.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEspecialidade = especialidadeFilter === "all" || professor.specialties?.includes(especialidadeFilter)

    const matchesStatus = statusFilter === "all" || (statusFilter === "ativo" ? professor.ativo : !professor.ativo)

    return matchesSearch && matchesEspecialidade && matchesStatus
  })

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Professores</CardTitle>
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
      <CardHeader>
        <CardTitle className="text-white">Gestão de Professores</CardTitle>
        <CardDescription className="text-gray-400">Gerencie todos os professores da arena</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar professores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">Todas Especialidades</SelectItem>
              {getAllEspecialidades().map((especialidade) => (
                <SelectItem key={especialidade} value={especialidade} className="text-white">
                  {especialidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all" className="text-white">
                Todos Status
              </SelectItem>
              <SelectItem value="ativo" className="text-white">
                Ativos
              </SelectItem>
              <SelectItem value="inativo" className="text-white">
                Inativos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Professores Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessores.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum professor encontrado</p>
            </div>
          ) : (
            filteredProfessores.map((professor) => (
              <Card key={professor.id} className="overflow-hidden bg-gray-700 border-gray-600">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {professor.profiles?.full_name?.charAt(0)?.toUpperCase() || "P"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            {professor.profiles?.full_name || "Nome não informado"}
                          </h3>
                          <p className="text-sm text-gray-400">{professor.profiles?.email || "Email não informado"}</p>
                        </div>
                      </div>
                      <Badge
                        variant={professor.ativo ? "default" : "secondary"}
                        className={professor.ativo ? "bg-green-600" : "bg-gray-600"}
                      >
                        {professor.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-orange-500">
                        R$ {professor.hourly_rate?.toFixed(2) || "0.00"}/aula
                      </p>
                      {professor.profiles?.phone && <p className="text-sm text-gray-400">{professor.profiles.phone}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-300">
                          {professor.rating?.toFixed(1) || "0.0"} ({professor.total_reviews || 0} avaliações)
                        </span>
                        <span className="text-xs text-gray-400">• {professor.experience_years || 0} anos</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-white">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {professor.specialties?.map((especialidade) => (
                          <Badge
                            key={especialidade}
                            variant="outline"
                            className="text-xs border-orange-500 text-orange-400"
                          >
                            {especialidade}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {professor.bio && (
                      <div>
                        <p className="text-sm text-gray-400 line-clamp-2">{professor.bio}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(professor.id)}
                        className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(professor.id, professor.ativo)}
                        className="flex-1 border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                      >
                        {professor.ativo ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professor.id)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

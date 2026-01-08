"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Mail, Calendar, Users, Clock, Star } from "lucide-react"

interface Professor {
  id: string
  full_name: string
  email: string
  phone?: string
  especialidades?: string[]
  created_at: string
  preco_aula?: number
  alunos_ativos?: number
  aulas_mes?: number
  avaliacao?: number
}

interface Aula {
  id: string
  data_inicio: string
  data_fim: string
  cliente: {
    full_name: string
  }
  quadra: {
    nome: string
  }
  status: string
}

export default function ProfessorDetalhes() {
  const params = useParams()
  const router = useRouter()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [aulas, setAulas] = useState<Aula[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const mockProfessor: Professor = {
          id: params.id as string,
          full_name: "Professor Exemplo",
          email: "professor@exemplo.com",
          phone: "(11) 99999-9999",
          especialidades: ["Tênis", "Beach Tennis"],
          created_at: new Date().toISOString(),
          preco_aula: 150,
          alunos_ativos: 10,
          aulas_mes: 40,
          avaliacao: 4.8,
        }

        setProfessor(mockProfessor)
        setAulas([])
      } catch (error) {
        console.error("Erro ao buscar dados do professor:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProfessorData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Professor não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{professor.full_name}</h1>
            <p className="text-gray-400">Professor desde {new Date(professor.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Alunos Ativos</p>
                  <p className="text-2xl font-bold text-white">{professor.alunos_ativos || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Aulas/Mês</p>
                  <p className="text-2xl font-bold text-white">{professor.aulas_mes || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Preço/Aula</p>
                  <p className="text-2xl font-bold text-white">R$ {professor.preco_aula || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Avaliação</p>
                  <p className="text-2xl font-bold text-white">{professor.avaliacao || 0}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Pessoais */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{professor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="text-white">{professor.phone || "Não informado"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Especialidades</p>
                <div className="flex gap-2 mt-1">
                  {professor.especialidades?.map((esp) => (
                    <Badge key={esp} className="bg-orange-500 text-white">
                      {esp}
                    </Badge>
                  )) || <span className="text-gray-400">Não informado</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <Badge className="bg-green-500 text-white mt-1">Ativo</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Próximas Aulas */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Próximas Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aulas.length > 0 ? (
                  aulas.map((aula) => (
                    <div key={aula.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{aula.cliente.full_name}</p>
                        <p className="text-sm text-gray-400">
                          {aula.quadra.nome} •{" "}
                          {new Date(aula.data_inicio).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          -{new Date(aula.data_fim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{new Date(aula.data_inicio).toLocaleDateString()}</p>
                        <Badge className={aula.status === "concluida" ? "bg-green-500" : "bg-orange-500"}>
                          {aula.status === "concluida" ? "Concluída" : "Agendada"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">Nenhuma aula encontrada</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

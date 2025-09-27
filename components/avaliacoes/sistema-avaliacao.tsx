"use client"

import { useState, useEffect } from "react"
import { Star, Award, TrendingUp, MessageCircle, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface AvaliacaoProps {
  professorId?: string
  aulaId?: string
  tipo: "professor" | "aula"
}

interface Avaliacao {
  id: string
  aluno: string
  rating: number
  comentario: string
  data: string
  badges: string[]
}

interface Estatisticas {
  mediaGeral: number
  totalAvaliacoes: number
  recomendacao: number
  pontosFortes: string[]
}

export function SistemaAvaliacao({ professorId, aulaId, tipo }: AvaliacaoProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    mediaGeral: 0,
    totalAvaliacoes: 0,
    recomendacao: 0,
    pontosFortes: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvaliacoes()
  }, [professorId, aulaId])

  const fetchAvaliacoes = async () => {
    try {
      setLoading(true)

      let query = supabase.from("avaliacoes").select(`
        id,
        rating,
        comentario,
        created_at,
        profiles!inner(nome)
      `)

      if (tipo === "professor" && professorId) {
        query = query.eq("professor_id", professorId)
      } else if (tipo === "aula" && aulaId) {
        query = query.eq("aula_id", aulaId)
      }

      const { data: avaliacoesData, error } = await query.order("created_at", { ascending: false }).limit(10)

      if (error) throw error

      const avaliacoesFormatadas =
        avaliacoesData?.map((avaliacao) => ({
          id: avaliacao.id,
          aluno: avaliacao.profiles.nome,
          rating: avaliacao.rating,
          comentario: avaliacao.comentario,
          data: new Date(avaliacao.created_at).toLocaleDateString("pt-BR"),
          badges: avaliacao.rating >= 5 ? ["Excelente"] : avaliacao.rating >= 4 ? ["Muito Bom"] : ["Bom"],
        })) || []

      setAvaliacoes(avaliacoesFormatadas)

      if (avaliacoesFormatadas.length > 0) {
        const mediaGeral = avaliacoesFormatadas.reduce((sum, av) => sum + av.rating, 0) / avaliacoesFormatadas.length
        const recomendacao =
          (avaliacoesFormatadas.filter((av) => av.rating >= 4).length / avaliacoesFormatadas.length) * 100

        setEstatisticas({
          mediaGeral: Number(mediaGeral.toFixed(1)),
          totalAvaliacoes: avaliacoesFormatadas.length,
          recomendacao: Math.round(recomendacao),
          pontosFortes: ["Qualidade", "Profissionalismo", "Dedicação"],
        })
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAvaliacao = async () => {
    if (rating === 0) return

    try {
      const { error } = await supabase.from("avaliacoes").insert({
        professor_id: professorId,
        aula_id: aulaId,
        rating,
        comentario: feedback,
      })

      if (error) throw error

      // Recarregar avaliações após inserir nova
      await fetchAvaliacoes()

      // Limpar formulário
      setRating(0)
      setFeedback("")
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500">{estatisticas.mediaGeral}</div>
            <div className="text-sm text-gray-400">Avaliação Média</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <ThumbsUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500">{estatisticas.recomendacao}%</div>
            <div className="text-sm text-gray-400">Recomendação</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500">{estatisticas.totalAvaliacoes}</div>
            <div className="text-sm text-gray-400">Feedbacks</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-500">{avaliacoes.filter((a) => a.rating === 5).length}</div>
            <div className="text-sm text-gray-400">Avaliações 5★</div>
          </CardContent>
        </Card>
      </div>

      {/* Pontos Fortes */}
      {estatisticas.pontosFortes.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Pontos Fortes Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {estatisticas.pontosFortes.map((ponto, index) => (
                <Badge key={index} className="bg-gradient-to-r from-orange-500 to-green-500 text-white">
                  {ponto}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avaliações Reais */}
      {avaliacoes.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Feedbacks Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {avaliacao.aluno.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{avaliacao.aluno}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(avaliacao.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{avaliacao.comentario}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {avaliacao.badges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{avaliacao.data}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Formulário de Avaliação */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Compartilhe sua Experiência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Como foi sua experiência?</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-1">
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= rating ? "text-orange-500 fill-orange-500" : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Comentário (Opcional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              placeholder="Compartilhe sua experiência..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmitAvaliacao}
            className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
            disabled={rating === 0}
          >
            Enviar Avaliação
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

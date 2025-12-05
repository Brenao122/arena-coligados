"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

const UNIDADES = ["Parque Amazônia", "Vila Rosa"]
const QUADRAS: Record<string, string[]> = {
  "Parque Amazônia": ["Quadra 01", "Quadra 02", "Quadra 03", "Quadra 04", "Quadra 05"],
  "Vila Rosa": ["Q1", "Q2", "Q3", "Q4"],
}

interface HorarioBloqueado {
  id: string
  data: string
  horario_inicio: string
  bloqueado: boolean
  motivo?: string
}

export default function HorariosPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [unidade, setUnidade] = useState<string>("Parque Amazônia")
  const [quadra, setQuadra] = useState<string>("Quadra 01")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [horarios, setHorarios] = useState<Map<string, HorarioBloqueado[]>>(new Map())
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const quadraId = `${unidade}-${quadra}`

  useEffect(() => {
    setQuadra(QUADRAS[unidade][0])
  }, [unidade])

  useEffect(() => {
    carregarHorarios()
  }, [unidade, quadra, currentMonth])

  const carregarHorarios = async () => {
    try {
      setLoading(true)
      const primeiroDia = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const ultimoDia = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 3, 0)

      const { data, error } = await supabase
        .from("horarios_bloqueados")
        .select("*")
        .eq("quadra_id", quadraId)
        .gte("data", primeiroDia.toISOString().split("T")[0])
        .lte("data", ultimoDia.toISOString().split("T")[0])

      if (error) throw error

      const horariosPorData = new Map<string, HorarioBloqueado[]>()
      data?.forEach((h) => {
        if (!horariosPorData.has(h.data)) {
          horariosPorData.set(h.data, [])
        }
        horariosPorData.get(h.data)!.push(h)
      })
      setHorarios(horariosPorData)
    } catch (error) {
      console.error("[v0] Erro ao carregar horários:", error)
      setFeedback({ type: "error", message: "Erro ao carregar horários" })
    } finally {
      setLoading(false)
    }
  }

  const toggleHorario = async (data: string, horario: string, bloqueado: boolean) => {
    try {
      const endpoint = bloqueado ? "/api/horarios/desbloquear" : "/api/horarios/bloquear"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quadra_id: quadraId,
          data,
          horario_inicio: `${horario}:00`,
          horario_fim: `${Number.parseInt(horario) + 1}:00:00`,
          motivo: "Gerenciado via dashboard",
          unidade,
        }),
      })

      if (!response.ok) throw new Error("Erro ao atualizar horário")

      setFeedback({ type: "success", message: `Horário ${bloqueado ? "desbloqueado" : "bloqueado"} com sucesso` })
      await carregarHorarios()
    } catch (error) {
      console.error("[v0] Erro:", error)
      setFeedback({ type: "error", message: "Erro ao atualizar horário" })
    }
  }

  const getDiasNoMes = () => {
    const dias = []
    const ano = currentMonth.getFullYear()
    const mes = currentMonth.getMonth()
    const ultimoDia = new Date(ano, mes + 1, 0).getDate()

    for (let dia = 1; dia <= ultimoDia; dia++) {
      dias.push(new Date(ano, mes, dia))
    }
    return dias
  }

  const getMesesProximos90 = () => {
    const meses = []
    const atual = new Date()
    for (let i = 0; i < 3; i++) {
      meses.push(new Date(atual.getFullYear(), atual.getMonth() + i, 1))
    }
    return meses
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
          Gestão de Horários
        </h1>
        <p className="text-gray-400 mt-2">Bloquear e desbloquear horários para as próximas 3 meses</p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg border ${
            feedback.type === "success"
              ? "bg-green-900/20 border-green-700 text-green-400"
              : "bg-red-900/20 border-red-700 text-red-400"
          }`}
        >
          <AlertCircle className="h-5 w-5" />
          {feedback.message}
        </div>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Unidade</label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {UNIDADES.map((u) => (
                    <SelectItem key={u} value={u} className="text-white">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Quadra</label>
              <Select value={quadra} onValueChange={setQuadra}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {QUADRAS[unidade]?.map((q) => (
                    <SelectItem key={q} value={q} className="text-white">
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Período</label>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-300 min-w-32 text-center">
                  {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </span>
                <Button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center text-gray-400">Carregando horários...</div>
      ) : (
        <div className="space-y-4">
          {getMesesProximos90()
            .filter((mes) => mes.getTime() >= new Date(currentMonth.getFullYear(), currentMonth.getMonth()).getTime())
            .slice(0, 1)
            .map((mes) => (
              <Card key={mes.toISOString()} className="bg-gray-800 border-gray-700 overflow-x-auto">
                <CardHeader>
                  <CardTitle className="text-white">
                    {mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
                      <div key={d} className="text-center text-xs text-gray-400 font-bold py-2">
                        {d}
                      </div>
                    ))}
                    {getDiasNoMes().map((dia) => {
                      const dataStr = dia.toISOString().split("T")[0]
                      const horariosDosDia = horarios.get(dataStr) || []
                      const bloqueados = horariosDosDia.filter((h) => h.bloqueado).length
                      const total = horariosDosDia.length

                      return (
                        <div
                          key={dataStr}
                          className="bg-gray-700 rounded-lg p-3 min-h-20 cursor-pointer hover:bg-gray-600 transition-all text-center"
                        >
                          <div className="text-white font-bold mb-1">{dia.getDate()}</div>
                          <div className="text-xs">
                            <div className="text-red-400">{bloqueados} bloqueados</div>
                            <div className="text-green-400">{total - bloqueados} livres</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Legenda</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-300">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-300">Bloqueado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

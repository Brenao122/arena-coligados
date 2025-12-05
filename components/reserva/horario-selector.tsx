"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface HorarioSelectorProps {
  unidade: string
  quadra: string
  data: Date
  onSelect: (horario: string) => void
  selected?: string
}

interface HorarioDisponibilidade {
  horario: string
  disponivel: boolean
  bloqueado: boolean
}

export function HorarioSelector({ unidade, quadra, data, onSelect, selected }: HorarioSelectorProps) {
  const [horarios, setHorarios] = useState<HorarioDisponibilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDisponibilidade = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/reservas/check-disponibilidade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unidade,
            quadra,
            data: data.toISOString().split("T")[0],
          }),
        })

        if (!response.ok) throw new Error("Erro ao buscar disponibilidade")

        const data_response = await response.json()
        setHorarios(data_response.horarios)
        setError(null)
      } catch (err) {
        setError("Não foi possível carregar os horários disponíveis")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDisponibilidade()
  }, [unidade, quadra, data])

  if (loading) {
    return <div className="text-center text-gray-400">Carregando horários...</div>
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-700 rounded text-red-400">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Selecione o Horário</h2>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <p className="text-sm text-gray-400">
          {data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
        </p>
      </div>
      <div className="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {horarios.map((h) => (
          <Button
            key={h.horario}
            onClick={() => onSelect(h.horario)}
            disabled={!h.disponivel || h.bloqueado}
            className={`text-sm py-2 ${
              selected === h.horario
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : h.bloqueado
                  ? "bg-red-900 text-red-300 cursor-not-allowed"
                  : h.disponivel
                    ? "bg-green-900 hover:bg-green-800 text-green-300"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
            title={h.bloqueado ? "Horário bloqueado" : !h.disponivel ? "Indisponível" : ""}
          >
            {h.horario}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Verde: Disponível | Amarelo: Selecionado | Vermelho: Bloqueado</p>
    </div>
  )
}

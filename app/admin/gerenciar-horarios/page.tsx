"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Lock, Unlock, Loader2 } from "lucide-react"
import Link from "next/link"

const UNIDADES = {
  "Parque Amazônia": ["Quadra 01", "Quadra 02", "Quadra 03", "Quadra 04", "Quadra 05"],
  "Vila Rosa": ["Q1", "Q2", "Q3", "Q4"],
}

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

const getNext7Days = () => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date)
  }
  return days
}

export default function GerenciarHorariosPage() {
  const [selectedUnidade, setSelectedUnidade] = useState<string>("")
  const [selectedQuadra, setSelectedQuadra] = useState<string>("")
  const [selectedData, setSelectedData] = useState<string>("")
  const [selectedHorario, setSelectedHorario] = useState<string>("")
  const [motivo, setMotivo] = useState<string>("")
  const [acao, setAcao] = useState<"bloquear" | "desbloquear">("bloquear")
  const [loading, setLoading] = useState(false)
  const [availableDays] = useState<Date[]>(getNext7Days())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = acao === "bloquear" ? "/api/sheets/horarios/bloquear" : "/api/sheets/horarios/desbloquear"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: selectedData,
          unidade: selectedUnidade,
          quadra: selectedQuadra,
          horarios: selectedHorario,
          motivo,
        }),
      })

      if (response.ok) {
        alert(`Horário ${acao === "bloquear" ? "bloqueado" : "desbloqueado"} com sucesso!`)
        setMotivo("")
      } else {
        throw new Error(`Erro ao ${acao} horário`)
      }
    } catch (error) {
      console.error("[v0] Erro:", error)
      alert(`Erro ao ${acao} horário`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/dashboard">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Gerenciar Horários</CardTitle>
            <p className="text-gray-300 text-center">Bloqueie ou desbloqueie horários das quadras</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  type="button"
                  variant={acao === "bloquear" ? "default" : "outline"}
                  onClick={() => setAcao("bloquear")}
                  className={
                    acao === "bloquear"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                  }
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Bloquear Horário
                </Button>
                <Button
                  type="button"
                  variant={acao === "desbloquear" ? "default" : "outline"}
                  onClick={() => setAcao("desbloquear")}
                  className={
                    acao === "desbloquear"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                  }
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Desbloquear Horário
                </Button>
              </div>

              <div>
                <Label htmlFor="unidade" className="text-white">
                  Unidade
                </Label>
                <Select value={selectedUnidade} onValueChange={setSelectedUnidade} required>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(UNIDADES).map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUnidade && (
                <div>
                  <Label htmlFor="quadra" className="text-white">
                    Quadra
                  </Label>
                  <Select value={selectedQuadra} onValueChange={setSelectedQuadra} required>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Selecione a quadra" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES[selectedUnidade as keyof typeof UNIDADES].map((quadra) => (
                        <SelectItem key={quadra} value={quadra}>
                          {quadra}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="data" className="text-white">
                  Data
                </Label>
                <Select value={selectedData} onValueChange={setSelectedData} required>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Selecione a data" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDays.map((date) => (
                      <SelectItem key={date.toISOString()} value={date.toISOString().split("T")[0]}>
                        {date.toLocaleDateString("pt-BR")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="horario" className="text-white">
                  Horário
                </Label>
                <Select value={selectedHorario} onValueChange={setSelectedHorario} required>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {HORARIOS.map((horario) => (
                      <SelectItem key={horario} value={horario}>
                        {horario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {acao === "bloquear" && (
                <div>
                  <Label htmlFor="motivo" className="text-white">
                    Motivo do Bloqueio (opcional)
                  </Label>
                  <Textarea
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Manutenção da quadra, evento especial..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${acao === "bloquear" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : acao === "bloquear" ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Bloquear Horário
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Desbloquear Horário
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

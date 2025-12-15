"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Lock, Unlock, Loader2, Trash2 } from "lucide-react"
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
  const [bloqueios, setBloqueios] = useState<any[]>([])
  const [loadingBloqueios, setLoadingBloqueios] = useState(false)

  useEffect(() => {
    buscarBloqueios()
  }, [])

  const buscarBloqueios = async () => {
    setLoadingBloqueios(true)
    try {
      const response = await fetch("/api/sheets/horarios/listar")
      if (response.ok) {
        const data = await response.json()
        setBloqueios(data.bloqueios || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar bloqueios:", error)
    } finally {
      setLoadingBloqueios(false)
    }
  }

  const desbloquearRapido = async (bloqueio: any) => {
    if (
      !confirm(
        `Deseja desbloquear este horário?\n${bloqueio.unidade} - ${bloqueio.quadra}\n${bloqueio.data} às ${bloqueio.horarios}`,
      )
    ) {
      return
    }

    try {
      const response = await fetch("/api/sheets/horarios/desbloquear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: bloqueio.data,
          unidade: bloqueio.unidade,
          quadra: bloqueio.quadra,
          horarios: bloqueio.horarios,
        }),
      })

      if (response.ok) {
        alert("Horário desbloqueado com sucesso!")
        buscarBloqueios()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Erro:", error)
      alert("Erro ao desbloquear horário")
    }
  }

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
        buscarBloqueios()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
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
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/dashboard">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>

        <div className="grid gap-6 md:grid-cols-2">
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

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Bloqueios Ativos</CardTitle>
              <p className="text-gray-300">Horários bloqueados atualmente</p>
            </CardHeader>
            <CardContent>
              {loadingBloqueios ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-white" />
                </div>
              ) : bloqueios.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhum horário bloqueado</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {bloqueios.map((bloqueio, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{bloqueio.unidade}</p>
                          <p className="text-gray-300 text-sm">{bloqueio.quadra}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => desbloquearRapido(bloqueio)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-300">
                          <strong>Data:</strong> {new Date(bloqueio.data).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-gray-300">
                          <strong>Horário:</strong> {bloqueio.horarios}
                        </p>
                        <p className="text-gray-400 italic">{bloqueio.motivo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

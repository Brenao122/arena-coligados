"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, Copy, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const UNIDADES = {
  "Parque Amazônia": {
    preco: "80,00",
    quadras: ["Quadra 01", "Quadra 02", "Quadra 03", "Quadra 04", "Quadra 05"],
    pix: "12345678",
  },
  "Vila Rosa": {
    preco: "70,00",
    quadras: ["Q1", "Q2", "Q3", "Q4"],
    pix: "87654321",
  },
}

const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]

export default function ReservarQuadraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({})
  const [selectedSlot, setSelectedSlot] = useState<{
    unidade: string
    quadra: string
    horario: string
  } | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  })
  const [showPayment, setShowPayment] = useState(false)
  const [countdown, setCountdown] = useState(20)
  const [canConfirm, setCanConfirm] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      try {
        const response = await fetch("/api/sheets/reservas")
        if (response.ok) {
          const data = await response.json()
          const ocupados: Record<string, string[]> = {}
          data.reservas?.forEach((reserva: any) => {
            const key = `${reserva.unidade}-${reserva.quadra}`
            if (!ocupados[key]) ocupados[key] = []
            ocupados[key].push(reserva.horario)
          })
          setHorariosOcupados(ocupados)
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar horários:", error)
      }
    }
    fetchHorariosOcupados()
  }, [])

  useEffect(() => {
    if (showPayment && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanConfirm(true)
    }
  }, [showPayment, countdown])

  const isHorarioOcupado = (unidade: string, quadra: string, horario: string) => {
    const key = `${unidade}-${quadra}`
    return horariosOcupados[key]?.includes(horario) || false
  }

  const handleSlotClick = (unidade: string, quadra: string, horario: string) => {
    if (isHorarioOcupado(unidade, quadra, horario)) return
    setSelectedSlot({ unidade, quadra, horario })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) {
      alert("Por favor, selecione um horário")
      return
    }
    setShowPayment(true)
  }

  const handleCopyPix = () => {
    const pixKey = UNIDADES[selectedSlot?.unidade as keyof typeof UNIDADES]?.pix
    if (pixKey) {
      navigator.clipboard.writeText(pixKey)
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    }
  }

  const handleConfirmReservation = async () => {
    if (!selectedSlot) return

    setLoading(true)

    try {
      console.log("[v0] Enviando reserva:", { ...formData, ...selectedSlot })

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "Página1",
          data: {
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            unidade: selectedSlot.unidade,
            quadra: selectedSlot.quadra,
            horario: selectedSlot.horario,
            status: "Confirmado",
            data_cadastro: new Date().toISOString(),
          },
        }),
      })

      const result = await response.json()
      console.log("[v0] Resposta da API:", result)

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar")
      }

      setSuccess(true)
      setTimeout(() => router.push("/"), 3000)
    } catch (error) {
      console.error("[v0] Erro ao enviar formulário:", error)
      alert(`Erro ao enviar formulário: ${error instanceof Error ? error.message : "Tente novamente."}`)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Reserva Confirmada!</h2>
            <p className="text-gray-300 mb-6">Sua reserva foi confirmada com sucesso.</p>
            <p className="text-sm text-gray-400">Redirecionando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showPayment && selectedSlot) {
    const pixKey = UNIDADES[selectedSlot.unidade as keyof typeof UNIDADES]?.pix
    const preco = UNIDADES[selectedSlot.unidade as keyof typeof UNIDADES]?.preco

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">Pagamento via PIX</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {selectedSlot.unidade} - {selectedSlot.quadra}
              <br />
              {selectedSlot.horario}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 text-center border border-white/20">
              <p className="text-gray-300 mb-2">Valor a pagar:</p>
              <p className="text-4xl font-bold text-green-400">R$ {preco}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/20">
              <p className="text-gray-300 mb-3 text-center">Chave PIX:</p>
              <div className="flex items-center gap-2">
                <Input
                  value={pixKey}
                  readOnly
                  className="bg-white/10 border-white/30 text-white text-center text-xl font-mono"
                />
                <Button
                  onClick={handleCopyPix}
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/30 hover:bg-white/20"
                >
                  <Copy className="h-4 w-4 text-white" />
                </Button>
              </div>
              {pixCopied && <p className="text-green-400 text-sm text-center mt-2">Chave copiada!</p>}
            </div>

            <div className="bg-orange-500/20 rounded-lg p-6 text-center border border-orange-500/30">
              <Clock className="h-12 w-12 text-orange-400 mx-auto mb-3" />
              <p className="text-white text-lg mb-2">Aguarde para confirmar</p>
              <p className="text-5xl font-bold text-orange-400">{countdown}s</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmReservation}
                disabled={!canConfirm || loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Confirmando...
                  </>
                ) : canConfirm ? (
                  "Confirmar Pagamento"
                ) : (
                  `Aguarde ${countdown}s para confirmar`
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowPayment(false)
                  setCountdown(20)
                  setCanConfirm(false)
                }}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-white hover:text-orange-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Arena Coligados</h1>
          <p className="text-gray-300">Selecione o horário desejado</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {Object.entries(UNIDADES).map(([unidade, config]) => (
            <Card key={unidade} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{unidade}</CardTitle>
                <CardDescription className="text-orange-400 text-xl font-semibold">
                  R$ {config.preco} a hora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-white text-sm font-semibold p-2 border border-white/20">Horário</th>
                        {config.quadras.map((quadra) => (
                          <th key={quadra} className="text-white text-sm font-semibold p-2 border border-white/20">
                            {quadra}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HORARIOS.map((horario) => (
                        <tr key={horario}>
                          <td className="text-white text-sm p-2 border border-white/20 font-medium">{horario}</td>
                          {config.quadras.map((quadra) => {
                            const ocupado = isHorarioOcupado(unidade, quadra, horario)
                            const selecionado =
                              selectedSlot?.unidade === unidade &&
                              selectedSlot?.quadra === quadra &&
                              selectedSlot?.horario === horario

                            return (
                              <td key={quadra} className="p-1 border border-white/20">
                                <button
                                  type="button"
                                  onClick={() => handleSlotClick(unidade, quadra, horario)}
                                  disabled={ocupado}
                                  className={cn(
                                    "w-full h-10 rounded text-xs font-medium transition-all",
                                    ocupado && "bg-red-500/30 text-red-300 cursor-not-allowed",
                                    !ocupado && !selecionado && "bg-green-500/20 text-green-300 hover:bg-green-500/40",
                                    selecionado && "bg-orange-500 text-white ring-2 ring-orange-300",
                                  )}
                                >
                                  {ocupado ? "Ocupado" : selecionado ? "Selecionado" : "Disponível"}
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedSlot && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Confirme seus dados</CardTitle>
              <CardDescription className="text-gray-300">
                Horário selecionado: {selectedSlot.unidade} - {selectedSlot.quadra} às {selectedSlot.horario}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-white/10 border-white/30 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="bg-white/10 border-white/30 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/10 border-white/30 text-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg"
                  disabled={loading}
                >
                  Prosseguir para Pagamento
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

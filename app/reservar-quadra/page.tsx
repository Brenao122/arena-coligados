"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, Copy, Check, MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const MODALIDADES = [
  { id: "Beach Tennis", name: "Beach Tennis", icon: "🎾", description: "Partidas dinâmicas" },
  { id: "Vôlei", name: "Vôlei", icon: "🏐", description: "Jogo clássico de vôlei" },
  { id: "Futevôlei", name: "Futevôlei", icon: "⚽", description: "Fusão futebol + vôlei" },
  { id: "Tênis", name: "Tênis", icon: "🎾", description: "Tênis tradicional" },
]

const MODALIDADES_POR_QUADRA: Record<string, string[]> = {
  // Parque Amazônia
  "Parque Amazônia-Quadra 01": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Parque Amazônia-Quadra 02": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Parque Amazônia-Quadra 03": ["Vôlei", "Beach Tennis"], // SEM Futevôlei
  "Parque Amazônia-Quadra 04": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Parque Amazônia-Quadra 05": ["Vôlei", "Beach Tennis"], // SEM Futevôlei

  // Vila Rosa - Todas quadras compatíveis com todas modalidades
  "Vila Rosa-Q1": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Vila Rosa-Q2": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Vila Rosa-Q3": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Vila Rosa-Q4": ["Vôlei", "Futevôlei", "Beach Tennis"],
}

const UNIDADES = {
  "Parque Amazônia": {
    preco: 80.0,
    quadras: ["Quadra 01", "Quadra 02", "Quadra 03", "Quadra 04", "Quadra 05"],
  },
  "Vila Rosa": {
    preco: 70.0,
    quadras: ["Q1", "Q2", "Q3", "Q4"],
  },
}

const HORARIOS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
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

const formatDate = (date: Date) => {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  return {
    diaSemana: dias[date.getDay()],
    dia: date.getDate(),
    mes: meses[date.getMonth()],
    mesAbrev: meses[date.getMonth()].slice(0, 3),
    full: date.toISOString().split("T")[0],
  }
}

export default function ReservarQuadraPage() {
  const [step, setStep] = useState<
    "cadastro" | "modalidade" | "data" | "unidade" | "horarios" | "pagamento" | "sucesso"
  >("cadastro")
  const [loading, setLoading] = useState(false)
  const [leadId, setLeadId] = useState<string>("")

  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({})
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableDays] = useState<Date[]>(getNext7Days())

  const [selectedSlots, setSelectedSlots] = useState<Array<{ unidade: string; quadra: string; horario: string }>>([])

  const [selectedModalidade, setSelectedModalidade] = useState<string>("")
  const [selectedUnidade, setSelectedUnidade] = useState<string>("")

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "", // Agora opcional
  })

  const [paymentData, setPaymentData] = useState<{
    paymentId: string
    qrCodeBase64: string
    pixPayload: string
    expirationDate: string
  } | null>(null)

  const [checkingPayment, setCheckingPayment] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  const [timeRemaining, setTimeRemaining] = useState<number>(600) // 600 segundos = 10 minutos
  const [selectedSlot, setSelectedSlot] = useState<{ unidade: string; quadra: string; horario: string } | null>(null)

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      try {
        const response = await fetch("/api/sheets/reservas/list-all")
        if (response.ok) {
          const data = await response.json()
          const ocupados: Record<string, string[]> = {}

          data.reservas?.forEach((reserva: any) => {
            if (reserva.status === "CONFIRMADA") {
              const key = `${reserva.data}-${reserva.unidade}-${reserva.quadra}`
              if (!ocupados[key]) ocupados[key] = []
              if (reserva.horarios && !ocupados[key].includes(reserva.horarios)) {
                ocupados[key].push(reserva.horarios)
              }
            }
          })

          setHorariosOcupados(ocupados)
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar horários:", error)
      }
    }
    fetchHorariosOcupados()
    const interval = setInterval(fetchHorariosOcupados, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (step === "pagamento" && paymentData?.paymentId && selectedSlot) {
      const checkInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/asaas/check-payment?paymentId=${paymentData.paymentId}&unidade=${encodeURIComponent(selectedSlot.unidade)}`,
          )
          const result = await response.json()

          if (result.success && (result.payment.status === "RECEIVED" || result.payment.status === "CONFIRMED")) {
            clearInterval(checkInterval)
            await handleConfirmReservation()
          }
        } catch (error) {
          console.error("[v0] Erro ao verificar pagamento:", error)
        }
      }, 5000)

      return () => clearInterval(checkInterval)
    }
  }, [step, paymentData, selectedSlot])

  useEffect(() => {
    if (step === "pagamento" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            alert("Tempo expirado! Sua reserva foi cancelada.")
            window.location.href = "/"
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [step, timeRemaining])

  // Formatar tempo restante
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const isHorarioOcupado = (unidade: string, quadra: string, horario: string) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const key = `${dateStr}-${unidade}-${quadra}`
    return horariosOcupados[key]?.includes(horario) || false
  }

  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads - quadra",
          data: {
            timestamp: new Date().toISOString(),
            data: "",
            unidade: "",
            quadra: "",
            horarios: "",
            modalidade: "",
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            cpf: formData.cpf || "NÃO INFORMADO", // CPF opcional
            status: "LEAD",
            payment_id: "",
            valor_total: "",
            valor_reserva: "",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Erro da API:", errorData)
        throw new Error(errorData.error || "Erro ao salvar cadastro")
      }

      console.log("[v0] ✅ LEAD salvo com sucesso!")
      setStep("modalidade")
    } catch (error) {
      console.error("[v0] Erro ao salvar cadastro:", error)
      alert("Erro ao salvar dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setStep("unidade")
  }

  const handleHorarioToggle = (unidade: string, quadra: string, horario: string) => {
    if (isHorarioOcupado(unidade, quadra, horario)) return

    const exists = selectedSlots.find(
      (slot) => slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario,
    )

    if (exists) {
      // Remover seleção
      setSelectedSlots(
        selectedSlots.filter(
          (slot) => !(slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario),
        ),
      )
    } else {
      // Limitar a 3 horários
      if (selectedSlots.length >= 3) {
        alert("Você pode selecionar no máximo 3 horários")
        return
      }
      // Adicionar seleção
      setSelectedSlots([...selectedSlots, { unidade, quadra, horario }])
    }
  }

  const handleContinuarPagamento = async () => {
    if (selectedSlots.length === 0) {
      alert("Selecione pelo menos um horário")
      return
    }

    setLoading(true)

    try {
      const preco = UNIDADES[selectedUnidade as keyof typeof UNIDADES].preco
      const valorTotal = preco * selectedSlots.length * 0.5 // 30min = metade do preço
      const valorReserva = valorTotal / 2

      // Criar uma reserva para cada horário
      for (const slot of selectedSlots) {
        const reservaResponse = await fetch("/api/sheets/append", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetName: "leads - quadra",
            data: {
              timestamp: new Date().toISOString(),
              data: selectedDate.toISOString().split("T")[0],
              unidade: slot.unidade,
              quadra: slot.quadra,
              horarios: slot.horario,
              modalidade: selectedModalidade,
              nome: formData.nome,
              telefone: formData.telefone,
              email: formData.email,
              cpf: formData.cpf || "NÃO INFORMADO",
              status: "PENDENTE",
              payment_id: "",
              valor_total: valorTotal.toFixed(2),
              valor_reserva: valorReserva.toFixed(2),
            },
          }),
        })

        if (!reservaResponse.ok) {
          throw new Error("Erro ao criar reserva")
        }
      }

      // Gerar PIX no ASAAS
      const paymentResponse = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.nome,
            cpfCnpj: formData.cpf.replace(/\D/g, "") || "00000000000",
            email: formData.email || `${Date.now()}@temp.com`,
            phone: formData.telefone.replace(/\D/g, ""),
          },
          value: valorReserva,
          description: `Reserva ${selectedModalidade} - ${selectedSlots.length} horário(s)`,
          dueDate: new Date().toISOString().split("T")[0],
          externalReference: `${formData.telefone}-${Date.now()}`,
          unidade: selectedUnidade,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Erro ao gerar PIX")
      }

      const paymentResult = await paymentResponse.json()

      setPaymentData({
        paymentId: paymentResult.payment.id,
        qrCodeBase64: paymentResult.pix.qrCode,
        pixPayload: paymentResult.pix.payload,
        expirationDate: paymentResult.pix.expirationDate,
      })

      setTimeRemaining(600) // Resetar cronômetro
      setStep("pagamento")
    } catch (error) {
      console.error("[v0] Erro:", error)
      alert(error instanceof Error ? error.message : "Erro ao processar reserva")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReservation = async () => {
    try {
      if (!paymentData?.paymentId) return

      const updateResponse = await fetch("/api/sheets/reservas/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
          status: "CONFIRMADA",
        }),
      })

      if (updateResponse.ok) {
        console.log("[v0] ✅ Reserva CONFIRMADA!")
        setStep("sucesso")
      }
    } catch (error) {
      console.error("[v0] Erro ao confirmar:", error)
    }
  }

  const handleCopyPix = () => {
    if (paymentData?.pixPayload) {
      navigator.clipboard.writeText(paymentData.pixPayload)
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    }
  }

  const getQuadrasDisponiveis = () => {
    if (!selectedModalidade) return []
    if (!selectedUnidade) return []

    const quadrasComModalidade: Array<{ unidade: string; quadra: string }> = []

    Object.entries(MODALIDADES_POR_QUADRA).forEach(([quadraKey, modalidades]) => {
      if (modalidades.includes(selectedModalidade)) {
        const parts = quadraKey.split("-")
        const unidade = parts[0]
        const quadra = parts.slice(1).join("-")
        if (unidade === selectedUnidade) {
          quadrasComModalidade.push({ unidade, quadra })
        }
      }
    })

    return quadrasComModalidade
  }

  return (
    <div className="min-h-screen">
      {step === "cadastro" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-white hover:text-white/80">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center">Seus Dados</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Preencha seus dados para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCadastroSubmit}>
                  <div>
                    <Label htmlFor="nome" className="text-white">
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="João Silva"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-white">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      required
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email (opcional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seuemail@exemplo.com"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-white">
                      CPF (opcional)
                    </Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Continuar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === "modalidade" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("cadastro")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center">Escolha a Modalidade</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Olá {formData.nome}! Selecione qual esporte deseja praticar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {MODALIDADES.map((mod) => (
                    <Card
                      key={mod.id}
                      className={cn(
                        "cursor-pointer transition-all border-2 relative",
                        selectedModalidade === mod.id
                          ? "border-green-500 bg-green-900/20"
                          : "border-gray-700 bg-gray-800/50 hover:border-green-400",
                      )}
                      onClick={() => {
                        setSelectedModalidade(mod.id)
                        setStep("data")
                      }}
                    >
                      {selectedModalidade === mod.id && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="p-6 text-center">
                        <div className="text-5xl mb-3">{mod.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{mod.name}</h3>
                        <p className="text-sm text-gray-400">{mod.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === "data" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 text-white hover:text-white/80"
              onClick={() => setStep("modalidade")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center">Escolha a Data</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Modalidade: <span className="text-green-400 font-semibold">{selectedModalidade}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {availableDays.map((date) => {
                    const formatted = formatDate(date)
                    const isSelected = selectedDate.toDateString() === date.toDateString()

                    return (
                      <Card
                        key={formatted.full}
                        className={cn(
                          "cursor-pointer transition-all border-2",
                          isSelected
                            ? "border-green-500 bg-green-900/20"
                            : "border-gray-700 bg-gray-800/50 hover:border-green-400",
                        )}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="p-6 text-center">
                          <p className="text-sm text-gray-400 mb-1">{formatted.diaSemana}</p>
                          <p className="text-3xl font-bold text-white mb-1">{formatted.dia}</p>
                          <p className="text-sm text-gray-300">{formatted.mes}</p>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === "unidade" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("data")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center">Selecione a Unidade</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Escolha a unidade mais próxima de você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Parque Amazônia */}
                  <Card
                    className={cn(
                      "cursor-pointer transition-all border-2 hover:scale-105",
                      selectedUnidade === "Parque Amazônia"
                        ? "border-green-500 bg-green-900/20"
                        : "border-gray-700 bg-gray-800/50 hover:border-green-400",
                    )}
                    onClick={() => {
                      setSelectedUnidade("Parque Amazônia")
                      setStep("horarios")
                    }}
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Parque Amazônia</h3>
                        <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-semibold mb-4">
                          R$ 80,00 / hora
                        </div>
                      </div>

                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Parque Amazônia, Goiânia - GO</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">(62) 3225-5400</p>
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-sm font-semibold text-white mb-2">5 Quadras disponíveis</p>
                          <p className="text-xs text-gray-400">
                            Quadras 01, 02, 03, 04 e 05 com diferentes modalidades
                          </p>
                        </div>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">Selecionar</Button>
                    </CardContent>
                  </Card>

                  {/* Vila Rosa */}
                  <Card
                    className={cn(
                      "cursor-pointer transition-all border-2 hover:scale-105",
                      selectedUnidade === "Vila Rosa"
                        ? "border-green-500 bg-green-900/20"
                        : "border-gray-700 bg-gray-800/50 hover:border-green-400",
                    )}
                    onClick={() => {
                      setSelectedUnidade("Vila Rosa")
                      setStep("horarios")
                    }}
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Vila Rosa</h3>
                        <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-semibold mb-4">
                          R$ 70,00 / hora
                        </div>
                      </div>

                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Vila Rosa, Goiânia - GO</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">(62) 3224-1000</p>
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-sm font-semibold text-white mb-2">4 Quadras disponíveis</p>
                          <p className="text-xs text-gray-400">Quadras Q1, Q2, Q3 e Q4 com diferentes modalidades</p>
                        </div>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">Selecionar</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === "horarios" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("unidade")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Selecione os Horários</h1>
              <p className="text-gray-300">
                {formatDate(selectedDate).dia} de {formatDate(selectedDate).mes} - {selectedModalidade}
              </p>
              <p className="text-green-400 font-semibold mt-2">{selectedUnidade}</p>
              {selectedSlots.length > 0 && (
                <p className="text-white mt-2">
                  {selectedSlots.length} horário(s) selecionado(s) - R${" "}
                  {(UNIDADES[selectedUnidade as keyof typeof UNIDADES].preco * selectedSlots.length * 0.5).toFixed(2)}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white text-center">{selectedUnidade}</CardTitle>
                  <CardDescription className="text-center text-gray-300">
                    R$ {UNIDADES[selectedUnidade as keyof typeof UNIDADES].preco.toFixed(2)} por hora | R${" "}
                    {(UNIDADES[selectedUnidade as keyof typeof UNIDADES].preco * 0.5).toFixed(2)} por 30 minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getQuadrasDisponiveis().map((item) => (
                    <div key={item.quadra}>
                      <h4 className="text-white font-semibold mb-3">{item.quadra}</h4>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {HORARIOS.map((horario) => {
                          const ocupado = isHorarioOcupado(item.unidade, item.quadra, horario)
                          const selecionado = selectedSlots.some(
                            (slot) =>
                              slot.unidade === item.unidade && slot.quadra === item.quadra && slot.horario === horario,
                          )

                          return (
                            <Button
                              key={horario}
                              variant={selecionado ? "default" : ocupado ? "outline" : "secondary"}
                              disabled={ocupado}
                              onClick={() => handleHorarioToggle(item.unidade, item.quadra, horario)}
                              className={cn(
                                "text-sm relative",
                                ocupado
                                  ? "bg-red-900/20 border-red-500 text-red-400 cursor-not-allowed"
                                  : selecionado
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-700 hover:bg-gray-600 text-white",
                              )}
                            >
                              {selecionado && <CheckCircle2 className="h-3 w-3 absolute top-1 right-1" />}
                              {horario}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {selectedSlots.length > 0 && (
                    <Button
                      onClick={handleContinuarPagamento}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 mt-6"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        `Continuar para Pagamento - R$ ${((UNIDADES[selectedUnidade as keyof typeof UNIDADES].preco * selectedSlots.length * 0.5) / 2).toFixed(2)}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      {step === "pagamento" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center">Pagamento via PIX</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Escaneie o QR Code ou copie o código PIX
                </CardDescription>
                <div className="text-center mt-4">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg",
                      timeRemaining <= 120 ? "bg-red-600/30 text-red-300" : "bg-yellow-600/30 text-yellow-300",
                    )}
                  >
                    <Clock className="h-5 w-5" />
                    Tempo restante: {formatTimeRemaining()}
                  </div>
                  {timeRemaining <= 120 && <p className="text-red-400 text-sm mt-2">⚠️ Seu tempo está acabando!</p>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentData && (
                  <>
                    <div className="bg-white p-4 rounded-xl mx-auto w-fit">
                      <img
                        src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-64 h-64"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white">Código PIX Copia e Cola:</Label>
                      <div className="flex gap-2">
                        <Input
                          value={paymentData.pixPayload}
                          readOnly
                          className="bg-white/10 border-white/30 text-white text-sm"
                        />
                        <Button onClick={handleCopyPix} variant="outline" className="bg-green-600 hover:bg-green-700">
                          {pixCopied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-green-400" />
                        <p className="text-green-400 font-semibold">Aguardando confirmação do pagamento...</p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        A reserva será confirmada automaticamente após o pagamento
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === "sucesso" && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-2xl">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Reserva Confirmada!</h1>
              <p className="text-gray-300 text-lg">
                Sua reserva para {selectedModalidade} em {selectedSlot?.unidade} foi confirmada com sucesso!
              </p>
              <div className="bg-white/10 p-6 rounded-xl space-y-2">
                <p className="text-white">
                  <strong>Data:</strong> {formatDate(selectedDate).dia} de {formatDate(selectedDate).mes}
                </p>
                <p className="text-white">
                  <strong>Horário:</strong> {selectedSlot?.horario}
                </p>
                <p className="text-white">
                  <strong>Local:</strong> {selectedSlot?.unidade} - {selectedSlot?.quadra}
                </p>
              </div>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">Voltar para Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

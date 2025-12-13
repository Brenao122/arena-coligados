"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, Copy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const MODALIDADES = [
  { id: "Beach Tennis", name: "Beach Tennis", icon: "🎾", description: "Partidas dinâmicas" },
  { id: "Vôlei", name: "Vôlei", icon: "🏐", description: "Jogo clássico de vôlei" },
  { id: "Futevôlei", name: "Futevôlei", icon: "⚽", description: "Fusão futebol + vôlei" },
  { id: "Tênis", name: "Tênis", icon: "🎾", description: "Tênis tradicional" },
]

const MODALIDADES_POR_QUADRA: Record<string, string[]> = {
  "Parque Amazônia-Quadra 01": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Parque Amazônia-Quadra 02": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Parque Amazônia-Quadra 03": ["Vôlei", "Futevôlei"],
  "Parque Amazônia-Quadra 04": ["Beach Tennis", "Tênis"],
  "Parque Amazônia-Quadra 05": ["Vôlei", "Beach Tennis"],
  "Vila Rosa-Q1": ["Vôlei", "Futevôlei", "Beach Tennis"],
  "Vila Rosa-Q2": ["Vôlei", "Futevôlei"],
  "Vila Rosa-Q3": ["Beach Tennis", "Tênis"],
  "Vila Rosa-Q4": ["Vôlei", "Futevôlei", "Beach Tennis"],
}

const UNIDADES = {
  "Parque Amazônia": {
    preco: "80,00",
    quadras: ["Quadra 01", "Quadra 02", "Quadra 03", "Quadra 04", "Quadra 05"],
  },
  "Vila Rosa": {
    preco: "70,00",
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
  const router = useRouter()
  const [step, setStep] = useState<"modalidade" | "dados" | "data" | "horarios" | "pagamento">("modalidade")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({})
  const [horariosEmProcesso, setHorariosEmProcesso] = useState<Record<string, string[]>>({})

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableDays] = useState<Date[]>(getNext7Days())

  const [selectedSlots, setSelectedSlots] = useState<Array<{ unidade: string; quadra: string; horario: string }>>([])
  const [selectedModalidade, setSelectedModalidade] = useState<string>("")

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
  })

  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    paymentId: string
    qrCodeBase64: string
    pixPayload: string
    expirationDate: string
  } | null>(null)

  const [checkingPayment, setCheckingPayment] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      try {
        const response = await fetch("/api/sheets/reservas")
        if (response.ok) {
          const data = await response.json()
          const ocupados: Record<string, string[]> = {}

          data.reservas?.forEach((reserva: any) => {
            reserva.horarios?.forEach((horario: string) => {
              const key = `${reserva.data}-${reserva.unidade}-${reserva.quadra}`
              if (!ocupados[key]) ocupados[key] = []
              ocupados[key].push(horario)
            })
          })

          setHorariosOcupados(ocupados)
        }
      } catch (error) {
        console.error("[v0] Erro ao buscar horários:", error)
      }
    }
    fetchHorariosOcupados()

    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchHorariosOcupados, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showPayment && paymentData?.paymentId && !checkingPayment) {
      const checkInterval = setInterval(async () => {
        try {
          setCheckingPayment(true)
          const firstSlot = selectedSlots[0]
          const response = await fetch(
            `/api/asaas/check-payment?paymentId=${paymentData.paymentId}&unidade=${encodeURIComponent(firstSlot.unidade)}`,
          )
          const result = await response.json()

          if (result.success && (result.payment.status === "RECEIVED" || result.payment.status === "CONFIRMED")) {
            clearInterval(checkInterval)
            await handleConfirmReservation()
          }
        } catch (error) {
          console.error("[v0] Erro ao verificar pagamento:", error)
        } finally {
          setCheckingPayment(false)
        }
      }, 5000)

      return () => clearInterval(checkInterval)
    }
  }, [showPayment, paymentData, checkingPayment])

  const isHorarioOcupado = (unidade: string, quadra: string, horario: string) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const key = `${dateStr}-${unidade}-${quadra}`
    return horariosOcupados[key]?.includes(horario) || false
  }

  const isHorarioEmProcesso = (unidade: string, quadra: string, horario: string) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const key = `${dateStr}-${unidade}-${quadra}`
    return horariosEmProcesso[key]?.includes(horario) || false
  }

  const isSlotSelected = (unidade: string, quadra: string, horario: string) => {
    return selectedSlots.some((slot) => slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario)
  }

  const marcarHorarioEmProcesso = (unidade: string, quadra: string, horario: string, ativo: boolean) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const key = `${dateStr}-${unidade}-${quadra}`

    setHorariosEmProcesso((prev) => {
      const updated = { ...prev }
      if (ativo) {
        if (!updated[key]) updated[key] = []
        if (!updated[key].includes(horario)) {
          updated[key].push(horario)
        }
      } else {
        if (updated[key]) {
          updated[key] = updated[key].filter((h) => h !== horario)
        }
      }
      return updated
    })
  }

  const handleSlotClick = (unidade: string, quadra: string, horario: string) => {
    if (isHorarioOcupado(unidade, quadra, horario) || isHorarioEmProcesso(unidade, quadra, horario)) return

    const isSelected = isSlotSelected(unidade, quadra, horario)

    if (isSelected) {
      setSelectedSlots(
        selectedSlots.filter(
          (slot) => !(slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario),
        ),
      )
      marcarHorarioEmProcesso(unidade, quadra, horario, false)
    } else {
      if (selectedSlots.length > 0) {
        const firstSlot = selectedSlots[0]
        if (firstSlot.unidade !== unidade || firstSlot.quadra !== quadra) {
          alert("Por favor, selecione horários da mesma quadra")
          return
        }
      }
      setSelectedSlots([...selectedSlots, { unidade, quadra, horario }])
      marcarHorarioEmProcesso(unidade, quadra, horario, true)
    }
  }

  const calcularValorTotal = () => {
    if (selectedSlots.length === 0) return "0,00"
    const firstSlot = selectedSlots[0]
    const precoUnitario = Number.parseFloat(
      UNIDADES[firstSlot.unidade as keyof typeof UNIDADES]?.preco.replace(",", ".") || "0",
    )
    const total = precoUnitario * selectedSlots.length
    return total.toFixed(2).replace(".", ",")
  }

  const calcularValorReserva = () => {
    if (selectedSlots.length === 0) return "0,00"
    const valorTotal = calcularValorTotal().replace(",", ".")
    const valorReserva = Number.parseFloat(valorTotal) / 2
    return valorReserva.toFixed(2).replace(".", ",")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (!selectedModalidade || selectedSlots.length === 0) {
        alert("Por favor, selecione a modalidade e os horários")
        setLoading(false)
        return
      }

      if (!formData.nome || !formData.telefone || !formData.cpf) {
        alert("Por favor, preencha todos os dados")
        setLoading(false)
        return
      }

      const firstSlot = selectedSlots[0]
      const valorTotal = Number.parseFloat(UNIDADES[firstSlot.unidade as keyof typeof UNIDADES].preco.replace(",", "."))
      const valorReserva = valorTotal / 2

      const reservaResponse = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads - quadra",
          values: [
            [
              new Date().toISOString(), // timestamp
              selectedDate.toISOString().split("T")[0], // data
              firstSlot.unidade, // Unidade
              firstSlot.quadra, // quadra_id
              selectedSlots
                .map((s) => s.horario)
                .join(", "), // horarios
              selectedModalidade, // modalidade
              formData.nome, // nome
              formData.telefone, // whatsapp_number
              formData.email, // email
              formData.cpf, // cpf
              "PENDENTE", // Status inicial é PENDENTE
              "", // payment_id - será preenchido depois
              valorTotal.toFixed(2), // valor_total
              valorReserva.toFixed(2), // valor_reserva
            ],
          ],
        }),
      })

      if (!reservaResponse.ok) {
        throw new Error("Erro ao salvar reserva")
      }

      console.log("[v0] Reserva salva como PENDENTE")

      // Criar pagamento PIX
      const paymentResponse = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.nome,
            cpfCnpj: formData.cpf.replace(/\D/g, ""),
            email: formData.email || `${formData.cpf.replace(/\D/g, "")}@temp.com`,
            phone: formData.telefone.replace(/\D/g, ""),
          },
          value: valorTotal,
          description: `Reserva ${firstSlot.quadra} - ${selectedModalidade}`,
          dueDate: new Date().toISOString().split("T")[0],
          externalReference: `${formData.cpf}-${Date.now()}`,
          unidade: firstSlot.unidade,
        }),
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || "Erro ao criar pagamento")
      }

      const paymentResult = await paymentResponse.json()

      await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads - quadra",
          values: [
            [
              new Date().toISOString(),
              selectedDate.toISOString().split("T")[0],
              firstSlot.unidade,
              firstSlot.quadra,
              selectedSlots.map((s) => s.horario).join(", "),
              selectedModalidade,
              formData.nome,
              formData.telefone,
              formData.email,
              formData.cpf,
              "PENDENTE",
              paymentResult.payment.id, // payment_id
              valorTotal.toFixed(2),
              valorReserva.toFixed(2),
            ],
          ],
        }),
      })

      setPaymentData({
        paymentId: paymentResult.payment.id,
        qrCodeBase64: paymentResult.pix.qrCode,
        pixPayload: paymentResult.pix.payload,
        expirationDate: paymentResult.pix.expirationDate,
      })

      setShowPayment(true)
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

      // Atualizar status para CONFIRMADA
      const updateResponse = await fetch("/api/sheets/reservas/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
          status: "CONFIRMADA",
        }),
      })

      if (updateResponse.ok) {
        console.log("[v0] Status atualizado para CONFIRMADA")
        setSuccess(true)
        setShowPayment(false)
      }
    } catch (error) {
      console.error("[v0] Erro ao confirmar reserva:", error)
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

    const quadrasComModalidade: Array<{ unidade: string; quadra: string }> = []

    Object.entries(MODALIDADES_POR_QUADRA).forEach(([quadraKey, modalidades]) => {
      if (modalidades.includes(selectedModalidade)) {
        const [unidade, quadra] = quadraKey.split("-")
        quadrasComModalidade.push({ unidade, quadra })
      }
    })

    return quadrasComModalidade
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20 text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Pagamento Confirmado!</CardTitle>
            <CardDescription className="text-gray-300 text-lg mt-2">
              Sua reserva foi confirmada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <p className="text-gray-300 mb-2">
                <strong>Data:</strong> {formatDate(selectedDate).dia} de {formatDate(selectedDate).mes}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Modalidade:</strong> {selectedModalidade}
              </p>
              <p className="text-gray-300">
                <strong>Horários:</strong> {selectedSlots.map((s) => s.horario).join(", ")}
              </p>
            </div>
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700">Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "modalidade") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white text-center">Escolha a Modalidade</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Selecione qual esporte deseja praticar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {MODALIDADES.map((mod) => (
                  <Card
                    key={mod.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedModalidade === mod.id
                        ? "border-green-500 bg-green-900/20"
                        : "border-gray-700 bg-gray-800/50 hover:border-green-400"
                    }`}
                    onClick={() => {
                      setSelectedModalidade(mod.id)
                      setStep("dados")
                    }}
                  >
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
    )
  }

  if (step === "dados") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("modalidade")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white text-center">Seus Dados</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Modalidade selecionada: <span className="text-green-400 font-semibold">{selectedModalidade}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep("data")
                }}
              >
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
                    className="bg-white/10 border-white/30 text-white"
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
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-white">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                    className="bg-white/10 border-white/30 text-white"
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
                    placeholder="joao@example.com"
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Continuar para Data
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "data") {
    const mesAtual = formatDate(availableDays[0]).mes

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("dados")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white text-center">Escolha a Data</CardTitle>
              <CardDescription className="text-gray-300 text-center text-xl">{mesAtual}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
                {availableDays.map((date) => {
                  const formatted = formatDate(date)
                  const isSelected = selectedDate.toDateString() === date.toDateString()

                  return (
                    <Button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date)
                        setStep("horarios")
                      }}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "flex flex-col items-center py-6 h-auto",
                        isSelected
                          ? "bg-green-600 hover:bg-green-700 text-white border-green-500"
                          : "bg-white/10 hover:bg-white/20 text-white border-white/30",
                      )}
                    >
                      <span className="text-xs font-medium">{formatted.diaSemana}</span>
                      <span className="text-2xl font-bold">{formatted.dia}</span>
                      <span className="text-xs">{formatted.mesAbrev}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "horarios") {
    const quadrasDisponiveis = getQuadrasDisponiveis()
    const parqueQuadras = quadrasDisponiveis.filter((q) => q.unidade === "Parque Amazônia")
    const vilaQuadras = quadrasDisponiveis.filter((q) => q.unidade === "Vila Rosa")

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80" onClick={() => setStep("data")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white text-center">
                Horários Disponíveis - {formatDate(selectedDate).diaSemana}, {formatDate(selectedDate).dia} de{" "}
                {formatDate(selectedDate).mes}
              </CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Modalidade: <span className="text-green-400">{selectedModalidade}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Parque Amazônia */}
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-4">🏖️ Parque Amazônia</h3>
                  {parqueQuadras.map(({ unidade, quadra }) => (
                    <div key={`${unidade}-${quadra}`} className="mb-6 bg-white/5 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">{quadra}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {HORARIOS.map((horario) => {
                          const ocupado = isHorarioOcupado(unidade, quadra, horario)
                          const emProcesso = isHorarioEmProcesso(unidade, quadra, horario)
                          const selecionado = isSlotSelected(unidade, quadra, horario)

                          return (
                            <Button
                              key={horario}
                              onClick={() => handleSlotClick(unidade, quadra, horario)}
                              disabled={ocupado || emProcesso}
                              size="sm"
                              className={cn(
                                "text-xs h-10",
                                selecionado && "bg-yellow-500 hover:bg-yellow-600 text-black",
                                !selecionado && !ocupado && !emProcesso && "bg-green-700 hover:bg-green-600 text-white",
                                ocupado && "bg-red-900 text-red-300 cursor-not-allowed opacity-50",
                                emProcesso && "bg-orange-700 text-orange-300 cursor-not-allowed opacity-70",
                              )}
                            >
                              {horario}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {parqueQuadras.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      Nenhuma quadra disponível para {selectedModalidade}
                    </p>
                  )}
                </div>

                {/* Vila Rosa */}
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-4">🏐 Vila Rosa</h3>
                  {vilaQuadras.map(({ unidade, quadra }) => (
                    <div key={`${unidade}-${quadra}`} className="mb-6 bg-white/5 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">{quadra}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {HORARIOS.map((horario) => {
                          const ocupado = isHorarioOcupado(unidade, quadra, horario)
                          const emProcesso = isHorarioEmProcesso(unidade, quadra, horario)
                          const selecionado = isSlotSelected(unidade, quadra, horario)

                          return (
                            <Button
                              key={horario}
                              onClick={() => handleSlotClick(unidade, quadra, horario)}
                              disabled={ocupado || emProcesso}
                              size="sm"
                              className={cn(
                                "text-xs h-10",
                                selecionado && "bg-yellow-500 hover:bg-yellow-600 text-black",
                                !selecionado && !ocupado && !emProcesso && "bg-green-700 hover:bg-green-600 text-white",
                                ocupado && "bg-red-900 text-red-300 cursor-not-allowed opacity-50",
                                emProcesso && "bg-orange-700 text-orange-300 cursor-not-allowed opacity-70",
                              )}
                            >
                              {horario}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {vilaQuadras.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      Nenhuma quadra disponível para {selectedModalidade}
                    </p>
                  )}
                </div>
              </div>

              {/* Legenda */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-700 rounded" /> Disponível
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" /> Selecionado
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-700 rounded" /> Em processo
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-900 rounded" /> Ocupado
                </span>
              </div>

              {/* Resumo e botão de continuar */}
              {selectedSlots.length > 0 && (
                <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-white mb-2">
                    <strong>{selectedSlots.length}</strong> horário(s) selecionado(s)
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {selectedSlots[0].unidade} - {selectedSlots[0].quadra}
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      `Ir para Pagamento - R$ ${calcularValorReserva()}`
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showPayment && selectedSlots.length > 0) {
    const firstSlot = selectedSlots[0]
    const valorTotal = calcularValorTotal()
    const valorReserva = calcularValorReserva()

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">Pagamento via PIX</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {firstSlot.unidade} - {firstSlot.quadra}
              <br />
              {selectedSlots.map((slot) => slot.horario).join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 text-center border border-white/20">
              <p className="text-gray-400 text-sm mb-1">Valor total:</p>
              <p className="text-2xl font-semibold text-gray-300">R$ {valorTotal}</p>
              <div className="border-t border-white/20 my-3" />
              <p className="text-gray-300 mb-2">Valor da reserva (50%):</p>
              <p className="text-4xl font-bold text-green-400">R$ {valorReserva}</p>
              <p className="text-xs text-gray-400 mt-2">Restante será pago no local</p>
            </div>

            {paymentData && (
              <>
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-64 h-64"
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                  <p className="text-gray-300 mb-3 text-center font-medium">Ou copie o código PIX:</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={paymentData.pixPayload}
                      readOnly
                      className="bg-white/10 border-white/30 text-white text-xs font-mono"
                    />
                    <Button
                      onClick={handleCopyPix}
                      variant="outline"
                      size="icon"
                      className="bg-orange-500 hover:bg-orange-600 border-orange-400 text-white shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {pixCopied && (
                    <p className="text-green-400 text-sm text-center mt-2 font-medium">✓ Código copiado!</p>
                  )}
                </div>

                <div className="bg-blue-500/20 rounded-lg p-4 text-center border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    {checkingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                        Verificando pagamento...
                      </>
                    ) : (
                      "Aguardando confirmação do pagamento..."
                    )}
                  </p>
                </div>
              </>
            )}

            <Button
              onClick={handleConfirmReservation}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                "Confirmar Pagamento Manualmente"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

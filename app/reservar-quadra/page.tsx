"use client"

// Google Sheets integration configured with Base64 private key
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, Copy, Calendar } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
    pix: "12345678",
  },
  "Vila Rosa": {
    preco: "70,00",
    quadras: ["Q1", "Q2", "Q3", "Q4"],
    pix: "87654321",
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

const isHorarioBloqueado = (horario: string, dataReserva?: Date) => {
  const data = dataReserva || new Date()
  const diaSemana = data.getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const isSegundaASexta = diaSemana >= 1 && diaSemana <= 5

  if (isSegundaASexta && (horario === "19:30" || horario === "20:00")) {
    return true
  }

  return false
}

const isHorarioPassado = (horario: string, dataReserva: Date) => {
  const agora = new Date()
  const [hora, minuto] = horario.split(":").map(Number)

  const dataHoraSelecionada = new Date(dataReserva)
  dataHoraSelecionada.setHours(hora, minuto, 0, 0)

  return dataHoraSelecionada < agora
}

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
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  return {
    diaSemana: dias[date.getDay()],
    dia: date.getDate(),
    mes: meses[date.getMonth()],
    full: date.toISOString().split("T")[0],
  }
}

export default function ReservarQuadraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({})

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [availableDays] = useState<Date[]>(getNext7Days())

  const [selectedSlots, setSelectedSlots] = useState<
    Array<{
      unidade: string
      quadra: string
      horario: string
    }>
  >([])
  const [selectedModalidade, setSelectedModalidade] = useState<string>("")
  const [showModalidadeDialog, setShowModalidadeDialog] = useState(false)
  const [tempSlot, setTempSlot] = useState<{
    unidade: string
    quadra: string
    horario: string
  } | null>(null)

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
  const [countdown, setCountdown] = useState(20)
  const [canConfirm, setCanConfirm] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)
  const SERVICE_ACCOUNT_EMAIL = "service-account-email@example.com"

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      try {
        console.log("[v0] Buscando horários ocupados...")
        const response = await fetch("/api/sheets/reservas")
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Dados recebidos:", data)

          const ocupados: Record<string, string[]> = {}

          data.reservas?.forEach((reserva: any) => {
            // Para cada horário da reserva, marcar como ocupado
            reserva.horarios?.forEach((horario: string) => {
              const key = `${reserva.data}-${reserva.unidade}-${reserva.quadra}`
              if (!ocupados[key]) ocupados[key] = []
              ocupados[key].push(horario)
            })
          })

          console.log("[v0] Horários ocupados processados:", ocupados)
          setHorariosOcupados(ocupados)
        } else {
          console.error("[v0] Erro na resposta:", response.status)
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

  useEffect(() => {
    if (showPayment && paymentData?.paymentId && !checkingPayment) {
      const checkInterval = setInterval(async () => {
        try {
          setCheckingPayment(true)
          const response = await fetch(`/api/asaas/check-payment?paymentId=${paymentData.paymentId}`)
          const result = await response.json()

          if (result.success && (result.payment.status === "RECEIVED" || result.payment.status === "CONFIRMED")) {
            console.log("[v0] Pagamento confirmado automaticamente!")
            clearInterval(checkInterval)
            await handleConfirmReservation()
          }
        } catch (error) {
          console.error("[v0] Erro ao verificar pagamento:", error)
        } finally {
          setCheckingPayment(false)
        }
      }, 5000) // Verifica a cada 5 segundos

      return () => clearInterval(checkInterval)
    }
  }, [showPayment, paymentData, checkingPayment])

  const isHorarioOcupado = (unidade: string, quadra: string, horario: string) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const key = `${dateStr}-${unidade}-${quadra}`
    return horariosOcupados[key]?.includes(horario) || false
  }

  const isSlotSelected = (unidade: string, quadra: string, horario: string) => {
    return selectedSlots.some((slot) => slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario)
  }

  const handleSlotClick = (unidade: string, quadra: string, horario: string) => {
    if (
      isHorarioOcupado(unidade, quadra, horario) ||
      isHorarioBloqueado(horario, selectedDate) ||
      isHorarioPassado(horario, selectedDate)
    )
      return

    const isSelected = isSlotSelected(unidade, quadra, horario)

    if (isSelected) {
      setSelectedSlots(
        selectedSlots.filter(
          (slot) => !(slot.unidade === unidade && slot.quadra === quadra && slot.horario === horario),
        ),
      )
    } else {
      if (selectedSlots.length > 0) {
        const firstSlot = selectedSlots[0]
        if (firstSlot.unidade !== unidade || firstSlot.quadra !== quadra) {
          alert("Por favor, selecione horários da mesma quadra")
          return
        }
      }

      setTempSlot({ unidade, quadra, horario })

      if (selectedModalidade) {
        setSelectedSlots([...selectedSlots, { unidade, quadra, horario }])
      } else {
        setShowModalidadeDialog(true)
      }
    }
  }

  const handleModalidadeSelect = (modalidade: string) => {
    if (tempSlot) {
      setSelectedSlots([...selectedSlots, tempSlot])
      setSelectedModalidade(modalidade)
      setShowModalidadeDialog(false)
      setTempSlot(null)
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
    if (selectedSlots.length === 0) {
      alert("Por favor, selecione pelo menos um horário")
      return
    }

    setLoading(true)
    try {
      const firstSlot = selectedSlots[0]
      const valorTotal = calcularValorTotal().replace(",", ".")
      const dataReserva = selectedDate.toISOString().split("T")[0]

      console.log("[v0] Criando cobrança PIX no Asaas...")

      const response = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.nome,
            cpfCnpj: formData.cpf,
            email: formData.email,
            phone: formData.telefone.replace(/\D/g, ""),
          },
          value: Number.parseFloat(valorTotal),
          description: `Reserva ${firstSlot.unidade} - ${firstSlot.quadra} - ${selectedModalidade}`,
          dueDate: dataReserva,
          externalReference: `${dataReserva}-${firstSlot.unidade}-${firstSlot.quadra}-${Date.now()}`,
          unidade: firstSlot.unidade, // Enviando a unidade
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("[v0] Erro ao criar cobrança:", result)
        alert(`Erro ao gerar pagamento: ${result.error || "Tente novamente"}`)
        return
      }

      console.log("[v0] Cobrança criada com sucesso:", result.payment.id)

      setPaymentData({
        paymentId: result.payment.id,
        qrCodeBase64: result.pix.qrCode,
        pixPayload: result.pix.payload,
        expirationDate: result.pix.expirationDate,
      })

      setShowPayment(true)
    } catch (error) {
      console.error("[v0] Erro ao criar pagamento:", error)
      alert("Erro ao processar pagamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPix = () => {
    if (paymentData?.pixPayload) {
      navigator.clipboard.writeText(paymentData.pixPayload)
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    }
  }

  const handleConfirmReservation = async () => {
    if (selectedSlots.length === 0) return

    setLoading(true)

    try {
      const horariosFormatados = selectedSlots.map((slot) => slot.horario).sort()

      // Formatar horários: se consecutivos, usar intervalo (08:30 - 10:00), senão listar (08:30, 09:00, 10:00)
      let horariosString = ""
      if (horariosFormatados.length === 1) {
        horariosString = horariosFormatados[0]
      } else {
        // Verificar se são consecutivos
        const saoConsecutivos = horariosFormatados.every((horario, index) => {
          if (index === 0) return true
          const indexAnterior = HORARIOS.indexOf(horariosFormatados[index - 1])
          const indexAtual = HORARIOS.indexOf(horario)
          return indexAtual === indexAnterior + 1
        })

        if (saoConsecutivos) {
          // Formato de intervalo: "08:30 - 10:00"
          const primeiroHorario = horariosFormatados[0]
          const ultimoIndex = HORARIOS.indexOf(horariosFormatados[horariosFormatados.length - 1])
          const horarioFim = HORARIOS[ultimoIndex + 1] || horariosFormatados[horariosFormatados.length - 1]
          horariosString = `${primeiroHorario} - ${horarioFim}`
        } else {
          // Formato de lista: "08:30, 09:00, 10:00"
          horariosString = horariosFormatados.join(", ")
        }
      }

      const extrairNumeroQuadra = (quadra: string): string => {
        const match = quadra.match(/\d+/)
        if (match) {
          const numero = match[0].padStart(2, "0")
          return `Quadra ${numero}`
        }
        return quadra
      }

      const firstSlot = selectedSlots[0]
      const dataReserva = selectedDate.toISOString().split("T")[0]
      const preco = UNIDADES[firstSlot.unidade as keyof typeof UNIDADES]?.preco.replace(",", ".")
      const valorTotal = (Number.parseFloat(preco) * selectedSlots.length).toFixed(2)

      const dadosReserva = {
        whatsapp_number: formData.telefone,
        nome: formData.nome,
        Unidade: firstSlot.unidade,
        esporte: selectedModalidade,
        quadra_id: extrairNumeroQuadra(firstSlot.quadra),
        data: dataReserva,
        horarios: horariosString,
        valor_total: valorTotal,
        observacoes: `Email: ${formData.email}${paymentData ? ` | Pagamento ID: ${paymentData.paymentId}` : ""}`,
        status: "Confirmado",
      }

      console.log("[v0] ===== INICIANDO ENVIO DE RESERVA =====")
      console.log("[v0] Dados da reserva:", JSON.stringify(dadosReserva, null, 2))

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads - quadra",
          data: dadosReserva,
        }),
      })

      console.log("[v0] Status da resposta:", response.status, response.statusText)

      const result = await response.json()
      console.log("[v0] Resposta completa da API:", JSON.stringify(result, null, 2))

      if (!response.ok) {
        console.error("[v0] ❌ ERRO na resposta da API")
        alert(`Erro ao processar reserva: ${result.error || "Erro desconhecido"}`)
        return
      }

      console.log("[v0] ✅ Reserva confirmada com sucesso!")
      setSuccess(true)
      setTimeout(() => router.push("/"), 3000)
    } catch (error) {
      console.error("[v0] ❌ ERRO ao enviar formulário:", error)
      alert(`❌ ${error instanceof Error ? error.message : "Erro desconhecido"}`)
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

  if (showPayment && selectedSlots.length > 0) {
    const firstSlot = selectedSlots[0]
    const valorTotal = calcularValorTotal()
    const valorReserva = calcularValorReserva() // Usar valor da reserva (50%)

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">Pagamento via PIX</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              {firstSlot.unidade} - {firstSlot.quadra}
              <br />
              {selectedSlots.map((slot) => slot.horario).join(", ")}
              <br />
              <span className="text-orange-400 font-semibold">
                {selectedSlots.length} {selectedSlots.length === 1 ? "hora" : "horas"}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 text-center border border-white/20 space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">Valor total:</p>
                <p className="text-2xl font-semibold text-gray-300">R$ {valorTotal}</p>
              </div>
              <div className="border-t border-white/20 pt-3">
                <p className="text-gray-300 mb-2">Valor da reserva (50%):</p>
                <p className="text-4xl font-bold text-green-400">R$ {valorReserva}</p>
                <p className="text-xs text-gray-400 mt-2">Restante será pago no local</p>
              </div>
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
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Cole este código no seu aplicativo de pagamento
                  </p>
                </div>
                {/* </CHANGE> */}

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
                  <p className="text-xs text-gray-400 mt-2">
                    O pagamento será confirmado automaticamente após a aprovação
                  </p>
                </div>
              </>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleConfirmReservation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  "Já paguei - Confirmar Manualmente"
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowPayment(false)
                  setPaymentData(null)
                  setCountdown(20)
                  setCanConfirm(false)
                }}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Cancelar
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
          <p className="text-gray-300">Selecione a data e o horário desejado</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-orange-400" />
              Selecione a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {availableDays.map((date) => {
                const formatted = formatDate(date)
                const isSelected = selectedDate.toISOString().split("T")[0] === formatted.full
                const isToday = new Date().toISOString().split("T")[0] === formatted.full

                return (
                  <button
                    key={formatted.full}
                    onClick={() => {
                      setSelectedDate(date)
                      setSelectedSlots([])
                      setSelectedModalidade("")
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg transition-all",
                      "border-2",
                      isSelected && "bg-orange-500 border-orange-400 text-white",
                      !isSelected && "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10",
                      isToday && !isSelected && "border-orange-400/50",
                    )}
                  >
                    <span className="text-xs font-medium mb-1">{formatted.diaSemana}</span>
                    <span className="text-2xl font-bold">{formatted.dia}</span>
                    <span className="text-xs">{formatted.mes}</span>
                    {isToday && <span className="text-xs text-orange-400 mt-1">Hoje</span>}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showModalidadeDialog} onOpenChange={setShowModalidadeDialog}>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-400">Qual modalidade você vai jogar?</DialogTitle>
              <DialogDescription className="text-gray-300 text-base">
                {tempSlot && (
                  <>
                    <span className="font-semibold">
                      {tempSlot.unidade} - {tempSlot.quadra} às {tempSlot.horario}
                    </span>
                    <br />
                    <span className="text-sm">Esta quadra suporta:</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {tempSlot &&
                MODALIDADES_POR_QUADRA[`${tempSlot.unidade}-${tempSlot.quadra}`]?.map((modalidade) => (
                  <Button
                    key={modalidade}
                    onClick={() => handleModalidadeSelect(modalidade)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 text-lg"
                  >
                    {modalidade}
                  </Button>
                ))}
            </div>
          </DialogContent>
        </Dialog>

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
                            const bloqueado = isHorarioBloqueado(horario, selectedDate)
                            const passado = isHorarioPassado(horario, selectedDate)
                            const indisponivel = ocupado || bloqueado || passado
                            const selecionado = isSlotSelected(unidade, quadra, horario)

                            return (
                              <td key={quadra} className="p-1 border border-white/20">
                                <button
                                  type="button"
                                  onClick={() => handleSlotClick(unidade, quadra, horario)}
                                  disabled={indisponivel}
                                  className={cn(
                                    "w-full h-10 rounded text-xs font-medium transition-all",
                                    indisponivel && "bg-red-500/30 text-red-300 cursor-not-allowed",
                                    !indisponivel &&
                                      !selecionado &&
                                      "bg-green-500/20 text-green-300 hover:bg-green-500/40",
                                    selecionado && "bg-orange-500 text-white ring-2 ring-orange-300",
                                  )}
                                >
                                  {passado
                                    ? "Passado"
                                    : bloqueado
                                      ? "Bloqueado"
                                      : ocupado
                                        ? "Ocupado"
                                        : selecionado
                                          ? "Selecionado"
                                          : "Disponível"}
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

        {selectedSlots.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Confirme seus dados</CardTitle>
              <CardDescription className="text-gray-300">
                Data: {formatDate(selectedDate).dia} de {formatDate(selectedDate).mes} (
                {formatDate(selectedDate).diaSemana})
                <br />
                Horários: {selectedSlots[0].unidade} - {selectedSlots[0].quadra}
                <br />
                <span className="text-orange-400 font-semibold">
                  {selectedSlots.map((slot) => slot.horario).join(", ")} ({selectedSlots.length}{" "}
                  {selectedSlots.length === 1 ? "hora" : "horas"})
                </span>
                <br />
                <span className="text-orange-400 font-semibold">Modalidade: {selectedModalidade}</span>
                <br />
                <span className="text-green-400 font-bold text-lg">Valor Total: R$ {calcularValorTotal()}</span>
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

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-white">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => {
                      // Remove caracteres não numéricos
                      const cpfLimpo = e.target.value.replace(/\D/g, "")
                      // Limita a 11 dígitos
                      if (cpfLimpo.length <= 11) {
                        setFormData({ ...formData, cpf: cpfLimpo })
                      }
                    }}
                    placeholder="Apenas números (11 dígitos)"
                    className="bg-white/10 border-white/30 text-white"
                    maxLength={11}
                    required
                  />
                  <p className="text-xs text-gray-400">Digite apenas os números do CPF (sem pontos ou traços)</p>
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

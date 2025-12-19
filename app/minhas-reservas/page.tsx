"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Clock, MapPin, Calendar, X } from "lucide-react"

interface Reserva {
  id: string
  data: string
  horarios: string[]
  unidade: string
  modalidade: string
  valor: number
  status: string
  payment_id: string
  created_at: string
  nome: string
  telefone: string
}

export default function MinhasReservasPage() {
  const router = useRouter()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [telefone, setTelefone] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(true)

  const buscarReservas = async () => {
    if (!telefone) return

    try {
      setLoading(true)
      const response = await fetch(`/api/sheets/reservas/buscar-por-telefone?telefone=${telefone}`)
      const data = await response.json()

      if (data.success) {
        setReservas(data.reservas)
        setMostrarFormulario(false)
      }
    } catch (error) {
      console.error("Erro ao buscar reservas:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularHorasParaCancelamento = (dataReserva: string, horario: string) => {
    const [dia, mes, ano] = dataReserva.split("/")
    const [hora, minuto] = horario.split(":")
    const dataHoraReserva = new Date(
      Number.parseInt(ano),
      Number.parseInt(mes) - 1,
      Number.parseInt(dia),
      Number.parseInt(hora),
      Number.parseInt(minuto),
    )
    const agora = new Date()
    const diferencaHoras = (dataHoraReserva.getTime() - agora.getTime()) / (1000 * 60 * 60)
    return diferencaHoras
  }

  const calcularCredito = (valor: number, horasRestantes: number) => {
    if (horasRestantes >= 8) {
      return { percentual: 100, valor: valor }
    } else if (horasRestantes >= 4) {
      return { percentual: 50, valor: valor * 0.5 }
    } else {
      return { percentual: 0, valor: 0 }
    }
  }

  const handleCancelar = async (reserva: Reserva) => {
    const primeiroHorario = reserva.horarios[0]
    const horasRestantes = calcularHorasParaCancelamento(reserva.data, primeiroHorario)
    const credito = calcularCredito(reserva.valor, horasRestantes)

    if (credito.percentual === 0) {
      alert("Não é possível cancelar esta reserva. O prazo mínimo de 4 horas antes do horário já passou.")
      return
    }

    const confirmar = confirm(
      `Deseja cancelar esta reserva?\n\nVocê receberá ${credito.percentual}% de crédito (R$ ${credito.valor.toFixed(2)}) para usar em futuras reservas.`,
    )

    if (!confirmar) return

    try {
      setCancelando(reserva.payment_id)

      const response = await fetch("/api/sheets/reservas/cancelar-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: reserva.payment_id,
          telefone: reserva.telefone,
          credito: credito.valor,
          percentual: credito.percentual,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Reserva cancelada com sucesso!\n\nCrédito de R$ ${credito.valor.toFixed(2)} adicionado à sua conta.`)
        buscarReservas()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error)
      alert("Erro ao cancelar reserva. Tente novamente.")
    } finally {
      setCancelando(null)
    }
  }

  const podeCancelar = (reserva: Reserva) => {
    if (reserva.status !== "CONFIRMED" && reserva.status !== "PENDENTE") return false
    const primeiroHorario = reserva.horarios[0]
    const horasRestantes = calcularHorasParaCancelamento(reserva.data, primeiroHorario)
    return horasRestantes >= 4
  }

  if (mostrarFormulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-slate-800/50 border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-6">Minhas Reservas</h1>
          <p className="text-gray-300 mb-6">Digite seu telefone para visualizar suas reservas</p>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-4"
          />
          <Button
            onClick={buscarReservas}
            disabled={loading || !telefone}
            className="w-full bg-gradient-to-r from-orange-500 to-green-500"
          >
            {loading ? "Buscando..." : "Buscar Reservas"}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Minhas Reservas</h1>
          <Button
            onClick={() => {
              setMostrarFormulario(true)
              setTelefone("")
              setReservas([])
            }}
            variant="outline"
            className="border-slate-600 text-white"
          >
            Trocar Telefone
          </Button>
        </div>

        {reservas.length === 0 ? (
          <Card className="p-8 bg-slate-800/50 border-slate-700 text-center">
            <p className="text-gray-300">Nenhuma reserva encontrada</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => {
              const primeiroHorario = reserva.horarios[0]
              const horasRestantes = calcularHorasParaCancelamento(reserva.data, primeiroHorario)
              const credito = calcularCredito(reserva.valor, horasRestantes)

              return (
                <Card key={reserva.id} className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-400" />
                        <span className="text-white font-semibold">{reserva.data}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">{reserva.horarios.join(", ")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">
                          {reserva.unidade} - {reserva.modalidade}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-sm text-gray-400">Valor: R$ {reserva.valor.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">
                          Status:{" "}
                          <span
                            className={
                              reserva.status === "CONFIRMED"
                                ? "text-green-400"
                                : reserva.status === "CANCELADA"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            }
                          >
                            {reserva.status === "CONFIRMED"
                              ? "Confirmada"
                              : reserva.status === "CANCELADA"
                                ? "Cancelada"
                                : "Pendente"}
                          </span>
                        </p>
                      </div>

                      {podeCancelar(reserva) && (
                        <div className="pt-2">
                          <p className="text-xs text-green-400">
                            Crédito ao cancelar: {credito.percentual}% (R$ {credito.valor.toFixed(2)})
                          </p>
                        </div>
                      )}
                    </div>

                    {podeCancelar(reserva) && (
                      <Button
                        onClick={() => handleCancelar(reserva)}
                        disabled={cancelando === reserva.payment_id}
                        variant="destructive"
                        size="sm"
                        className="ml-4"
                      >
                        {cancelando === reserva.payment_id ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Cancelando
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Cancelar
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

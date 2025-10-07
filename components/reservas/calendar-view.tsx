"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface Reserva {
  id: string
  nome: string
  telefone: string
  email: string
  unidade: string
  modalidade: string
  data: string
  horario: string
  observacoes: string
  status: string
  data_cadastro: string
}

interface CalendarViewProps {
  onCreateReserva: () => void
}

export function CalendarView({ onCreateReserva }: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const timeSlots = [
    "06:00",
    "07:00",
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
    "22:00",
  ]

  useEffect(() => {
    fetchReservas()
  }, [currentWeek])

  const fetchReservas = async () => {
    try {
      setLoading(true)
      console.log("[v0] Buscando reservas do Google Sheets...")

      const response = await fetch("/api/sheets/reservas")
      if (!response.ok) throw new Error("Erro ao buscar reservas")

      const data = await response.json()
      console.log("[v0] Reservas recebidas:", data.length)

      // Transformar dados do Google Sheets para o formato do calendário
      const transformedReservas = data
        .map((row: any, index: number) => {
          try {
            // Parse da data no formato DD/MM/YYYY ou YYYY-MM-DD
            let reservaDate: Date
            if (row.data?.includes("/")) {
              const [day, month, year] = row.data.split("/")
              reservaDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
            } else {
              reservaDate = new Date(row.data)
            }

            // Verificar se a reserva está na semana atual
            if (reservaDate < weekStart || reservaDate > weekEnd) {
              return null
            }

            return {
              id: `reserva-${index}`,
              nome: row.nome || "Cliente não informado",
              telefone: row.telefone || "",
              email: row.email || "",
              unidade: row.unidade || "Unidade não informada",
              modalidade: row.modalidade || "Modalidade não informada",
              data: row.data,
              horario: row.horario || "00:00",
              observacoes: row.observacoes || "",
              status: row.status || "Pendente",
              data_cadastro: row.data_cadastro || new Date().toISOString(),
            }
          } catch (error) {
            console.error("[v0] Erro ao processar reserva:", error, row)
            return null
          }
        })
        .filter((r: any) => r !== null)

      setReservas(transformedReservas)
      console.log("[v0] Reservas processadas:", transformedReservas.length)
    } catch (error) {
      console.error("[v0] Erro ao buscar reservas:", error)
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  const getReservasForDayAndTime = (day: Date, time: string) => {
    return reservas.filter((reserva) => {
      try {
        // Parse da data da reserva
        let reservaDate: Date
        if (reserva.data.includes("/")) {
          const [dayStr, month, year] = reserva.data.split("/")
          reservaDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(dayStr))
        } else {
          reservaDate = new Date(reserva.data)
        }

        // Comparar data e horário
        const reservaTime = reserva.horario.substring(0, 5) // Pegar apenas HH:mm
        return isSameDay(reservaDate, day) && reservaTime === time
      } catch (error) {
        console.error("[v0] Erro ao comparar reserva:", error, reserva)
        return false
      }
    })
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "confirmada":
      case "confirmado":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelada":
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      case "concluida":
      case "concluído":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const previousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendário de Reservas</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(weekStart, "dd/MM", { locale: ptBR })} - {format(weekEnd, "dd/MM/yyyy", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={onCreateReserva} className="bg-brand-primary hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2 text-sm font-medium text-gray-500">Horário</div>
                {weekDays.map((day) => (
                  <div key={day.toISOString()} className="p-2 text-center">
                    <div className="text-sm font-medium">{format(day, "EEE", { locale: ptBR })}</div>
                    <div className="text-lg font-bold">{format(day, "dd")}</div>
                  </div>
                ))}
              </div>

              {/* Time slots grid */}
              <div className="space-y-1">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-1">
                    <div className="p-2 text-sm text-gray-500 font-medium">{time}</div>
                    {weekDays.map((day) => {
                      const dayReservas = getReservasForDayAndTime(day, time)
                      return (
                        <div
                          key={`${day.toISOString()}-${time}`}
                          className="min-h-[60px] border border-gray-200 rounded p-1"
                        >
                          {dayReservas.map((reserva) => (
                            <div
                              key={reserva.id}
                              className={`text-xs p-1 rounded mb-1 border ${getStatusColor(reserva.status)}`}
                            >
                              <div className="font-medium truncate">{reserva.unidade}</div>
                              <div className="truncate">{reserva.nome}</div>
                              <div className="text-xs opacity-75">{reserva.modalidade}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

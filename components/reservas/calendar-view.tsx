"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { fetchReservasWithSchema } from "@/lib/supabase/schema-detector"

interface Reserva {
  id: string
  data_inicio: string
  data_fim: string
  tipo: string
  status: string
  valor: number
  profiles: {
    full_name: string
  }
  quadras: {
    nome: string
  }
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

      const query = await fetchReservasWithSchema(weekStart, weekEnd)
      const { data, error } = await query

      if (error) {
        setReservas([])
        return
      }

      const transformedReservas = (data || []).map((reserva: {
        id: string;
        duracao?: string;
        data_inicio?: string;
        data_fim?: string;
        tipo?: string;
        status?: string;
        valor_total?: number;
        valor?: number;
        profiles?: { full_name: string };
        quadras?: { nome: string };
      }) => {
        let dataInicio = new Date().toISOString()
        let dataFim = new Date().toISOString()

        try {
          if (reserva.duracao) {
            // TSTZRANGE format
            const duracaoStr = reserva.duracao.toString()
            const match =
              duracaoStr.match(/\["([^"]+)","([^"]+)"\)/) ||
              duracaoStr.match(/\[([^,]+),([^)]+)\)/) ||
              duracaoStr.match(/\(([^,]+),([^)]+)\]/)

            if (match) {
              dataInicio = new Date(match[1].replace(/"/g, "")).toISOString()
              dataFim = new Date(match[2].replace(/"/g, "")).toISOString()
            }
          } else if (reserva.data_inicio && reserva.data_fim) {
            // Separate columns format
            dataInicio = new Date(reserva.data_inicio).toISOString()
            dataFim = new Date(reserva.data_fim).toISOString()
          }
        } catch (error) {
          dataInicio = new Date().toISOString()
          dataFim = new Date(Date.now() + 60 * 60 * 1000).toISOString()
        }

        return {
          id: reserva.id,
          data_inicio: dataInicio,
          data_fim: dataFim,
          tipo: reserva.tipo || "Locação",
          status: reserva.status || "confirmada",
          valor: reserva.valor_total || reserva.valor || 0,
          profiles: {
            full_name: reserva.profiles?.full_name || "Cliente não informado",
          },
          quadras: {
            nome: reserva.quadras?.nome || "Quadra não informada",
          },
        }
      })

      setReservas(transformedReservas)
    } catch (error) {
      setReservas([])
    } finally {
      setLoading(false)
    }
  }

  const getReservasForDayAndTime = (day: Date, time: string) => {
    return reservas.filter((reserva) => {
      const reservaDate = new Date(reserva.data_inicio)
      const reservaTime = format(reservaDate, "HH:mm")
      return isSameDay(reservaDate, day) && reservaTime === time
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200"
      case "concluida":
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
                              <div className="font-medium truncate">{reserva.quadras?.nome}</div>
                              <div className="truncate">{reserva.profiles?.full_name}</div>
                              <div className="text-xs opacity-75">{reserva.tipo}</div>
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


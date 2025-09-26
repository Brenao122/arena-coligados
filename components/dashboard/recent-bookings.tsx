"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { detectReservasSchema } from "@/lib/supabase/schema-detector"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Booking {
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

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentBookings()
  }, [])

  const fetchRecentBookings = async () => {
    try {
      setLoading(true)
      const supabase = getBrowserClient()

      const schema = await detectReservasSchema()

      let selectFields = `
        id,
        status,
        tipo,
        profiles:cliente_id (full_name),
        quadras:quadra_id (nome),
        created_at
      `

      if (schema === "tstzrange") {
        selectFields += `, duracao, valor_total`
      } else {
        selectFields += `, data_inicio, data_fim, valor`
      }

      const { data, error } = await supabase
        .from("reservas")
        .select(selectFields)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error

      const formattedBookings =
        data?.map((booking) => {
          let dataInicio = new Date().toISOString()
          let dataFim = new Date().toISOString()
          let valor = 0

          try {
            if (schema === "tstzrange" && booking.duracao) {
              const duracaoStr = booking.duracao.toString()
              const match = duracaoStr.match(/\["([^"]+)","([^"]+)"\)/) || duracaoStr.match(/\[([^,]+),([^)]+)\)/)

              if (match) {
                dataInicio = match[1].replace(/"/g, "")
                dataFim = match[2].replace(/"/g, "")
              }
              valor = booking.valor_total || 0
            } else if (schema === "separate_columns") {
              dataInicio = booking.data_inicio || new Date().toISOString()
              dataFim = booking.data_fim || new Date().toISOString()
              valor = booking.valor || 0
            }
          } catch (error) {
            console.error("Erro ao parsear dados da reserva:", error)
          }

          return {
            id: booking.id,
            data_inicio: dataInicio,
            data_fim: dataFim,
            tipo: booking.tipo || "Reserva",
            status: booking.status,
            valor: valor,
            profiles: { full_name: booking.profiles?.full_name || "Cliente" },
            quadras: { nome: booking.quadras?.nome || "Quadra" },
          }
        }) || []

      setBookings(formattedBookings)
    } catch (error) {
      console.error("Erro ao buscar reservas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      case "concluida":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reservas Recentes</CardTitle>
          <CardDescription>Últimas 6 reservas realizadas</CardDescription>
        </div>
        <Link href="/dashboard/reservas">
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma reserva encontrada</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{booking.profiles?.full_name}</p>
                    <Badge variant="secondary" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.quadras?.nome} • {booking.tipo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.data_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">R$ {booking.valor.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

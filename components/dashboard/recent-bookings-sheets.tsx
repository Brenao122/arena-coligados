"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// Removido import direto do repo - será usado via API
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
      
      // Buscar dados reais das planilhas
      const [reservasRes, clientesRes, quadrasRes] = await Promise.all([
        fetch('/api/sheets/read?sheet=Página1'),
        fetch('/api/sheets/read?sheet=clientes'),
        fetch('/api/sheets/read?sheet=quadras')
      ])

      const [reservasData, clientesData, quadrasData] = await Promise.all([
        reservasRes.json(),
        clientesRes.json(),
        quadrasRes.json()
      ])

      if (!reservasData.ok) {
        console.error('Erro ao buscar reservas:', reservasData.error)
        setBookings([])
        return
      }

      // Criar mapas para lookup rápido
      const clientesMap = new Map((clientesData.rows || []).map((c: any) => [c.id, c]))
      const quadrasMap = new Map((quadrasData.rows || []).map((q: any) => [q.id, q]))

      // Enriquecer reservas e pegar as 6 mais recentes
      const reservasCompletas = (reservasData.rows || [])
        .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 6)
        .map((reserva: any) => ({
          id: reserva.id,
          data_inicio: reserva.data_inicio,
          data_fim: reserva.data_fim,
          tipo: reserva.tipo,
          status: reserva.status,
          valor: reserva.valor_total || 0,
          profiles: { 
            full_name: (clientesMap.get(reserva.cliente_id) as any)?.nome || `Cliente ${reserva.cliente_id}` 
          },
          quadras: { 
            nome: (quadrasMap.get(reserva.quadra_id) as any)?.nome || `Quadra ${reserva.quadra_id}` 
          },
        }))

      setBookings(reservasCompletas)
    } catch (error) {
      console.error("Erro ao buscar reservas recentes:", error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-500 text-white"
      case "confirmada":
        return "bg-green-500 text-white"
      case "cancelada":
        return "bg-red-500 text-white"
      case "concluida":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "locacao":
        return "bg-blue-500 text-white"
      case "aula":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Reservas Recentes</CardTitle>
          <CardDescription className="text-gray-400">
            Últimas reservas cadastradas no sistema
          </CardDescription>
        </div>
        <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Link href="/dashboard/reservas">Ver Todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma reserva encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-white">{booking.profiles.full_name}</h4>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <Badge className={getTipoColor(booking.tipo)}>
                      {booking.tipo}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 {format(new Date(booking.data_inicio), "dd/MM/yyyy", { locale: ptBR })}</span>
                    <span>🕐 {format(new Date(booking.data_inicio), "HH:mm", { locale: ptBR })} - {format(new Date(booking.data_fim), "HH:mm", { locale: ptBR })}</span>
                    <span>🏟️ {booking.quadras.nome}</span>
                    <span className="text-green-400 font-medium">R$ {booking.valor.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

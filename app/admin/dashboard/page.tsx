"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, Phone, Mail, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, X, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Reserva {
  timestamp: string
  data: string
  unidade: string
  quadra: string
  horarios: string
  modalidade: string
  nome: string
  telefone: string
  email: string
  cpf: string
  status: string
  payment_id: string
  valor_total: string
  valor_reserva: string
}

const DashboardPage = () => {
  const router = useRouter()
  const [filtroStatus, setFiltroStatus] = useState<"TODAS" | "CONFIRMADA" | "PENDENTE">("TODAS")
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState<string | null>(null)

  useEffect(() => {
    fetchReservas()
    const interval = setInterval(fetchReservas, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchReservas = async () => {
    try {
      const response = await fetch("/api/sheets/reservas/list-all")
      if (response.ok) {
        const data = await response.json()
        setReservas(data.reservas || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar reservas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarReserva = async (paymentId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return

    try {
      setCancelando(paymentId)
      const response = await fetch("/api/sheets/reservas/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          status: "CANCELADA",
        }),
      })

      if (response.ok) {
        alert("Reserva cancelada com sucesso!")
        fetchReservas()
      } else {
        throw new Error("Erro ao cancelar reserva")
      }
    } catch (error) {
      console.error("[v0] Erro:", error)
      alert("Erro ao cancelar reserva")
    } finally {
      setCancelando(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtroStatus === "TODAS") return reserva.status !== "CANCELADA"
    return reserva.status === filtroStatus
  })

  const reservasPendentes = reservas.filter((r) => r.status === "PENDENTE")
  const reservasConfirmadas = reservas.filter((r) => r.status === "CONFIRMADA")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-white">Carregando reservas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p className="text-gray-400">Gerencie todas as reservas do Arena Coligados</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {reservasPendentes.length > 0 && (
          <div className="mb-6 p-6 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-bold text-lg">
                  {reservasPendentes.length} reserva(s) pendente(s) de pagamento
                </p>
                <p className="text-yellow-200 text-sm mt-1">
                  Entre em contato com os clientes para verificar o status do pagamento
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {reservas.filter((r) => r.status !== "CANCELADA").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Confirmadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{reservasConfirmadas.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{reservasPendentes.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex gap-3">
          <Button
            variant={filtroStatus === "TODAS" ? "default" : "outline"}
            onClick={() => setFiltroStatus("TODAS")}
            className={
              filtroStatus === "TODAS"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-white/10 hover:bg-white/20 text-white border-white/30"
            }
          >
            Todas ({reservas.filter((r) => r.status !== "CANCELADA").length})
          </Button>
          <Button
            variant={filtroStatus === "CONFIRMADA" ? "default" : "outline"}
            onClick={() => setFiltroStatus("CONFIRMADA")}
            className={
              filtroStatus === "CONFIRMADA"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-white/10 hover:bg-white/20 text-white border-white/30"
            }
          >
            Confirmadas ({reservasConfirmadas.length})
          </Button>
          <Button
            variant={filtroStatus === "PENDENTE" ? "default" : "outline"}
            onClick={() => setFiltroStatus("PENDENTE")}
            className={
              filtroStatus === "PENDENTE"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-white/10 hover:bg-white/20 text-white border-white/30"
            }
          >
            Pendentes ({reservasPendentes.length})
          </Button>
        </div>

        <div className="space-y-4">
          {reservasFiltradas.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="py-12">
                <p className="text-center text-gray-400">Nenhuma reserva encontrada</p>
              </CardContent>
            </Card>
          ) : (
            reservasFiltradas.map((reserva, index) => (
              <Card
                key={index}
                className={`bg-white/10 backdrop-blur-xl border-2 ${
                  reserva.status === "PENDENTE" ? "border-yellow-500/50" : "border-white/20"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{reserva.nome}</h3>
                        <Badge
                          className={
                            reserva.status === "CONFIRMADA"
                              ? "bg-green-500/20 text-green-300 border-green-500/50"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                          }
                        >
                          {reserva.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{reserva.modalidade}</p>
                    </div>
                    {reserva.status !== "CANCELADA" && reserva.payment_id && (
                      <Button
                        onClick={() => handleCancelarReserva(reserva.payment_id)}
                        disabled={cancelando === reserva.payment_id}
                        variant="outline"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
                      >
                        {cancelando === reserva.payment_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span className="text-sm">
                        {reserva.unidade} - {reserva.quadra}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{new Date(reserva.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{reserva.horarios}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-orange-400" />
                      <a
                        href={`https://wa.me/55${reserva.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-green-400"
                      >
                        {reserva.telefone}
                      </a>
                    </div>
                    {reserva.email && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="h-4 w-4 text-pink-400" />
                        <span className="text-sm">{reserva.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-green-400">R$ {reserva.valor_reserva}</span>
                      <span className="text-xs text-gray-400">/ R$ {reserva.valor_total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

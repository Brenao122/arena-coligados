"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const DashboardPage = () => {
  const [filtroStatus, setFiltroStatus] = useState<"TODAS" | "CONFIRMADA" | "PENDENTE">("TODAS")
  const reservas = [
    // Simulated data for demonstration purposes
    { id: 1, status: "PENDENTE" },
    { id: 2, status: "CONFIRMADA" },
    { id: 3, status: "TODAS" },
  ]

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtroStatus === "TODAS") return true
    return reserva.status === filtroStatus
  })

  const reservasPendentes = reservas.filter((r) => r.status === "PENDENTE")

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>

      {reservasPendentes.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-300 font-semibold">
            ⚠️ Você tem {reservasPendentes.length} reserva(s) pendente(s) de pagamento
          </p>
          <p className="text-yellow-200 text-sm mt-1">
            Entre em contato com os clientes para verificar o status do pagamento
          </p>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <Button variant={filtroStatus === "TODAS" ? "default" : "outline"} onClick={() => setFiltroStatus("TODAS")}>
          Todas ({reservas.length})
        </Button>
        <Button
          variant={filtroStatus === "CONFIRMADA" ? "default" : "outline"}
          onClick={() => setFiltroStatus("CONFIRMADA")}
        >
          Confirmadas ({reservas.filter((r) => r.status === "CONFIRMADA").length})
        </Button>
        <Button
          variant={filtroStatus === "PENDENTE" ? "default" : "outline"}
          onClick={() => setFiltroStatus("PENDENTE")}
        >
          Pendentes ({reservasPendentes.length})
        </Button>
      </div>

      {/* Lista de reservas filtradas */}
      <div className="space-y-4">
        {reservasFiltradas.map((reserva, index) => (
          <Card key={index} className={reserva.status === "PENDENTE" ? "border-yellow-500" : ""}>
            {/* ... existing card content ... */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  reserva.status === "CONFIRMADA"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {reserva.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage

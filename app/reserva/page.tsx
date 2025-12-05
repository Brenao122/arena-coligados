"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { UnitSelector } from "@/components/reserva/unit-selector"
import { ModalidadeSelector } from "@/components/reserva/modalidade-selector"
import { HorarioSelector } from "@/components/reserva/horario-selector"
import { ProgressSteps } from "@/components/reserva/progress-steps"

type Step = "unit" | "modalidade" | "data" | "horario" | "cliente" | "pagamento" | "sucesso"

interface ReservationData {
  unidade: string
  modalidade: string
  data: Date
  horario: string
  nome: string
  telefone: string
  email: string
}

export default function ReservaPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("unit")
  const [reservationData, setReservationData] = useState<Partial<ReservationData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = ["Unidade", "Modalidade", "Data", "Horário", "Dados", "Pagamento"]

  const handleUnitSelect = (unidade: string) => {
    setReservationData((prev) => ({ ...prev, unidade }))
    setCurrentStep("modalidade")
  }

  const handleModalidadeSelect = (modalidade: string) => {
    setReservationData((prev) => ({ ...prev, modalidade }))
    setCurrentStep("data")
  }

  const handleDataSelect = (data: Date) => {
    setReservationData((prev) => ({ ...prev, data }))
    setCurrentStep("horario")
  }

  const handleHorarioSelect = (horario: string) => {
    setReservationData((prev) => ({ ...prev, horario }))
    setCurrentStep("cliente")
  }

  const handleClienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar dados
      if (!reservationData.nome || !reservationData.telefone) {
        setError("Nome e telefone são obrigatórios")
        setLoading(false)
        return
      }

      // Aqui você conectaria com o ASAAS para criar o pagamento
      // Por enquanto, vamos simular o fluxo

      setCurrentStep("pagamento")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar dados")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReservation = async () => {
    setLoading(true)
    try {
      // Aqui você salvaria a reserva no banco de dados
      // e enviaria para o Google Sheets

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads - quadra",
          data: {
            nome: reservationData.nome,
            whatsapp_number: reservationData.telefone,
            email: reservationData.email,
            Unidade: reservationData.unidade,
            esporte: reservationData.modalidade,
            data: reservationData.data?.toISOString().split("T")[0],
            horarios: reservationData.horario,
            status: "Confirmado",
          },
        }),
      })

      if (!response.ok) throw new Error("Erro ao confirmar reserva")

      setCurrentStep("sucesso")
      setTimeout(() => router.push("/"), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao confirmar reserva")
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    const stepOrder: Step[] = ["unit", "modalidade", "data", "horario", "cliente", "pagamento"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <ProgressSteps
            steps={steps}
            currentStep={
              currentStep === "unit"
                ? 0
                : currentStep === "modalidade"
                  ? 1
                  : currentStep === "data"
                    ? 2
                    : currentStep === "horario"
                      ? 3
                      : currentStep === "cliente"
                        ? 4
                        : 5
            }
          />
        </div>

        {error && (
          <Card className="mb-6 bg-red-900/20 border-red-700">
            <div className="p-4 text-red-400">{error}</div>
          </Card>
        )}

        {currentStep === "unit" && <UnitSelector onSelect={handleUnitSelect} selected={reservationData.unidade} />}

        {currentStep === "modalidade" && (
          <>
            <Button onClick={goBack} variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <ModalidadeSelector onSelect={handleModalidadeSelect} selected={reservationData.modalidade} />
          </>
        )}

        {currentStep === "data" && (
          <>
            <Button onClick={goBack} variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Selecione a Data</h2>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const data = new Date()
                  data.setDate(data.getDate() + i)
                  const isSelected = reservationData.data?.toDateString() === data.toDateString()

                  return (
                    <Button
                      key={i}
                      onClick={() => handleDataSelect(data)}
                      className={`${
                        isSelected ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {data.getDate()}
                    </Button>
                  )
                })}
              </div>
              {reservationData.data && (
                <Button
                  onClick={() => setCurrentStep("horario")}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                >
                  Continuar
                </Button>
              )}
            </Card>
          </>
        )}

        {currentStep === "horario" && (
          <>
            <Button onClick={goBack} variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <HorarioSelector
              unidade={reservationData.unidade || ""}
              quadra="Quadra 01"
              data={reservationData.data || new Date()}
              onSelect={handleHorarioSelect}
              selected={reservationData.horario}
            />
            {reservationData.horario && (
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">Continuar</Button>
            )}
          </>
        )}

        {currentStep === "cliente" && (
          <>
            <Button onClick={goBack} variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Seus Dados</h2>
              <form onSubmit={handleClienteSubmit} className="space-y-4">
                <div>
                  <Label className="text-gray-300">Nome Completo</Label>
                  <Input
                    required
                    type="text"
                    value={reservationData.nome || ""}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, nome: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Telefone / WhatsApp</Label>
                  <Input
                    required
                    type="tel"
                    value={reservationData.telefone || ""}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, telefone: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="(62) 99999-9999"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">E-mail (opcional)</Label>
                  <Input
                    type="email"
                    value={reservationData.email || ""}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="seu@email.com"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Ir para Pagamento"
                  )}
                </Button>
              </form>
            </Card>
          </>
        )}

        {currentStep === "pagamento" && (
          <>
            <Button onClick={goBack} variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Confirmação de Pagamento</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 mb-2">Unidade: {reservationData.unidade}</p>
                  <p className="text-gray-300 mb-2">Modalidade: {reservationData.modalidade}</p>
                  <p className="text-gray-300 mb-2">Data: {reservationData.data?.toLocaleDateString("pt-BR")}</p>
                  <p className="text-gray-300 mb-2">Horário: {reservationData.horario}</p>
                  <p className="text-orange-400 font-bold mt-4">Valor: R$ 80,00</p>
                </div>
              </div>
              <Button
                onClick={handleConfirmReservation}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  "Confirmar Reserva"
                )}
              </Button>
            </Card>
          </>
        )}

        {currentStep === "sucesso" && (
          <Card className="bg-green-900/20 border-green-700 p-8 text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Reserva Confirmada!</h2>
            <p className="text-gray-300 mb-4">
              Sua reserva foi confirmada com sucesso. Você será redirecionado em breve.
            </p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-400" />
          </Card>
        )}

        {currentStep === "unit" && (
          <Link href="/">
            <Button variant="outline" className="mt-8 border-gray-600 text-gray-300 bg-transparent w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

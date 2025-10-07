"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { normalizePhone } from "@/lib/normalize-phone"
import { Loader2, Calendar, Clock, MapPin, DollarSign } from "lucide-react"

interface QuadraAgendamentoFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function QuadraAgendamentoForm({ onSuccess, onClose }: QuadraAgendamentoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_telefone: "",
    cliente_email: "",
    modalidade: "",
    quadra_numero: 1,
    data_agendamento: "",
    hora_inicio: "",
    hora_fim: "",
    preco_total: 0,
    sinal_pix: 0,
    observacoes: "",
  })

  const modalidades = [
    { value: "futsal", label: "Futsal", preco: 80 },
    { value: "volei", label: "Vôlei", preco: 65 },
    { value: "beach_tennis", label: "Beach Tennis", preco: 70 },
    { value: "basquete", label: "Basquete", preco: 75 },
  ]

  const calcularPreco = () => {
    if (!formData.hora_inicio || !formData.hora_fim || !formData.modalidade) return 0

    const modalidade = modalidades.find((m) => m.value === formData.modalidade)
    if (!modalidade) return 0

    const inicio = new Date(`2000-01-01T${formData.hora_inicio}`)
    const fim = new Date(`2000-01-01T${formData.hora_fim}`)
    const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)

    return modalidade.preco * horas
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const precoTotal = calcularPreco()
      const sinalPix = precoTotal * 0.5

      const agendamentoData = {
        cliente_nome: formData.cliente_nome,
        cliente_telefone: normalizePhone(formData.cliente_telefone),
        cliente_email: formData.cliente_email || "",
        modalidade: formData.modalidade,
        quadra_numero: formData.quadra_numero,
        data_agendamento: formData.data_agendamento,
        hora_inicio: formData.hora_inicio,
        hora_fim: formData.hora_fim,
        preco_total: precoTotal,
        sinal_pix: sinalPix,
        valor_restante: precoTotal - sinalPix,
        status: "pendente",
        observacoes: formData.observacoes,
      }

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "Página1",
          data: agendamentoData,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar dados")

      setSuccess("Agendamento criado com sucesso!")

      setFormData({
        cliente_nome: "",
        cliente_telefone: "",
        cliente_email: "",
        modalidade: "",
        quadra_numero: 1,
        data_agendamento: "",
        hora_inicio: "",
        hora_fim: "",
        preco_total: 0,
        sinal_pix: 0,
        observacoes: "",
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error)
      setError("Erro ao criar agendamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          Agendamento de Quadra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dados do Cliente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente_nome">Nome Completo *</Label>
                <Input
                  id="cliente_nome"
                  value={formData.cliente_nome}
                  onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente_telefone">Telefone *</Label>
                <Input
                  id="cliente_telefone"
                  value={formData.cliente_telefone}
                  onChange={(e) => setFormData({ ...formData, cliente_telefone: e.target.value })}
                  placeholder="(62) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente_email">E-mail</Label>
              <Input
                id="cliente_email"
                type="email"
                value={formData.cliente_email}
                onChange={(e) => setFormData({ ...formData, cliente_email: e.target.value })}
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          {/* Dados da Reserva */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Dados da Reserva
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade *</Label>
                <Select
                  value={formData.modalidade}
                  onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalidades.map((modalidade) => (
                      <SelectItem key={modalidade.value} value={modalidade.value}>
                        {modalidade.label} - R$ {modalidade.preco}/h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quadra_numero">Número da Quadra</Label>
                <Select
                  value={formData.quadra_numero.toString()}
                  onValueChange={(value) => setFormData({ ...formData, quadra_numero: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Quadra 1</SelectItem>
                    <SelectItem value="2">Quadra 2</SelectItem>
                    <SelectItem value="3">Quadra 3</SelectItem>
                    <SelectItem value="4">Quadra 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_agendamento">Data *</Label>
                <Input
                  id="data_agendamento"
                  type="date"
                  value={formData.data_agendamento}
                  onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Início *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fim">Hora Fim *</Label>
                <Input
                  id="hora_fim"
                  type="time"
                  value={formData.hora_fim}
                  onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          {formData.modalidade && formData.hora_inicio && formData.hora_fim && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-orange-600" />
                Resumo Financeiro
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Valor Total:</p>
                  <p className="text-xl font-bold text-orange-600">R$ {calcularPreco().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sinal PIX (50%):</p>
                  <p className="text-lg font-semibold text-green-600">R$ {(calcularPreco() * 0.5).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais sobre o agendamento..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Criar Agendamento"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

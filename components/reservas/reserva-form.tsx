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
import { Loader2, X } from "lucide-react"

interface ReservaFormProps {
  onClose: () => void
  onSuccess: () => void
  reservaId?: string
}

export function ReservaForm({ onClose, onSuccess, reservaId }: ReservaFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    cliente_nome: "",
    cliente_telefone: "",
    quadra: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    tipo: "locacao" as "locacao" | "aula",
    observacoes: "",
  })

  const quadras = [
    { id: "1", nome: "Quadra 1 - Futsal", preco: 150 },
    { id: "2", nome: "Quadra 2 - Beach Tennis", preco: 120 },
  ]

  const calculateValue = () => {
    const quadra = quadras.find((q) => q.id === formData.quadra)
    if (!quadra || !formData.hora_inicio || !formData.hora_fim) return 0

    const inicio = new Date(`2000-01-01T${formData.hora_inicio}`)
    const fim = new Date(`2000-01-01T${formData.hora_fim}`)
    const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)

    return quadra.preco * horas
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "Página1",
          data: {
            cliente_nome: formData.cliente_nome,
            cliente_telefone: formData.cliente_telefone,
            quadra: formData.quadra,
            data: formData.data,
            hora_inicio: formData.hora_inicio,
            hora_fim: formData.hora_fim,
            tipo: formData.tipo,
            valor: calculateValue(),
            status: "Pendente",
            observacoes: formData.observacoes,
            data_cadastro: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar reserva")
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Erro ao salvar reserva:", error)
      setError("Erro ao salvar reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{reservaId ? "Editar Reserva" : "Nova Reserva"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente_nome" className="text-gray-200">
                Nome do Cliente
              </Label>
              <Input
                id="cliente_nome"
                value={formData.cliente_nome}
                onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                placeholder="Nome completo"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente_telefone" className="text-gray-200">
                Telefone
              </Label>
              <Input
                id="cliente_telefone"
                value={formData.cliente_telefone}
                onChange={(e) => setFormData({ ...formData, cliente_telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quadra" className="text-gray-200">
                Quadra
              </Label>
              <Select value={formData.quadra} onValueChange={(value) => setFormData({ ...formData, quadra: value })}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a quadra" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {quadras.map((quadra) => (
                    <SelectItem key={quadra.id} value={quadra.id} className="text-white hover:bg-gray-600">
                      {quadra.nome} - R$ {quadra.preco}/h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-200">
                Tipo
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "locacao" | "aula") => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="locacao" className="text-white hover:bg-gray-600">
                    Locação
                  </SelectItem>
                  <SelectItem value="aula" className="text-white hover:bg-gray-600">
                    Aula
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-gray-200">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio" className="text-gray-200">
                Hora Início
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fim" className="text-gray-200">
                Hora Fim
              </Label>
              <Input
                id="hora_fim"
                type="time"
                value={formData.hora_fim}
                onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-gray-200">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {formData.quadra && formData.hora_inicio && formData.hora_fim && (
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300">Valor estimado:</p>
              <p className="text-2xl font-bold text-orange-500">R$ {calculateValue().toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Reserva"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

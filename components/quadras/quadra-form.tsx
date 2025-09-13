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

interface QuadraFormProps {
  onClose: () => void
  onSuccess: () => void
  quadraId?: string
}

export function QuadraForm({ onClose, onSuccess, quadraId }: QuadraFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    preco_hora: "",
    descricao: "",
    ativa: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.nome || !formData.tipo || !formData.preco_hora) {
        throw new Error("Nome, tipo e preço são obrigatórios")
      }

      // Criar dados da quadra para Google Sheets
      const quadraData = {
        Nome: formData.nome,
        Email: "quadra@arena.com",
        Telefone: "(11) 00000-0000",
        Data: new Date().toISOString().split('T')[0],
        Hora: new Date().toTimeString().split(' ')[0],
        Serviço: formData.tipo,
        Status: formData.ativa ? "Ativa" : "Inativa",
        Observações: formData.descricao,
        Tipo: "Quadra",
        Preço: formData.preco_hora
      }

      // Enviar para Google Sheets via API
      const response = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'Página1',
          rows: [quadraData]
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || 'Erro ao salvar quadra')
      }

      onSuccess()
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar quadra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{quadraId ? "Editar Quadra" : "Nova Quadra"}</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="nome" className="text-gray-200">
              Nome da Quadra *
            </Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-gray-200">
              Tipo *
            </Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Tênis" className="text-white hover:bg-gray-600">Tênis</SelectItem>
                <SelectItem value="Beach Tennis" className="text-white hover:bg-gray-600">Beach Tennis</SelectItem>
                <SelectItem value="Futsal" className="text-white hover:bg-gray-600">Futsal</SelectItem>
                <SelectItem value="Futebol Society" className="text-white hover:bg-gray-600">Futebol Society</SelectItem>
                <SelectItem value="Vôlei" className="text-white hover:bg-gray-600">Vôlei</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco_hora" className="text-gray-200">
              Preço por Hora (R$) *
            </Label>
            <Input
              id="preco_hora"
              type="number"
              value={formData.preco_hora}
              onChange={(e) => setFormData({ ...formData, preco_hora: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-gray-200">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Descrição da quadra..."
            />
          </div>

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
                quadraId ? "Atualizar Quadra" : "Criar Quadra"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

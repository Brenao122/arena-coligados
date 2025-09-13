"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X } from "lucide-react"

interface ClienteFormProps {
  onClose: () => void
  onSuccess: () => void
  clienteId?: string
}

export function ClienteForm({ onClose, onSuccess, clienteId }: ClienteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.full_name || !formData.email) {
        throw new Error("Nome e email são obrigatórios")
      }

      if (!clienteId && formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      // Criar dados do cliente para Google Sheets
      const clienteData = {
        Nome: formData.full_name,
        Email: formData.email,
        Telefone: formData.phone,
        Data: new Date().toISOString().split('T')[0],
        Hora: new Date().toTimeString().split(' ')[0],
        Serviço: "Cadastro",
        Status: "Ativo",
        Observações: "Cliente cadastrado via formulário",
        Tipo: "Cliente"
      }

      // Enviar para Google Sheets via API
      const response = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'Página1',
          rows: [clienteData]
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || 'Erro ao salvar cliente')
      }

      onSuccess()
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{clienteId ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
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
            <Label htmlFor="full_name" className="text-gray-200">
              Nome Completo *
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-200">
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="(11) 99999-9999"
            />
          </div>

          {!clienteId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Senha *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirmar Senha *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </>
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
                clienteId ? "Atualizar Cliente" : "Criar Cliente"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

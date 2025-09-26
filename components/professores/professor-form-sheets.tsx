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

interface ProfessorFormProps {
  onClose: () => void
  onSuccess: () => void
  professorId?: string
}

export function ProfessorForm({ onClose, onSuccess, professorId }: ProfessorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    hourly_rate: "",
    specialties: "",
    bio: "",
    experience_years: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.full_name || !formData.email || !formData.hourly_rate) {
        throw new Error("Nome, email e valor por hora são obrigatórios")
      }

      // Criar dados do professor para Google Sheets
      const professorData = {
        Nome: formData.full_name,
        Email: formData.email,
        Telefone: formData.phone,
        Data: new Date().toISOString().split('T')[0],
        Hora: new Date().toTimeString().split(' ')[0],
        Serviço: formData.specialties,
        Status: "Ativo",
        Observações: formData.bio,
        Tipo: "Professor",
        Valor: formData.hourly_rate,
        Experiência: formData.experience_years
      }

      // Enviar para Google Sheets via API
      const response = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'Página1',
          rows: [professorData]
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || 'Erro ao salvar professor')
      }

      onSuccess()
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar professor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{professorId ? "Editar Professor" : "Novo Professor"}</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="hourly_rate" className="text-gray-200">
              Valor por Hora (R$) *
            </Label>
            <Input
              id="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties" className="text-gray-200">
              Especialidades
            </Label>
            <Input
              id="specialties"
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ex: Tênis, Beach Tennis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_years" className="text-gray-200">
              Anos de Experiência
            </Label>
            <Input
              id="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-200">
              Biografia
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Conte um pouco sobre o professor..."
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
                professorId ? "Atualizar Professor" : "Criar Professor"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

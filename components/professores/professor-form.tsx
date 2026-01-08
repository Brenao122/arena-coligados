"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus } from "lucide-react"

interface ProfessorFormProps {
  onClose: () => void
  onSuccess: () => void
  professorId?: string
}

export function ProfessorForm({ onClose, onSuccess, professorId }: ProfessorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newEspecialidade, setNewEspecialidade] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    especialidades: [] as string[],
    preco_aula: "",
    ativo: true,
    disponibilidade: {
      segunda: { inicio: "08:00", fim: "18:00", ativo: true },
      terca: { inicio: "08:00", fim: "18:00", ativo: true },
      quarta: { inicio: "08:00", fim: "18:00", ativo: true },
      quinta: { inicio: "08:00", fim: "18:00", ativo: true },
      sexta: { inicio: "08:00", fim: "18:00", ativo: true },
      sabado: { inicio: "08:00", fim: "12:00", ativo: false },
      domingo: { inicio: "08:00", fim: "12:00", ativo: false },
    },
  })

  const especialidadesDisponiveis = [
    "Futevôlei",
    "Vôlei",
    "Beach Tennis",
    "Tênis",
    "Preparação Física",
    "Treinamento Funcional",
  ]

  const diasSemana = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ]

  const addEspecialidade = () => {
    if (newEspecialidade && !formData.especialidades.includes(newEspecialidade)) {
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, newEspecialidade],
      })
      setNewEspecialidade("")
    }
  }

  const removeEspecialidade = (especialidade: string) => {
    setFormData({
      ...formData,
      especialidades: formData.especialidades.filter((e) => e !== especialidade),
    })
  }

  const updateDisponibilidade = (dia: string, field: string, value: any) => {
    setFormData({
      ...formData,
      disponibilidade: {
        ...formData.disponibilidade,
        [dia]: {
          ...formData.disponibilidade[dia as keyof typeof formData.disponibilidade],
          [field]: value,
        },
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.nome || !formData.preco_aula || formData.especialidades.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "professores",
          data: {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            especialidades: formData.especialidades.join(", "),
            preco_aula: formData.preco_aula,
            ativo: formData.ativo ? "Sim" : "Não",
            disponibilidade: JSON.stringify(formData.disponibilidade),
            data_cadastro: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar professor")
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error saving professor:", error)
      setError(error.message || "Erro ao salvar professor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{professorId ? "Editar Professor" : "Novo Professor"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-200">
                Nome Completo
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome do professor"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-gray-200">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_aula" className="text-gray-200">
                Preço por Aula (R$)
              </Label>
              <Input
                id="preco_aula"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_aula}
                onChange={(e) => setFormData({ ...formData, preco_aula: e.target.value })}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Especialidades</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newEspecialidade} onValueChange={setNewEspecialidade}>
                <SelectTrigger className="flex-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {especialidadesDisponiveis
                    .filter((esp) => !formData.especialidades.includes(esp))
                    .map((especialidade) => (
                      <SelectItem key={especialidade} value={especialidade} className="text-white hover:bg-gray-600">
                        {especialidade}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addEspecialidade}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.especialidades.map((especialidade) => (
                <Badge key={especialidade} variant="secondary" className="cursor-pointer bg-gray-600 text-white">
                  {especialidade}
                  <button
                    type="button"
                    onClick={() => removeEspecialidade(especialidade)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-gray-200">Disponibilidade</Label>
            <div className="grid gap-4">
              {diasSemana.map((dia) => (
                <div
                  key={dia.key}
                  className="flex items-center gap-4 p-4 border border-gray-600 rounded-lg bg-gray-700"
                >
                  <div className="w-32">
                    <Switch
                      checked={formData.disponibilidade[dia.key as keyof typeof formData.disponibilidade].ativo}
                      onCheckedChange={(checked) => updateDisponibilidade(dia.key, "ativo", checked)}
                    />
                    <Label className="ml-2 text-gray-200">{dia.label}</Label>
                  </div>
                  {formData.disponibilidade[dia.key as keyof typeof formData.disponibilidade].ativo && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-gray-200">De:</Label>
                        <Input
                          type="time"
                          value={formData.disponibilidade[dia.key as keyof typeof formData.disponibilidade].inicio}
                          onChange={(e) => updateDisponibilidade(dia.key, "inicio", e.target.value)}
                          className="w-32 bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-gray-200">Até:</Label>
                        <Input
                          type="time"
                          value={formData.disponibilidade[dia.key as keyof typeof formData.disponibilidade].fim}
                          onChange={(e) => updateDisponibilidade(dia.key, "fim", e.target.value)}
                          className="w-32 bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo" className="text-gray-200">
              Professor ativo
            </Label>
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
                "Salvar Professor"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

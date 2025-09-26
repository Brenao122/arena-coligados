"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase/browser-client"

interface ProfessorFormProps {
  onClose: () => void
  onSuccess: () => void
  professorId?: string
}

interface Profile {
  id: string
  full_name: string
  email: string
}

export function ProfessorForm({ onClose, onSuccess, professorId }: ProfessorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newEspecialidade, setNewEspecialidade] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)

  const [formData, setFormData] = useState({
    profile_id: "",
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
    "Futsal",
    "Futebol",
    "Vôlei",
    "Basquete",
    "Tênis",
    "Beach Tennis",
    "Padel",
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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const supabase = getBrowserClient()
        const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name")

        if (error) throw error
        setProfiles(data || [])
      } catch (error) {
        console.error("Erro ao buscar profiles:", error)
        setError("Erro ao carregar usuários")
      } finally {
        setLoadingProfiles(false)
      }
    }

    fetchProfiles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.profile_id || !formData.preco_aula || formData.especialidades.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const supabase = getBrowserClient()
      const selectedProfile = profiles.find((p) => p.id === formData.profile_id)

      if (!selectedProfile) {
        throw new Error("Usuário selecionado não encontrado")
      }

      const professorData = {
        profile_id: formData.profile_id,
        especialidades: formData.especialidades,
        preco_aula: Number.parseFloat(formData.preco_aula),
        ativo: formData.ativo,
        disponibilidade: formData.disponibilidade,
      }

      if (professorId) {
        const { error } = await supabase.from("professores").update(professorData).eq("id", professorId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("professores").insert([professorData])

        if (error) throw error

        const { error: roleError } = await supabase.from("user_roles").insert([
          {
            user_id: formData.profile_id,
            role: "professor",
          },
        ])

        if (roleError) {
          console.warn("Aviso: Erro ao adicionar role de professor:", roleError)
        }
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
              <Label htmlFor="profile" className="text-gray-200">
                Usuário
              </Label>
              <Select
                value={formData.profile_id}
                onValueChange={(value) => setFormData({ ...formData, profile_id: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {loadingProfiles ? (
                    <SelectItem value="loading-state" disabled className="text-gray-400">
                      Carregando usuários...
                    </SelectItem>
                  ) : profiles.length === 0 ? (
                    <SelectItem value="no-users-found" disabled className="text-gray-400">
                      Nenhum usuário encontrado
                    </SelectItem>
                  ) : (
                    profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id} className="text-white hover:bg-gray-600">
                        {profile.full_name} ({profile.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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

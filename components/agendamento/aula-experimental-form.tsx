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
import { supabase } from "@/lib/supabase"
import { normalizePhone } from "@/lib/normalize-phone"
import { Loader2, GraduationCap, Users, Clock } from "lucide-react"

interface AulaExperimentalFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function AulaExperimentalForm({ onSuccess, onClose }: AulaExperimentalFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    aluno_nome: "",
    aluno_telefone: "",
    aluno_email: "",
    aluno_idade: "",
    modalidade: "",
    nivel: "iniciante",
    melhor_dia: "",
    melhor_horario: "",
    data_aula: "",
    hora_inicio: "",
    hora_fim: "",
    professor_nome: "",
    observacoes: "",
  })

  const modalidades = [
    { value: "beach_tennis", label: "Beach Tennis" },
    { value: "futevolei", label: "Futevôlei" },
    { value: "volei", label: "Vôlei" },
    { value: "futsal", label: "Futsal" },
    { value: "basquete", label: "Basquete" },
  ]

  const niveis = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
  ]

  const diasSemana = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ]

  const horarios = [
    { value: "manha", label: "Manhã (6h às 12h)" },
    { value: "tarde", label: "Tarde (12h às 18h)" },
    { value: "noite", label: "Noite (18h às 22h)" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Gerar ID da turma se for uma aula agendada
      const turmaId = formData.data_aula ? crypto.randomUUID() : null

      const aulaData = {
        aluno_nome: formData.aluno_nome,
        aluno_telefone: normalizePhone(formData.aluno_telefone),
        aluno_email: formData.aluno_email || null,
        aluno_idade: formData.aluno_idade ? Number.parseInt(formData.aluno_idade) : null,
        modalidade: formData.modalidade,
        nivel: formData.nivel,
        melhor_dia: formData.melhor_dia || null,
        melhor_horario: formData.melhor_horario || null,
        data_aula: formData.data_aula || null,
        hora_inicio: formData.hora_inicio || null,
        hora_fim: formData.hora_fim || null,
        professor_nome: formData.professor_nome || null,
        turma_id: turmaId,
        vagas_ocupadas: 1,
        max_vagas: 4,
        status: formData.data_aula ? "agendado" : "pendente",
        origem: "plataforma",
        observacoes: formData.observacoes,
        needs_sync: true, // Marca para sincronização com Google Sheets
      }

      const { error: supabaseError } = await supabase.from("aulas_experimentais_sheets").insert([aulaData])

      if (supabaseError) throw supabaseError

      setSuccess("Aula experimental registrada com sucesso! Será sincronizada com a planilha automaticamente.")

      // Reset form
      setFormData({
        aluno_nome: "",
        aluno_telefone: "",
        aluno_email: "",
        aluno_idade: "",
        modalidade: "",
        nivel: "iniciante",
        melhor_dia: "",
        melhor_horario: "",
        data_aula: "",
        hora_inicio: "",
        hora_fim: "",
        professor_nome: "",
        observacoes: "",
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Erro ao registrar aula experimental:", error)
      setError("Erro ao registrar aula experimental. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-500" />
          Aula Experimental
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

          {/* Dados do Aluno */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Dados do Aluno
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aluno_nome">Nome Completo *</Label>
                <Input
                  id="aluno_nome"
                  value={formData.aluno_nome}
                  onChange={(e) => setFormData({ ...formData, aluno_nome: e.target.value })}
                  placeholder="Nome do aluno"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aluno_telefone">Telefone *</Label>
                <Input
                  id="aluno_telefone"
                  value={formData.aluno_telefone}
                  onChange={(e) => setFormData({ ...formData, aluno_telefone: e.target.value })}
                  placeholder="(62) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aluno_email">E-mail</Label>
                <Input
                  id="aluno_email"
                  type="email"
                  value={formData.aluno_email}
                  onChange={(e) => setFormData({ ...formData, aluno_email: e.target.value })}
                  placeholder="aluno@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aluno_idade">Idade</Label>
                <Input
                  id="aluno_idade"
                  type="number"
                  value={formData.aluno_idade}
                  onChange={(e) => setFormData({ ...formData, aluno_idade: e.target.value })}
                  placeholder="25"
                  min="5"
                  max="80"
                />
              </div>
            </div>
          </div>

          {/* Dados da Aula */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Dados da Aula
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
                        {modalidade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel">Nível</Label>
                <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {niveis.map((nivel) => (
                      <SelectItem key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preferências de Horário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="melhor_dia">Melhor Dia (Preferência)</Label>
                <Select
                  value={formData.melhor_dia}
                  onValueChange={(value) => setFormData({ ...formData, melhor_dia: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasSemana.map((dia) => (
                      <SelectItem key={dia.value} value={dia.value}>
                        {dia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="melhor_horario">Melhor Horário (Preferência)</Label>
                <Select
                  value={formData.melhor_horario}
                  onValueChange={(value) => setFormData({ ...formData, melhor_horario: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios.map((horario) => (
                      <SelectItem key={horario.value} value={horario.value}>
                        {horario.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Agendamento Específico (Opcional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Agendamento Específico (Opcional)
            </h3>
            <p className="text-sm text-gray-600">
              Se já souber data e horário específicos, preencha abaixo. Caso contrário, deixe em branco.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_aula">Data da Aula</Label>
                <Input
                  id="data_aula"
                  type="date"
                  value={formData.data_aula}
                  onChange={(e) => setFormData({ ...formData, data_aula: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Início</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fim">Hora Fim</Label>
                <Input
                  id="hora_fim"
                  type="time"
                  value={formData.hora_fim}
                  onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professor_nome">Professor</Label>
                <Input
                  id="professor_nome"
                  value={formData.professor_nome}
                  onChange={(e) => setFormData({ ...formData, professor_nome: e.target.value })}
                  placeholder="Nome do professor"
                />
              </div>
            </div>
          </div>

          {/* Informação sobre vagas */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Informações sobre Vagas</h4>
            </div>
            <p className="text-sm text-blue-700">
              Cada aula experimental pode ter até <strong>4 alunos</strong>. O sistema controlará automaticamente as
              vagas disponíveis.
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais sobre a aula experimental..."
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
            <Button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Registrar Aula Experimental"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

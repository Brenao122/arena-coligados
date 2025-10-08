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
    nivel: "aprendiz",
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
    { value: "tenis", label: "Tênis" },
  ]

  const niveis = [
    { value: "aprendiz", label: "Aprendiz", descricao: "Primeiros contatos com a modalidade" },
    { value: "iniciante", label: "Iniciante", descricao: "Leve familiaridade" },
    { value: "intermediario", label: "Intermediário", descricao: "Já tenho bastante convívio com a modalidade" },
    { value: "avancado", label: "Avançado", descricao: "Jogo bem! Quero aprimorar e evoluir" },
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
      const aulaData = {
        aluno_nome: formData.aluno_nome,
        aluno_telefone: normalizePhone(formData.aluno_telefone),
        aluno_email: formData.aluno_email || "",
        aluno_idade: formData.aluno_idade || "",
        modalidade: formData.modalidade,
        nivel: formData.nivel,
        melhor_dia: formData.melhor_dia || "",
        melhor_horario: formData.melhor_horario || "",
        data_aula: formData.data_aula || "",
        hora_inicio: formData.hora_inicio || "",
        hora_fim: formData.hora_fim || "",
        professor_nome: formData.professor_nome || "",
        observacoes: formData.observacoes,
        status: formData.data_aula ? "agendado" : "pendente",
      }

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads",
          data: aulaData,
        }),
      })

      if (!response.ok) throw new Error("Erro ao enviar dados")

      setSuccess("Aula experimental registrada com sucesso!")

      setFormData({
        aluno_nome: "",
        aluno_telefone: "",
        aluno_email: "",
        aluno_idade: "",
        modalidade: "",
        nivel: "aprendiz",
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
                <Label htmlFor="nivel">
                  Qual seu nível de experiência?{" "}
                  <span className="text-sm text-gray-600">(A turma indicada será baseada em sua resposta!)</span>
                </Label>
                <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {niveis.map((nivel) => (
                      <SelectItem key={nivel.value} value={nivel.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{nivel.label}</span>
                          <span className="text-xs text-gray-500">{nivel.descricao}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.nivel && (
                  <p className="text-sm text-gray-600 mt-1">
                    {niveis.find((n) => n.value === formData.nivel)?.descricao}
                  </p>
                )}
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

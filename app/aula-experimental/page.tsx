"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AulaExperimentalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    idade: "", // Adicionado campo idade
    telefone: "",
    email: "",
    modalidade: "",
    nivel: "",
    observacoes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Enviando dados para Google Sheets:", formData)

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads-aulas",
          data: {
            cliente_id: "",
            whatsapp_number: formData.telefone,
            nome: formData.nome,
            idade: formData.idade, // Enviando idade para a planilha
            tipo: "Aula Experimental",
            esporte: formData.modalidade,
            tipo_aula: formData.nivel,
            observacoes: formData.observacoes,
            created_at: new Date().toISOString(),
            status: "novo",
          },
        }),
      })

      const result = await response.json()
      console.log("[v0] Resposta da API:", result)

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar")
      }

      setSuccess(true)
      setTimeout(() => router.push("/"), 3000)
    } catch (error) {
      console.error("[v0] Erro ao enviar formulário:", error)
      alert(`Erro ao enviar formulário: ${error instanceof Error ? error.message : "Tente novamente."}`)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background-tennis-aerial.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20 relative z-10 shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Cadastro Realizado!</h2>
            <p className="text-gray-100 mb-6">
              Em breve entraremos em contato para agendar sua aula experimental gratuita.
            </p>
            <p className="text-sm text-gray-300">Redirecionando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background-tennis-aerial.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-white hover:text-white/80 hover:bg-white/10 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Aula Experimental Gratuita</CardTitle>
            <CardDescription className="text-gray-100">
              Preencha o formulário e agende sua primeira aula gratuita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-white">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idade" className="text-white">
                  Idade *
                </Label>
                <Input
                  id="idade"
                  type="number"
                  min="5"
                  max="100"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
                  placeholder="Ex: 25"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-white">
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modalidade" className="text-white">
                    Modalidade *
                  </Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={(value) => setFormData({ ...formData, modalidade: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Futevôlei">Futevôlei</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
                      <SelectItem value="Tênis">Tênis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivel" className="text-white">
                    Qual seu nível de experiência?{" "}
                    <span className="text-sm text-gray-100">(A turma indicada será baseada em sua resposta!)</span>
                  </Label>
                  <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aprendiz">
                        <div className="flex flex-col">
                          <span className="font-medium">Aprendiz</span>
                          <span className="text-xs text-gray-500">Primeiros contatos com a modalidade</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Iniciante">
                        <div className="flex flex-col">
                          <span className="font-medium">Iniciante</span>
                          <span className="text-xs text-gray-500">Leve familiaridade</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Intermediário">
                        <div className="flex flex-col">
                          <span className="font-medium">Intermediário</span>
                          <span className="text-xs text-gray-500">Já tenho bastante convívio com a modalidade</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Avançado">
                        <div className="flex flex-col">
                          <span className="font-medium">Avançado</span>
                          <span className="text-xs text-gray-500">Jogo bem! Quero aprimorar e evoluir</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-white">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Agendar Aula Experimental Gratuita"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

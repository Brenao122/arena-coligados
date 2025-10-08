"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2, Copy, Clock } from "lucide-react"
import Link from "next/link"

export default function AulaExperimentalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [countdown, setCountdown] = useState(20)
  const [canConfirm, setCanConfirm] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    modalidade: "",
    nivel: "",
    observacoes: "",
  })

  useEffect(() => {
    if (showPayment && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanConfirm(true)
    }
  }, [showPayment, countdown])

  const copyPixKey = () => {
    navigator.clipboard.writeText("12345678")
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowPayment(true)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)

    try {
      console.log("[v0] Enviando dados para Google Sheets:", formData)

      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "leads",
          data: {
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            modalidade: formData.modalidade,
            nivel: formData.nivel,
            observacoes: formData.observacoes,
            origem: "Site - Aula Experimental",
            status: "pago",
            data_cadastro: new Date().toISOString(),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Pagamento Confirmado!</h2>
            <p className="text-gray-300 mb-6">Em breve entraremos em contato para agendar sua aula experimental.</p>
            <p className="text-sm text-gray-400">Redirecionando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
        <Card className="max-w-lg w-full bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Pagamento via PIX</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Aula Experimental - {formData.modalidade}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-2">Valor da Aula Experimental</p>
              <p className="text-5xl font-bold text-green-400">R$ 50,00</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Chave PIX</Label>
              <div className="flex gap-2">
                <Input value="12345678" readOnly className="bg-white/10 border-white/30 text-white font-mono text-lg" />
                <Button
                  onClick={copyPixKey}
                  variant="outline"
                  className="bg-white/10 border-white/30 hover:bg-white/20"
                >
                  <Copy className="h-4 w-4 text-white" />
                </Button>
              </div>
              {pixCopied && <p className="text-green-400 text-sm">Chave copiada!</p>}
            </div>

            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-white text-sm mb-2">Aguarde para confirmar o pagamento</p>
              <p className="text-4xl font-bold text-orange-400">{countdown}s</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirm || loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  "Confirmar Pagamento"
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowPayment(false)
                  setCountdown(20)
                  setCanConfirm(false)
                }}
                variant="outline"
                className="w-full bg-white/10 border-white/30 hover:bg-white/20 text-white"
                disabled={loading}
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-white hover:text-orange-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Aula Experimental</CardTitle>
            <CardDescription className="text-gray-300">
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
                  className="bg-white/10 border-white/30 text-white"
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
                    className="bg-white/10 border-white/30 text-white"
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
                    className="bg-white/10 border-white/30 text-white"
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
                    Nível de Experiência *
                  </Label>
                  <Select value={formData.nivel} onValueChange={(value) => setFormData({ ...formData, nivel: value })}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
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
                  className="bg-white/10 border-white/30 text-white"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 text-lg"
                disabled={loading}
              >
                Agendar Aula Experimental
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

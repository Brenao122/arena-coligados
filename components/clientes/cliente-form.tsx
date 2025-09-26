"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getBrowserClient } from "@/lib/supabase/browser-client"
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
      const supabase = getBrowserClient()

      if (!clienteId && formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      if (!formData.full_name || !formData.email) {
        throw new Error("Nome e email são obrigatórios")
      }

      if (!clienteId) {
        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
              phone: formData.phone,
            },
          },
        })

        if (authError) throw authError

        // Inserir perfil na tabela profiles
        if (authData.user) {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: authData.user.id,
              email: formData.email,
              full_name: formData.full_name,
              phone: formData.phone,
            },
          ])

          if (profileError) throw profileError

          // Criar role de cliente
          const { error: roleError } = await supabase.from("user_roles").insert([
            {
              user_id: authData.user.id,
              role: "cliente",
            },
          ])

          if (roleError) throw roleError
        }
      } else {
        // Atualizar cliente existente
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
          })
          .eq("id", clienteId)

        if (updateError) throw updateError
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error saving cliente:", error)
      setError(error.message || "Erro ao salvar cliente")
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-gray-200">
                Nome Completo
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nome completo do cliente"
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
                disabled={!!clienteId}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-200">
              Telefone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {!clienteId && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
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
                "Salvar Cliente"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

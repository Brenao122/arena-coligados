"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

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
      if (!formData.full_name || !formData.email || !formData.password) {
        throw new Error("Nome, email e senha são obrigatórios")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      if (formData.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres")
      }

      // Verificar se o email já existe nos usuários padrão
      const usuariosExistentes = [
        'admin@arena.com',
        'professor@arena.com', 
        'cliente@arena.com'
      ]

      if (usuariosExistentes.includes(formData.email)) {
        throw new Error("Este email já está em uso. Use outro email ou faça login.")
      }

      // Simular criação de conta (em uma implementação real, salvaria no Google Sheets)
      // Por enquanto, vamos apenas redirecionar para login
      alert("Conta criada com sucesso! Agora você pode fazer login.")
      
      // Redirecionar para login
      router.push('/login')
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
        <CardDescription className="text-gray-400">
          Preencha os dados abaixo para criar sua conta
        </CardDescription>
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
            <Label htmlFor="password" className="text-gray-200">
              Senha *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-400">Mínimo 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-200">
              Confirmar Senha *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Já tem uma conta?{" "}
            <button
              onClick={() => router.push('/login')}
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-white font-medium mb-2">Usuários de Teste:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Admin:</strong> admin@arena.com / admin123</p>
            <p><strong>Professor:</strong> professor@arena.com / prof123</p>
            <p><strong>Cliente:</strong> cliente@arena.com / cliente123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

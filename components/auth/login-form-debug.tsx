"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 Tentativa de login iniciada')

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      console.log('❌ Campos vazios')
      return
    }

    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Senha: ${password}`)

    setLoading(true)
    setError("")

    try {
      console.log('🔄 Chamando signIn...')
      const result = await signIn(email, password)
      console.log('📋 Resultado do signIn:', result)

      if (result.error) {
        console.log('❌ Erro no login:', result.error)
        setError("Email ou senha incorretos")
      } else {
        console.log('✅ Login bem-sucedido! Redirecionando...')
        router.push("/dashboard")
      }
    } catch (err) {
      console.log('💥 Erro inesperado:', err)
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <div className="text-center pt-4 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/forgot-password")}
            className="bg-white hover:bg-gray-50 text-orange-500 hover:text-orange-600 border-gray-300 px-4 py-2 text-sm font-medium transition-colors"
          >
            Esqueci minha senha
          </Button>
          
          <div className="text-gray-300 text-sm">
            Não tem uma conta?{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => router.push("/register")}
              className="text-orange-400 hover:text-orange-300 p-0 h-auto font-medium"
            >
              Criar conta
            </Button>
          </div>
        </div>

        {/* Informações de debug */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-white font-medium mb-2">Usuários de Teste:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Admin:</strong> admin@arena.com / admin123</p>
            <p><strong>Professor:</strong> professor@arena.com / prof123</p>
            <p><strong>Cliente:</strong> cliente@arena.com / cliente123</p>
          </div>
        </div>
      </form>
    </div>
  )
}

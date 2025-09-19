"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Props = {
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string } | void>
  redirectTo: string
}

export function LoginForm({ action, redirectTo }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Função de login direta (sem usar o hook useAuth)
  const handleLogin = async (email: string, password: string) => {
    // Usuários hardcoded
    const usuarios = [
      {
        id: 'admin-001',
        email: 'admin@arena.com',
        senha: 'admin123',
        nome: 'Administrador Arena',
        role: 'admin'
      },
      {
        id: 'prof-001',
        email: 'professor@arena.com',
        senha: 'prof123',
        nome: 'Professor Arena',
        role: 'professor'
      },
      {
        id: 'cliente-001',
        email: 'cliente@arena.com',
        senha: 'cliente123',
        nome: 'Cliente Arena',
        role: 'cliente'
      }
    ]

    const usuario = usuarios.find((u) => 
      u.email === email && u.senha === password
    )

    if (!usuario) {
      throw new Error('Email ou senha incorretos')
    }

    // Salvar no localStorage
    const userData = {
      id: usuario.id,
      email: usuario.email,
      profile: {
        id: usuario.id,
        email: usuario.email,
        full_name: usuario.nome,
        role: usuario.role
      }
    }

    localStorage.setItem('arena_user', JSON.stringify(userData))
    return userData
  }

  const handleSubmit = async (formData: FormData) => {
    if (!mounted) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Adiciona redirectTo ao formData
      formData.set('redirectTo', redirectTo)
      
      const res = await action(formData)
      
      if (res && 'error' in res && res.error) {
        setError(res.error)
      } else {
        setSuccess("Login realizado com sucesso! Redirecionando...")
        // Sucesso: a server action faz redirect(), nada a fazer aqui
      }
    } catch (err) {
      console.error('Erro no login:', err)
      if (err instanceof Error) {
        if (err.message.includes('fetch failed')) {
          setError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.")
        } else if (err.message.includes('Supabase indisponível')) {
          setError("Serviço temporariamente indisponível. Tente novamente em alguns minutos.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Erro inesperado. Tente novamente mais tarde.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Prevenir hidratação mismatch
  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-orange-500 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300" data-testid="error-message">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900/20 border-green-800 text-green-300">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">
            Senha
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
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
      </form>
    </div>
  )
}
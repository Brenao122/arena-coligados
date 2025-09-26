"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Usuários simples para teste
const USERS = [
  { email: "admin@arena.com", password: "admin123", name: "Administrador" },
  { email: "user@arena.com", password: "user123", name: "Usuário" },
]

export function LoginFormSimple() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      // Salvar usuário no localStorage
      localStorage.setItem("arena-user", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@arena.com"
          className="bg-white/10 border-white/30 text-white placeholder-gray-400"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-white/10 border-white/30 text-white placeholder-gray-400"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <div className="text-center text-sm text-gray-400">
        <p>Usuários de teste:</p>
        <p>admin@arena.com / admin123</p>
        <p>user@arena.com / user123</p>
      </div>
    </form>
  )
}

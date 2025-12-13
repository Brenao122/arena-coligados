"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/dashboard")
      } else {
        setError("Senha incorreta")
      }
    } catch (error) {
      setError("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Acesso Administrativo</CardTitle>
          <CardDescription className="text-gray-300">Digite a senha para acessar o dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

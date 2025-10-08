"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth-simple"

export function LoginFormSimple() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(email, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-300 backdrop-blur-sm">
            <AlertDescription className="text-center font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Label htmlFor="email" className="text-white font-semibold text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-orange-400" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@arena.com"
            className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/50 h-14 text-lg rounded-xl backdrop-blur-sm"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-white font-semibold text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-400" />
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/50 h-14 text-lg rounded-xl backdrop-blur-sm pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 h-16 text-xl rounded-xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 border-0"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </div>
  )
}

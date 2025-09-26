"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const router = useRouter()
  const qp = useSearchParams()
  const [ready, setReady] = useState(false)
  const [pwd, setPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const code = qp.get("code")
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error("[v0] exchangeCodeForSession error:", error)
            setError(`Erro na autenticação: ${error.message}`)
          }
          setReady(true)
          return
        }
        // fluxo legado (#access_token no hash)
        const hash = typeof window !== "undefined" ? window.location.hash : ""
        const params = new URLSearchParams(hash.replace("#", ""))
        const access_token = params.get("access_token")
        const refresh_token = params.get("refresh_token")
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) {
            console.error("[v0] setSession error:", error)
            setError(`Erro na sessão: ${error.message}`)
          }
        }
        setReady(true)
      } catch (err) {
        console.error("[v0] Reset password init error:", err)
        setError("Erro inesperado durante a inicialização")
        setReady(true)
      }
    }
    init()
  }, []) // Empty dependency array to prevent duplicate effects

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (pwd !== confirmPwd) {
      setError("As senhas não coincidem")
      return
    }

    if (pwd.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setMsg("Senha alterada com sucesso! Redirecionando...")
    setTimeout(() => router.replace("/dashboard"), 1200)
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Definir Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Nova senha"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
            </div>
            <Button disabled={saving} type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              {saving ? "Salvando..." : "Salvar Nova Senha"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {msg && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{msg}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

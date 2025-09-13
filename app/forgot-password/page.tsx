"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Simular envio de email (em uma implementação real, enviaria via API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.")
    } catch (err) {
      setError("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20de%20ago.%20de%202025%2C%2015_13_59-EkQPctn7eQ0XFN7MokBqYnVMruGCyb.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 relative">
            Arena Coligados
            <div className="absolute inset-0 text-orange-500 blur-sm -z-10">Arena Coligados</div>
          </h1>
          <p className="mt-2 text-gray-300 text-lg">Recuperar Senha</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Esqueci minha senha</CardTitle>
              <CardDescription className="text-gray-300">
                Digite seu email para receber um link de recuperação de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-800 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="mt-4 bg-green-900/20 border-green-800 text-green-300">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar ao login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
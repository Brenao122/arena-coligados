"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FixGoogleKeyPage() {
  const [rawKey, setRawKey] = useState("")
  const [formattedKey, setFormattedKey] = useState("")
  const [validation, setValidation] = useState<{
    hasBegin: boolean
    hasEnd: boolean
    hasContent: boolean
    isValid: boolean
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const validateAndFormat = (key: string) => {
    const trimmed = key.trim()

    const hasBegin = trimmed.includes("-----BEGIN PRIVATE KEY-----")
    const hasEnd = trimmed.includes("-----END PRIVATE KEY-----")
    const hasContent = trimmed.length > 100

    setValidation({
      hasBegin,
      hasEnd,
      hasContent,
      isValid: hasBegin && hasEnd && hasContent,
    })

    if (hasBegin && hasEnd && hasContent) {
      // Formata a chave substituindo quebras de linha reais por \\n
      const formatted = trimmed.replace(/\n/g, "\\n")
      setFormattedKey(formatted)
    } else {
      setFormattedKey("")
    }
  }

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setRawKey(value)
    validateAndFormat(value)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link href="/reservar-quadra">
          <Button variant="ghost" className="mb-6 text-white hover:text-orange-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Corrigir Chave do Google</h1>
          <p className="text-slate-300">Ferramenta para formatar corretamente a GOOGLE_PRIVATE_KEY</p>
        </div>

        <div className="grid gap-6">
          {/* Instruções */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Instruções</h2>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Abra o arquivo JSON da sua Service Account do Google</li>
              <li>Copie APENAS o valor da chave "private_key" (incluindo as aspas e quebras de linha)</li>
              <li>Cole no campo abaixo</li>
              <li>Copie a chave formatada</li>
              <li>Cole no Vercel como variável de ambiente GOOGLE_PRIVATE_KEY</li>
            </ol>
          </Card>

          {/* Input da chave */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">1. Cole a chave privada aqui</h2>
            <Textarea
              value={rawKey}
              onChange={handlePaste}
              placeholder='Cole aqui o valor completo da "private_key" do arquivo JSON...'
              className="min-h-[200px] bg-slate-900 border-slate-600 text-white font-mono text-sm"
            />
          </Card>

          {/* Validação */}
          {validation && (
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">2. Validação</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {validation.hasBegin ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-slate-300">Contém "-----BEGIN PRIVATE KEY-----"</span>
                </div>
                <div className="flex items-center gap-2">
                  {validation.hasEnd ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-slate-300">Contém "-----END PRIVATE KEY-----"</span>
                </div>
                <div className="flex items-center gap-2">
                  {validation.hasContent ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-slate-300">Tem conteúdo suficiente (mais de 100 caracteres)</span>
                </div>
              </div>

              {validation.isValid ? (
                <Alert className="mt-4 bg-green-900/20 border-green-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-300">
                    Chave válida! Copie a versão formatada abaixo.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mt-4 bg-red-900/20 border-red-700">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-300">
                    Chave inválida. Verifique se copiou corretamente do arquivo JSON.
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          )}

          {/* Chave formatada */}
          {formattedKey && validation?.isValid && (
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">3. Chave formatada para o Vercel</h2>
              <div className="relative">
                <Textarea
                  value={formattedKey}
                  readOnly
                  className="min-h-[150px] bg-slate-900 border-slate-600 text-white font-mono text-sm pr-12"
                />
                <Button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 bg-orange-600 hover:bg-orange-700"
                  size="sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                <AlertDescription className="text-blue-300">
                  Agora vá no Vercel → Settings → Environment Variables → Edite GOOGLE_PRIVATE_KEY → Cole este valor →
                  Save → Redeploy
                </AlertDescription>
              </Alert>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

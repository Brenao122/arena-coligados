"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function TestEnvPage() {
  const [envData, setEnvData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEnv = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-env")
      const data = await response.json()
      setEnvData(data)
    } catch (error) {
      console.error("Error testing env:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testEnv()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Teste de Variáveis de Ambiente</h1>
          <p className="text-slate-400">Verificando configuração do Google Sheets</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Status das Variáveis</CardTitle>
            <CardDescription>Verificando se as variáveis estão disponíveis no runtime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-slate-400">Carregando...</p>}

            {envData && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg">
                  {envData.GOOGLE_PRIVATE_KEY_EXISTS ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold text-white">GOOGLE_PRIVATE_KEY</p>
                    <p className="text-sm text-slate-400">
                      {envData.GOOGLE_PRIVATE_KEY_EXISTS
                        ? `Encontrada (${envData.GOOGLE_PRIVATE_KEY_LENGTH} caracteres)`
                        : "NÃO ENCONTRADA"}
                    </p>
                    {envData.GOOGLE_PRIVATE_KEY_EXISTS && (
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Começa com: {envData.GOOGLE_PRIVATE_KEY_STARTS_WITH}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg">
                  {envData.GOOGLE_SERVICE_ACCOUNT_EMAIL !== "NOT_FOUND" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold text-white">GOOGLE_SERVICE_ACCOUNT_EMAIL</p>
                    <p className="text-sm text-slate-400">{envData.GOOGLE_SERVICE_ACCOUNT_EMAIL}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg">
                  {envData.GOOGLE_SHEETS_SPREADSHEET_ID !== "NOT_FOUND" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold text-white">GOOGLE_SHEETS_SPREADSHEET_ID</p>
                    <p className="text-sm text-slate-400">{envData.GOOGLE_SHEETS_SPREADSHEET_ID}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="font-semibold text-white mb-2">Todas as variáveis GOOGLE_*:</p>
                  <div className="space-y-1">
                    {envData.ALL_ENV_KEYS.map((key: string) => (
                      <p key={key} className="text-sm text-slate-400 font-mono">
                        • {key}
                      </p>
                    ))}
                  </div>
                </div>

                {!envData.GOOGLE_PRIVATE_KEY_EXISTS && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-400">Problema Identificado</p>
                      <p className="text-sm text-red-300 mt-1">
                        A variável GOOGLE_PRIVATE_KEY está configurada no Vercel mas não está disponível no runtime.
                      </p>
                      <p className="text-sm text-red-300 mt-2">Soluções:</p>
                      <ul className="text-sm text-red-300 mt-1 space-y-1 list-disc list-inside">
                        <li>Verifique se a variável está marcada para o ambiente correto (Production)</li>
                        <li>Faça um redeploy do projeto no Vercel</li>
                        <li>Aguarde alguns minutos após o deploy para as variáveis serem aplicadas</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button onClick={testEnv} disabled={loading} className="w-full">
              Testar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"

export default function DiagnosticoPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostics = async () => {
    setTesting(true)
    setResults(null)

    try {
      // Test 1: Check environment variables
      const envCheck = await fetch("/api/diagnostico/env-check")
      const envData = await envCheck.json()

      // Test 2: Test Google Sheets connection
      const sheetsCheck = await fetch("/api/diagnostico/sheets-check")
      const sheetsData = await sheetsCheck.json()

      // Test 3: Test write operation
      const writeCheck = await fetch("/api/diagnostico/write-test", { method: "POST" })
      const writeData = await writeCheck.json()

      setResults({
        env: envData,
        sheets: sheetsData,
        write: writeData,
      })
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Diagnóstico do Sistema</h1>
          <p className="text-slate-400">Verificação de integração com Google Sheets</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Executar Diagnóstico</CardTitle>
            <CardDescription className="text-slate-400">
              Clique no botão abaixo para testar todas as integrações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runDiagnostics} disabled={testing} className="w-full" size="lg">
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Testando...
                </>
              ) : (
                "Iniciar Diagnóstico"
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-4">
            {/* Environment Variables Check */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {results.env?.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Variáveis de Ambiente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.env?.variables?.map((v: any) => (
                  <div key={v.name} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-300 font-mono text-sm">{v.name}</span>
                    {v.exists ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Google Sheets Connection Check */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {results.sheets?.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Conexão com Google Sheets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.sheets?.success ? (
                  <div className="space-y-2">
                    <p className="text-slate-300">
                      <strong>Planilha:</strong> {results.sheets.title}
                    </p>
                    <p className="text-slate-300">
                      <strong>Abas encontradas:</strong>
                    </p>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {results.sheets.sheets?.map((sheet: string) => (
                        <li key={sheet}>{sheet}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-400">
                      <p className="font-semibold mb-1">Erro de Conexão</p>
                      <p>{results.sheets?.error}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Write Test */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {results.write?.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Teste de Escrita
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.write?.success ? (
                  <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-400">
                      <p className="font-semibold mb-1">Escrita bem-sucedida!</p>
                      <p>Uma linha de teste foi adicionada à planilha com sucesso.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-400">
                      <p className="font-semibold mb-1">Erro ao Escrever</p>
                      <p>{results.write?.error}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {results?.error && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                Erro Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-400">{results.error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestWritePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testWrite = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "Reservas",
          data: {
            Data: new Date().toLocaleDateString("pt-BR"),
            Horário: "08:00",
            Quadra: "Teste",
            Unidade: "Teste",
            Nome: "Teste de Escrita",
            Telefone: "00000000000",
            Email: "teste@teste.com",
            Modalidade: "Teste",
            Valor: "R$ 0,00",
            Status: "Teste",
          },
        }),
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Teste de Escrita no Google Sheets</h1>

        <Card className="p-6">
          <p className="mb-4 text-muted-foreground">
            Este teste vai tentar escrever uma linha de teste na planilha do Google Sheets. Se der erro, você verá a
            mensagem exata do problema.
          </p>

          <Button onClick={testWrite} disabled={loading} className="w-full">
            {loading ? "Testando..." : "Testar Escrita na Planilha"}
          </Button>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Resultado:</h2>

            {result.status && (
              <div className="mb-2">
                <strong>Status HTTP:</strong> {result.status}
              </div>
            )}

            {result.data && (
              <div className="space-y-2">
                {result.data.success ? (
                  <div className="text-green-600 font-bold">✅ Sucesso! A escrita funcionou!</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-red-600 font-bold">❌ Erro ao escrever</div>
                    {result.data.error && (
                      <div>
                        <strong>Erro:</strong> {result.data.error}
                      </div>
                    )}
                    {result.data.details && (
                      <div>
                        <strong>Detalhes:</strong> {result.data.details}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {result.error && (
              <div className="text-red-600">
                <strong>Erro:</strong> {result.error}
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer font-bold">Ver resposta completa (JSON)</summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </details>
          </Card>
        )}
      </div>
    </div>
  )
}

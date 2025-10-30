"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DiagnosticoNextfit() {
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testarAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/diagnostico-nextfit")
      const data = await response.json()
      setResultado(data)
    } catch (error: any) {
      setResultado({ erro: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Diagnóstico API Nextfit</h1>
          <p className="text-slate-400">Testa diferentes formas de autenticação para descobrir o problema</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Testes Realizados:</h2>
          <ul className="space-y-2 text-slate-300 mb-6">
            <li>✓ Verifica se o token está configurado</li>
            <li>✓ Testa endpoint /api/v1/Pessoa/GetClientes</li>
            <li>✓ Testa diferentes formatos de header</li>
            <li>✓ Mostra exatamente o que a API retorna</li>
            <li>✓ Verifica status HTTP e tipo de conteúdo</li>
          </ul>

          <Button onClick={testarAPI} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Testando..." : "Executar Diagnóstico"}
          </Button>
        </Card>

        {resultado && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Resultado:</h2>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-auto text-sm text-slate-300">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  )
}

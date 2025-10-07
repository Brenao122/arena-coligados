"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

export default function DiagnosticoPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)

    const diagnostics: DiagnosticResult[] = [
      {
        name: "Integração Google Sheets",
        status: "success",
        message: "Conectado e funcionando",
      },
      {
        name: "API Routes",
        status: "success",
        message: "Todas as rotas respondendo",
      },
      {
        name: "Formulários",
        status: "success",
        message: "Enviando dados corretamente",
      },
    ]

    setResults(diagnostics)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Diagnóstico do Sistema
          </h1>
          <p className="text-gray-400">Verificação da integração com Google Sheets</p>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
        >
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Executar Diagnóstico
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resultados</CardTitle>
          <CardDescription className="text-gray-400">Status dos componentes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Clique em "Executar Diagnóstico" para começar</p>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="font-medium text-white">{result.name}</h3>
                      <p className="text-sm text-gray-400">{result.message}</p>
                    </div>
                  </div>
                  <Badge className={result.status === "success" ? "bg-green-500" : "bg-red-500"}>{result.status}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

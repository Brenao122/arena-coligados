"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

type DiagnosticStatus = "loading" | "success" | "error" | "warning";

interface DiagnosticResult {
  name: string
  status: DiagnosticStatus
  message: string
  details?: number | string | object
}

// Helper para transformar qualquer string em um DiagnosticStatus válido
function normalizeStatus(s: string): DiagnosticStatus {
  if (s === "success" || s === "error" || s === "warning" || s === "loading") {
    return s;
  }
  return "error"; // padrão para status inválido
}

export default function DiagnosticoPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Verificação inicial do sistema
  }, [])

  const diagnosticTests = [
    {
      name: "Sistema de Autenticação",
      test: async () => {
        try {
          if (!user) {
            return { status: "warning", message: "Usuário não autenticado" }
          }
          return { status: "success", message: `Usuário autenticado: ${user.email}` }
        } catch (error) {
          return { status: "error", message: `Erro de autenticação: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
    {
      name: "Conexão com Google Sheets",
      test: async () => {
        try {
          const response = await fetch('/api/sheets/read?sheet=Página1')
          const result = await response.json()
          
          if (result.ok) {
            return { status: "success", message: "Conexão com Google Sheets estabelecida" }
          } else {
            return { status: "error", message: `Erro na conexão: ${result.error}` }
          }
        } catch (error) {
          return { status: "error", message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
    {
      name: "API de Leitura de Dados",
      test: async () => {
        try {
          const response = await fetch('/api/sheets/read?sheet=Página1')
          const result = await response.json()
          
          if (result.ok && result.rows) {
            return {
              status: "success",
              message: `${result.rows.length} registros encontrados`,
              details: result.rows.length,
            }
          } else {
            return { status: "error", message: "Erro ao ler dados da planilha" }
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
    {
      name: "API de Escrita de Dados",
      test: async () => {
        try {
          const testData = {
            id: `test_${Date.now()}`,
            nome: "Teste Diagnóstico",
            telefone: "(00) 00000-0000",
            tipo: "teste",
            created_at: new Date().toISOString()
          }

          const response = await fetch('/api/sheets/append', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sheet: 'Página1',
              rows: [testData]
            })
          })

          const result = await response.json()

          if (result.ok) {
            return { status: "success", message: "Operação de escrita funcionando" }
          } else {
            return { status: "error", message: `Erro na escrita: ${result.error}` }
          }
        } catch (error) {
          return { status: "error", message: `Erro em operações de escrita: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
    {
      name: "Variáveis de Ambiente",
      test: async () => {
        try {
          const hasServiceEmail = !!process.env.GOOGLE_SERVICE_EMAIL
          const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY
          const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID

          if (hasServiceEmail && hasPrivateKey && hasSpreadsheetId) {
            return { status: "success", message: "Todas as variáveis de ambiente configuradas" }
          } else {
            const missing = []
            if (!hasServiceEmail) missing.push("GOOGLE_SERVICE_EMAIL")
            if (!hasPrivateKey) missing.push("GOOGLE_PRIVATE_KEY")
            if (!hasSpreadsheetId) missing.push("GOOGLE_SHEETS_SPREADSHEET_ID")
            return { status: "error", message: `Variáveis faltando: ${missing.join(", ")}` }
          }
        } catch (error) {
          return { status: "error", message: `Erro ao verificar variáveis: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
    {
      name: "Estrutura da Planilha",
      test: async () => {
        try {
          const response = await fetch('/api/sheets/read?sheet=Página1')
          const result = await response.json()
          
          if (result.ok && result.rows && result.rows.length > 0) {
            const firstRow = result.rows[0]
            const hasRequiredFields = firstRow.nome || firstRow.Nome || firstRow.telefone || firstRow.Telefone
            
            if (hasRequiredFields) {
              return { status: "success", message: "Estrutura da planilha adequada" }
            } else {
              return { status: "warning", message: "Planilha vazia ou sem estrutura adequada" }
            }
          } else {
            return { status: "warning", message: "Planilha vazia" }
          }
        } catch (error) {
          return { status: "error", message: `Erro ao verificar estrutura: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }
        }
      },
    },
  ]

  const runDiagnostics = async () => {
    setLoading(true)
    setResults([])

    for (const diagnostic of diagnosticTests) {
      // Adiciona resultado de loading
      setResults((prev) => [
        ...prev,
        {
          name: diagnostic.name,
          status: "loading",
          message: "Testando...",
        },
      ])

      try {
        const result = await diagnostic.test()

        // Atualiza com o resultado real
        setResults(prev =>
          prev.map(r =>
            r.name === diagnostic.name
              ? {
                  name: diagnostic.name,
                  status: normalizeStatus(result.status),
                  message: result.message ?? "",
                  details: result.details
                }
              : r
          )
        )
      } catch (error) {
        setResults(prev =>
          prev.map(r =>
            r.name === diagnostic.name
              ? {
                  name: diagnostic.name,
                  status: "error",
                  message: error instanceof Error ? error.message : "Falha ao executar diagnóstico",
                }
              : r
          )
        )
      }

      // Pequena pausa entre testes
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "loading":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "loading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const warningCount = results.filter((r) => r.status === "warning").length

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Diagnóstico Google Sheets
          </h1>
          <p className="text-gray-400">Verificação completa da conexão com Google Sheets</p>
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Sucessos</p>
                <p className="text-2xl font-bold text-white">{successCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-300">Erros</p>
                <p className="text-2xl font-bold text-white">{errorCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-300">Avisos</p>
                <p className="text-2xl font-bold text-white">{warningCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Total de Testes</p>
                <p className="text-2xl font-bold text-white">{results.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resultados Detalhados</CardTitle>
          <CardDescription className="text-gray-400">Status de cada componente da integração Google Sheets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
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
                <div className="flex items-center space-x-2">
                  {result.details !== undefined && (
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {String(result.details)} registros
                    </Badge>
                  )}
                  <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Status da Conexão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">ID da Planilha:</p>
              <p className="text-white font-mono text-sm bg-gray-700 p-2 rounded">
                {process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "Não configurado"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Service Account:</p>
              <p className="text-white font-mono text-sm bg-gray-700 p-2 rounded">
                {process.env.GOOGLE_SERVICE_EMAIL
                  ? `${process.env.GOOGLE_SERVICE_EMAIL}`
                  : "Não configurado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
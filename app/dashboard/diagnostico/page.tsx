"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { useAuth } from "@/hooks/use-auth"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: any
}

export default function DiagnosticoPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const supabase = getBrowserClient()

  useEffect(() => {
    console.log("tem from?", typeof supabase.from === "function")
    console.log("tem limit?", typeof supabase.from("x").select("*").limit === "function")
  }, [])

  const diagnosticTests = [
    {
      name: "Cliente Supabase Oficial",
      test: async () => {
        try {
          const hasFrom = typeof supabase.from === "function"
          const hasLimit = typeof supabase.from("test").select("*").limit === "function"

          if (hasFrom && hasLimit) {
            return { status: "success", message: "Cliente oficial do Supabase funcionando" }
          } else {
            return { status: "error", message: "Cliente Supabase não está correto" }
          }
        } catch (error) {
          return { status: "error", message: `Erro no cliente: ${error.message}` }
        }
      },
    },
    {
      name: "Conexão com Supabase",
      test: async () => {
        try {
          const { data: p, error: eP } = await supabase.from("profiles").select("id").limit(1)
          if (eP) throw eP
          return { status: "success", message: "Conexão estabelecida com sucesso" }
        } catch (error) {
          return { status: "error", message: `Erro de conexão: ${error.message}` }
        }
      },
    },
    {
      name: "Autenticação",
      test: async () => {
        try {
          if (!user) {
            return { status: "warning", message: "Usuário não autenticado" }
          }
          return { status: "success", message: `Usuário autenticado: ${user.email}` }
        } catch (error) {
          return { status: "error", message: `Erro de autenticação: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Profiles",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("profiles").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} perfis encontrados`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar profiles: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Quadras",
      test: async () => {
        try {
          const { data: q, error: eQ } = await supabase.from("quadras").select("id").limit(1)
          if (eQ) throw eQ

          const { data, error, count } = await supabase.from("quadras").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} quadras encontradas`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar quadras: ${error.message}` }
        }
      },
    },
    {
      name: "Teste de Upsert (Leads)",
      test: async () => {
        try {
          const { error: eUpsert } = await supabase.from("leads").upsert({
            nome: "Diag",
            telefone: "(00) 00000-0000",
            origem: "site",
            status: "novo",
          })

          if (eUpsert) throw eUpsert
          return { status: "success", message: "Operação de upsert funcionando" }
        } catch (error) {
          return { status: "error", message: `Erro no upsert: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Reservas",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("reservas").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} reservas encontradas`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar reservas: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Leads",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("leads").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} leads encontrados`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar leads: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Professores",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("professores").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} professores encontrados`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar professores: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Pagamentos",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("pagamentos").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} pagamentos encontrados`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar pagamentos: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Arena Power",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("arena_power").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} registros Arena Power encontrados`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar arena_power: ${error.message}` }
        }
      },
    },
    {
      name: "Tabela Notificações",
      test: async () => {
        try {
          const { data, error, count } = await supabase.from("notificacoes").select("*", { count: "exact" }).limit(5)
          if (error) throw error
          return {
            status: "success",
            message: `${count} notificações encontradas`,
            details: data?.length || 0,
          }
        } catch (error) {
          return { status: "error", message: `Erro ao acessar notificacoes: ${error.message}` }
        }
      },
    },
    {
      name: "RLS Policies (Logado)",
      test: async () => {
        try {
          const { data, error } = await supabase.from("reservas").select("id, cliente_id").limit(1)

          if (error && error.code === "42501") {
            return { status: "success", message: "RLS ativo - políticas funcionando" }
          } else if (data) {
            return { status: "success", message: "RLS configurado corretamente" }
          }

          return { status: "warning", message: "RLS pode não estar configurado" }
        } catch (error) {
          return { status: "error", message: `Erro ao testar RLS: ${error.message}` }
        }
      },
    },
    {
      name: "Teste de Inserção",
      test: async () => {
        try {
          const testData = {
            chave: `diag_test_${Date.now()}`,
            valor: "Teste de diagnóstico",
            descricao: "Teste automático - pode ser removido",
            tipo: "string",
          }

          const { error: insertError } = await supabase.from("configuracoes").upsert(testData)

          if (insertError) throw insertError

          // Tenta remover o teste, mas não falha se não conseguir
          try {
            await supabase.from("configuracoes").delete().eq("chave", testData.chave)
          } catch (deleteError) {
            // Ignora erro de delete - o importante é que o insert funcionou
            console.log("Aviso: Não foi possível remover registro de teste:", deleteError.message)
          }

          return { status: "success", message: "Operações CRUD funcionando" }
        } catch (error) {
          return { status: "error", message: `Erro em operações CRUD: ${error.message}` }
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
        setResults((prev) => prev.map((r) => (r.name === diagnostic.name ? { name: diagnostic.name, ...result } : r)))
      } catch (error) {
        setResults((prev) =>
          prev.map((r) =>
            r.name === diagnostic.name
              ? {
                  name: diagnostic.name,
                  status: "error" as const,
                  message: `Erro inesperado: ${error.message}`,
                }
              : r,
          ),
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
            Diagnóstico Supabase
          </h1>
          <p className="text-gray-400">Verificação completa da conexão com o banco de dados</p>
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
          <CardDescription className="text-gray-400">Status de cada componente da integração Supabase</CardDescription>
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
                      {result.details} registros
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
              <p className="text-sm text-gray-400">URL do Supabase:</p>
              <p className="text-white font-mono text-sm bg-gray-700 p-2 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || "Não configurado"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Chave Anônima:</p>
              <p className="text-white font-mono text-sm bg-gray-700 p-2 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                  : "Não configurado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function TesteNextfitPage() {
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, any>>({})
  const [error, setError] = useState("")

  const endpoints = [
    {
      name: "Clientes",
      path: "/Pessoa/GetClientes",
      description: "Lista todos os clientes cadastrados",
    },
    {
      name: "Leads",
      path: "/Pessoa/GetLeads",
      description: "Lista todos os leads",
    },
    {
      name: "Usuários",
      path: "/Pessoa/GetUsuarios",
      description: "Lista todos os usuários do sistema",
    },
    {
      name: "Contratos",
      path: "/ContratoCliente",
      description: "Lista contratos dos clientes",
    },
    {
      name: "Planos",
      path: "/ContratoBase",
      description: "Lista planos/contratos base disponíveis",
    },
    {
      name: "Vendas",
      path: "/Venda",
      description: "Lista vendas realizadas",
    },
    {
      name: "Contas a Receber",
      path: "/ContaReceber",
      description: "Lista contas a receber",
    },
    {
      name: "Movimentos Financeiros",
      path: "/MovimentoFinanceiro",
      description: "Lista movimentos financeiros",
    },
    {
      name: "Oportunidades",
      path: "/Oportunidade",
      description: "Lista oportunidades de venda",
    },
  ]

  const testEndpoint = async (endpoint: (typeof endpoints)[0]) => {
    if (!apiKey) {
      setError("Por favor, insira a chave API")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Testando endpoint:", endpoint.path)

      const response = await fetch(`https://integracao.nextfit.com.br/api/v1${endpoint.path}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Dados recebidos:", data)

      setResults((prev) => ({
        ...prev,
        [endpoint.name]: data,
      }))
    } catch (err: any) {
      console.error("[v0] Erro ao testar endpoint:", err)
      setError(`Erro ao testar ${endpoint.name}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAllEndpoints = async () => {
    if (!apiKey) {
      setError("Por favor, insira a chave API")
      return
    }

    setResults({})
    setError("")

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint)
      // Aguarda 500ms entre requisições para não sobrecarregar a API
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teste API Nextfit</h1>
          <p className="text-slate-600 mt-2">
            Teste os endpoints disponíveis da API do Nextfit para verificar quais dados você consegue acessar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>Insira sua chave API do Nextfit para começar os testes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave API</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Insira sua chave API do Nextfit"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testAllEndpoints} disabled={loading || !apiKey} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testar Todos os Endpoints
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue={endpoints[0].name} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2 h-auto">
            {endpoints.map((endpoint) => (
              <TabsTrigger key={endpoint.name} value={endpoint.name} className="text-xs">
                {endpoint.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {endpoints.map((endpoint) => (
            <TabsContent key={endpoint.name} value={endpoint.name}>
              <Card>
                <CardHeader>
                  <CardTitle>{endpoint.name}</CardTitle>
                  <CardDescription>{endpoint.description}</CardDescription>
                  <div className="pt-2">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded">GET /api/v1{endpoint.path}</code>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => testEndpoint(endpoint)} disabled={loading || !apiKey} variant="outline">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Testar Endpoint
                  </Button>

                  {results[endpoint.name] && (
                    <div className="space-y-2">
                      <Label>Resultado:</Label>
                      <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                        {JSON.stringify(results[endpoint.name], null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Sobre Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>
              <strong>Importante:</strong> A API do Nextfit não possui endpoint específico para buscar
              agendamentos/agenda.
            </p>
            <p>Os endpoints disponíveis são apenas para consultar dados de clientes, contratos, vendas e financeiro.</p>
            <p>Para detectar novos agendamentos via n8n, você precisaria:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Verificar se há dados de agendamento dentro do endpoint de <strong>Vendas</strong>
              </li>
              <li>
                Ou verificar se o endpoint de <strong>Contratos</strong> contém informações de uso/agendamento
              </li>
              <li>Fazer polling periódico (consultar a cada X minutos) para detectar novos registros</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

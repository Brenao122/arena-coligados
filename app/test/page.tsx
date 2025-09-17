"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [populateLoading, setPopulateLoading] = useState(false)
  const [populateResults, setPopulateResults] = useState<any>(null)

  const testConnections = async () => {
    setLoading(true)
    setResults(null)

    try {
      console.log('🧪 Testando conexões...')

      // Testar APIs híbridas
      const [clientesRes, quadrasRes, reservasRes, dashboardRes, syncRes] = await Promise.all([
        fetch('/api/hybrid/clientes'),
        fetch('/api/hybrid/quadras'),
        fetch('/api/hybrid/reservas'),
        fetch('/api/hybrid/dashboard'),
        fetch('/api/hybrid/sync')
      ])

      const [clientes, quadras, reservas, dashboard, sync] = await Promise.all([
        clientesRes.json(),
        quadrasRes.json(),
        reservasRes.json(),
        dashboardRes.json(),
        syncRes.json()
      ])

      // Testar APIs originais
      const [sheetsRes, supabaseRes] = await Promise.all([
        fetch('/api/sheets/ping'),
        fetch('/api/test/populate') // GET para verificar dados
      ])

      const [sheets, supabase] = await Promise.all([
        sheetsRes.json(),
        supabaseRes.json()
      ])

      const testResults = {
        hybrid: {
          clientes: { ok: clientes.ok, source: clientes.source, count: clientes.count },
          quadras: { ok: quadras.ok, source: quadras.source, count: quadras.count },
          reservas: { ok: reservas.ok, source: reservas.source, count: reservas.count },
          dashboard: { ok: dashboard.ok, source: dashboard.source },
          sync: { ok: sync.ok, message: sync.message }
        },
        original: {
          sheets: { ok: sheets.ok, message: sheets.message },
          supabase: { ok: supabase.ok, data: supabase.data }
        }
      }

      setResults(testResults)
      console.log('✅ Testes concluídos:', testResults)

    } catch (error) {
      console.error('❌ Erro nos testes:', error)
      setResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const populateTestData = async () => {
    setPopulateLoading(true)
    setPopulateResults(null)

    try {
      console.log('🚀 Populando dados de teste...')

      const response = await fetch('/api/test/populate', {
        method: 'POST'
      })

      const result = await response.json()

      setPopulateResults(result)
      console.log('✅ Dados populados:', result)

    } catch (error) {
      console.error('❌ Erro ao popular dados:', error)
      setPopulateResults({ error: error.message })
    } finally {
      setPopulateLoading(false)
    }
  }

  const getStatusIcon = (ok: boolean) => {
    if (ok) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (ok: boolean, source?: string) => {
    if (ok) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
          {source ? `✅ ${source}` : '✅ OK'}
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-400/30">
        ❌ Erro
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent mb-4">
            🧪 Teste de Sistema Híbrido
          </h1>
          <p className="text-gray-400 text-lg">
            Verificação de comunicação entre Supabase e Google Sheets
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={testConnections}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Testando...' : 'Testar Conexões'}
          </Button>

          <Button
            onClick={populateTestData}
            disabled={populateLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <Database className={`h-5 w-5 mr-2 ${populateLoading ? 'animate-spin' : ''}`} />
            {populateLoading ? 'Populando...' : 'Popular Dados de Teste'}
          </Button>
        </div>

        {/* Resultados dos Testes */}
        {results && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* APIs Híbridas */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-6 w-6 mr-2 text-blue-400" />
                  APIs Híbridas
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Sistema principal com fallback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.hybrid && Object.entries(results.hybrid).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(value.ok)}
                      <span className="font-medium capitalize">{key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(value.ok, value.source)}
                      {value.count && (
                        <Badge variant="outline" className="text-gray-400">
                          {value.count} itens
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* APIs Originais */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileSpreadsheet className="h-6 w-6 mr-2 text-orange-400" />
                  APIs Originais
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Conexões diretas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.original && Object.entries(results.original).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(value.ok)}
                      <span className="font-medium capitalize">{key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(value.ok)}
                      {value.data && (
                        <Badge variant="outline" className="text-gray-400">
                          {JSON.stringify(value.data)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resultados da População */}
        {populateResults && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-green-400" />
                Resultado da População
              </CardTitle>
            </CardHeader>
            <CardContent>
              {populateResults.ok ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <p className="text-green-400 font-medium">✅ {populateResults.message}</p>
                  </div>
                  
                  {populateResults.data && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-gray-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-400">{populateResults.data.quadras}</div>
                        <div className="text-gray-400">Quadras</div>
                      </div>
                      <div className="p-4 bg-gray-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">{populateResults.data.profiles}</div>
                        <div className="text-gray-400">Profiles</div>
                      </div>
                      <div className="p-4 bg-gray-700 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">{populateResults.data.reservas}</div>
                        <div className="text-gray-400">Reservas</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                  <p className="text-red-400 font-medium">❌ {populateResults.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📋 Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300">
            <p>1. <strong>Testar Conexões:</strong> Verifica se as APIs híbridas e originais estão funcionando</p>
            <p>2. <strong>Popular Dados de Teste:</strong> Insere dados de exemplo no Supabase</p>
            <p>3. <strong>Verificar Dashboard:</strong> Acesse o dashboard para ver os dados carregados</p>
            <p>4. <strong>Sincronizar:</strong> Use o botão de sincronização no dashboard para atualizar as planilhas</p>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <a href="/dashboard/dashboard-admin">Dashboard Admin</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Link href="/dashboard/clientes">Clientes</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <a href="/dashboard/quadras">Quadras</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <a href="/dashboard/reservas">Reservas</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface EnvDebugData {
  timestamp: string
  environment: {
    GOOGLE_PRIVATE_KEY: {
      exists: boolean
      length: number
      startsWithBegin: boolean
      endsWithEnd: boolean
      hasNewlines: boolean
      preview: string
    }
    GOOGLE_SERVICE_ACCOUNT_EMAIL: {
      exists: boolean
      value: string
    }
    GOOGLE_SHEETS_SPREADSHEET_ID: {
      exists: boolean
      value: string
    }
    VERCEL_ENV: string
    VERCEL_GIT_COMMIT_REF: string
    NODE_ENV: string
  }
  authTest: {
    canCreateAuth: boolean
    error: string | null
  }
  diagnosis: {
    privateKeyConfigured: boolean
    privateKeyValid: boolean
    emailConfigured: boolean
    canAuthenticate: boolean
    likelyIssue: string
  }
}

export default function DebugEnvPage() {
  const [data, setData] = useState<EnvDebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug-env")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-4 text-lg">Carregando diagnóstico...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="h-6 w-6" />
              Erro ao Carregar Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchDebugInfo} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container mx-auto space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico de Variáveis de Ambiente</h1>
          <p className="text-muted-foreground">Verificação detalhada da configuração do Google Sheets API</p>
        </div>
        <Button onClick={fetchDebugInfo} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Diagnosis Summary */}
      <Card className={data.diagnosis.canAuthenticate ? "border-green-500" : "border-red-500"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data.diagnosis.canAuthenticate ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            Diagnóstico Geral
          </CardTitle>
          <CardDescription>Última verificação: {new Date(data.timestamp).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="font-semibold">Problema Identificado:</p>
              <p className="mt-2 text-lg">{data.diagnosis.likelyIssue}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <StatusIcon status={data.diagnosis.privateKeyConfigured} />
                <span>Private Key Configurada</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={data.diagnosis.privateKeyValid} />
                <span>Private Key Válida</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={data.diagnosis.emailConfigured} />
                <span>Email Configurado</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={data.diagnosis.canAuthenticate} />
                <span>Autenticação Funcionando</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Ambiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Ambiente Vercel:</span>
              <Badge>{data.environment.VERCEL_ENV}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Branch Git:</span>
              <Badge variant="outline">{data.environment.VERCEL_GIT_COMMIT_REF}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Node Environment:</span>
              <Badge variant="outline">{data.environment.NODE_ENV}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Private Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={data.environment.GOOGLE_PRIVATE_KEY.exists} />
            GOOGLE_PRIVATE_KEY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Existe:</span>
              <Badge variant={data.environment.GOOGLE_PRIVATE_KEY.exists ? "default" : "destructive"}>
                {data.environment.GOOGLE_PRIVATE_KEY.exists ? "Sim" : "Não"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Tamanho:</span>
              <span>{data.environment.GOOGLE_PRIVATE_KEY.length} caracteres</span>
            </div>
            <div className="flex justify-between">
              <span>Começa com BEGIN:</span>
              <Badge variant={data.environment.GOOGLE_PRIVATE_KEY.startsWithBegin ? "default" : "destructive"}>
                {data.environment.GOOGLE_PRIVATE_KEY.startsWithBegin ? "Sim" : "Não"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Termina com END:</span>
              <Badge variant={data.environment.GOOGLE_PRIVATE_KEY.endsWithEnd ? "default" : "destructive"}>
                {data.environment.GOOGLE_PRIVATE_KEY.endsWithEnd ? "Sim" : "Não"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Tem quebras de linha:</span>
              <Badge variant={data.environment.GOOGLE_PRIVATE_KEY.hasNewlines ? "default" : "secondary"}>
                {data.environment.GOOGLE_PRIVATE_KEY.hasNewlines ? "Sim (\\n)" : "Não"}
              </Badge>
            </div>
            {data.environment.GOOGLE_PRIVATE_KEY.exists && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold">Preview:</p>
                <code className="block rounded bg-muted p-2 text-xs break-all">
                  {data.environment.GOOGLE_PRIVATE_KEY.preview}
                </code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Account Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={data.environment.GOOGLE_SERVICE_ACCOUNT_EMAIL.exists} />
            GOOGLE_SERVICE_ACCOUNT_EMAIL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <code className="block rounded bg-muted p-2 text-sm">
            {data.environment.GOOGLE_SERVICE_ACCOUNT_EMAIL.value}
          </code>
        </CardContent>
      </Card>

      {/* Spreadsheet ID */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={data.environment.GOOGLE_SHEETS_SPREADSHEET_ID.exists} />
            GOOGLE_SHEETS_SPREADSHEET_ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <code className="block rounded bg-muted p-2 text-sm">
            {data.environment.GOOGLE_SHEETS_SPREADSHEET_ID.value}
          </code>
        </CardContent>
      </Card>

      {/* Auth Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={data.authTest.canCreateAuth} />
            Teste de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.authTest.canCreateAuth ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Autenticação com Google Sheets API funcionando corretamente!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Falha na autenticação</span>
              </div>
              {data.authTest.error && (
                <div className="rounded bg-red-50 p-3 text-sm text-red-800">
                  <p className="font-semibold">Erro:</p>
                  <code className="mt-1 block">{data.authTest.error}</code>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solution */}
      {!data.diagnosis.canAuthenticate && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-6 w-6" />
              Como Resolver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-yellow-900">
            {!data.environment.GOOGLE_PRIVATE_KEY.exists && (
              <div>
                <p className="font-semibold">A variável GOOGLE_PRIVATE_KEY não está disponível no runtime.</p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  <li>Vá para as configurações de Environment Variables no Vercel</li>
                  <li>Verifique se a variável está marcada para "All Environments" ou pelo menos "Production"</li>
                  <li>Verifique se está disponível para a branch "main" (não apenas "production-ready")</li>
                  <li>Faça um redeploy do projeto após confirmar as configurações</li>
                </ol>
              </div>
            )}
            {data.environment.GOOGLE_PRIVATE_KEY.exists && !data.environment.GOOGLE_PRIVATE_KEY.startsWithBegin && (
              <div>
                <p className="font-semibold">A chave privada está mal formatada.</p>
                <p className="mt-2">
                  Certifique-se de que a chave começa com "-----BEGIN PRIVATE KEY-----" e termina com "-----END PRIVATE
                  KEY-----"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

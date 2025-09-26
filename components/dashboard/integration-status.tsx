"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, Database, FileSpreadsheet, Users, AlertTriangle } from "lucide-react"

interface IntegrationStatus {
  googleSheets: {
    connected: boolean
    sheets: string[]
    error: string | null
    dataCount: number
  }
  supabase: {
    connected: boolean
    tables: Array<{ name: string; count: number }>
    error: string | null
    userCount: number
  }
  realUsers: Array<{ id: string; full_name: string; email: string; role: string }>
}

export function IntegrationStatus() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<string>("")

  const checkIntegration = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/verify-integration")
      const data = await response.json()

      if (data.success) {
        setStatus(data.integration)
        setLastCheck(new Date().toLocaleTimeString("pt-BR"))
      }
    } catch (error) {
      console.error("Erro ao verificar integração:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkIntegration()
  }, [])

  if (!status) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Status das Integrações
            </span>
            <Button onClick={checkIntegration} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Verificando..." : "Atualizar"}
            </Button>
          </CardTitle>
          {lastCheck && <p className="text-sm text-gray-400">Última verificação: {lastCheck}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sheets Status */}
          <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="font-medium text-white">Google Sheets</h3>
                <p className="text-sm text-gray-400">
                  {status.googleSheets.connected
                    ? `${status.googleSheets.sheets.length} abas encontradas`
                    : "Desconectado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status.googleSheets.connected ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge className="bg-red-500 text-white">
                  <XCircle className="h-3 w-3 mr-1" />
                  Erro
                </Badge>
              )}
            </div>
          </div>

          {/* Supabase Status */}
          <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="font-medium text-white">Supabase</h3>
                <p className="text-sm text-gray-400">
                  {status.supabase.connected ? `${status.supabase.userCount} usuários reais` : "Desconectado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status.supabase.connected ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge className="bg-red-500 text-white">
                  <XCircle className="h-3 w-3 mr-1" />
                  Erro
                </Badge>
              )}
            </div>
          </div>

          {/* Real Users */}
          {status.realUsers.length > 0 && (
            <div className="p-4 border border-gray-600 rounded-lg">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                Usuários Reais ({status.realUsers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {status.realUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{user.full_name || user.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {(status.googleSheets.error || status.supabase.error) && (
            <div className="p-4 border border-yellow-600 rounded-lg bg-yellow-900/20">
              <h3 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Avisos
              </h3>
              {status.googleSheets.error && (
                <p className="text-sm text-yellow-300 mb-1">Google Sheets: {status.googleSheets.error}</p>
              )}
              {status.supabase.error && <p className="text-sm text-yellow-300">Supabase: {status.supabase.error}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, FileSpreadsheet } from "lucide-react"

export function SheetsStatus() {
  const [sheets, setSheets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState("")

  const testConnection = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/sheets/list-sheets")
      const data = await response.json()

      if (data.success) {
        setSheets(data.sheets)
        setConnected(true)
      } else {
        setError(data.error)
        setConnected(false)
      }
    } catch (err) {
      setError("Erro ao conectar com Google Sheets")
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileSpreadsheet className="h-5 w-5 text-green-400" />
          Status Google Sheets
          {connected ? (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge className="bg-red-500 text-white">
              <XCircle className="h-3 w-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Planilha ID:</span>
            <span className="text-xs text-gray-400 font-mono">174HlbA...h5Ew</span>
          </div>

          {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>}

          {sheets.length > 0 && (
            <div>
              <span className="text-gray-300 text-sm">Abas encontradas ({sheets.length}):</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {sheets.map((sheet) => (
                  <Badge key={sheet} variant="outline" className="text-xs">
                    {sheet}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={testConnection} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Testar Conexão
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

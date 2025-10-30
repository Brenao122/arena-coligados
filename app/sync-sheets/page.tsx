"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function SyncSheetsPage() {
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [sheetInfo, setSheetInfo] = useState<any>(null)
  const [ultimaSync, setUltimaSync] = useState<string | null>(null)
  const [diagnostico, setDiagnostico] = useState<any>(null)
  const [loadingDiag, setLoadingDiag] = useState(false)

  useEffect(() => {
    buscarInfoPlanilha()
    // Buscar última sincronização do localStorage
    const ultima = localStorage.getItem("ultimaSyncNextfit")
    if (ultima) {
      setUltimaSync(ultima)
    }
  }, [])

  const buscarInfoPlanilha = async () => {
    try {
      const response = await fetch("/api/sheets-info")
      const data = await response.json()
      setSheetInfo(data)
    } catch (error: any) {
      setSheetInfo({
        erro: error.message,
      })
    }
  }

  const sincronizar = async () => {
    setLoading(true)
    setResultado(null)

    try {
      const response = await fetch("/api/sync-nextfit-sheets", {
        method: "POST",
      })

      const data = await response.json()
      setResultado(data)

      if (data.sucesso) {
        const agora = new Date().toLocaleString("pt-BR")
        setUltimaSync(agora)
        localStorage.setItem("ultimaSyncNextfit", agora)
      }
    } catch (error: any) {
      setResultado({
        sucesso: false,
        erro: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const popularComTeste = async () => {
    setLoading(true)
    setResultado(null)

    try {
      const response = await fetch("/api/popular-sheets-teste", {
        method: "POST",
      })

      const data = await response.json()
      setResultado(data)
    } catch (error: any) {
      setResultado({
        sucesso: false,
        erro: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const executarDiagnostico = async () => {
    setLoadingDiag(true)
    setDiagnostico(null)

    try {
      const response = await fetch("/api/diagnostico-nextfit")
      const data = await response.json()
      setDiagnostico(data)
    } catch (error: any) {
      setDiagnostico({
        erro: error.message,
      })
    } finally {
      setLoadingDiag(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Sincronizar Nextfit → Google Sheets</h1>
          <p className="text-slate-400">
            Sincroniza todos os clientes e vendas do Nextfit para o Google Sheets automaticamente
          </p>
        </div>

        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50 p-6">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">⚙️ Configuração Necessária</h2>
              <p className="text-slate-300 mb-3">
                Para ativar a sincronização automática a cada 2 minutos, adicione esta variável de ambiente:
              </p>
              <div className="bg-slate-900 p-3 rounded-lg mb-3">
                <p className="text-sm font-mono text-green-400">CRON_SECRET=qualquer-string-secreta-aqui</p>
              </div>
              <p className="text-xs text-slate-400">
                Após adicionar, o Vercel Cron Job vai sincronizar automaticamente a cada 2 minutos
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50 p-6">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">Sincronização Automática</h2>
              <p className="text-slate-300 mb-3">Configurado para rodar a cada 2 minutos via Vercel Cron Job</p>
              {ultimaSync && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Última sincronização: {ultimaSync}</span>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2">Próxima sincronização em até 2 minutos</p>
            </div>
          </div>
        </Card>

        <Alert className="bg-slate-800/50 border-slate-700">
          <AlertDescription>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white mb-1">Planilha Configurada:</p>
                  <p className="text-sm text-slate-400">ID: {sheetInfo?.spreadsheetId || "Carregando..."}</p>
                  {sheetInfo?.url && (
                    <a
                      href={sheetInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                    >
                      Abrir planilha <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Button onClick={buscarInfoPlanilha} variant="outline" size="sm">
                  Atualizar Info
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Card className="bg-amber-900/20 border-amber-700/50 p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">Problema com API do Nextfit</h2>
              <p className="text-slate-300 text-sm mb-4">
                A API do Nextfit está retornando HTML ao invés de JSON. Isso indica que o token NEXTFIT_API_KEY pode
                estar incorreto.
              </p>

              <div className="bg-slate-900 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-semibold text-white mb-2">Como verificar o token:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                  <li>Acesse o Nextfit e faça login</li>
                  <li>Vá em Configurações → API ou Integrações</li>
                  <li>Copie o token de API</li>
                  <li>Atualize a variável NEXTFIT_API_KEY nas variáveis de ambiente</li>
                </ol>
              </div>

              <Button
                onClick={executarDiagnostico}
                disabled={loadingDiag}
                variant="outline"
                className="w-full bg-transparent"
              >
                {loadingDiag ? "Executando Diagnóstico..." : "Executar Diagnóstico do Token"}
              </Button>
            </div>
          </div>

          {diagnostico && (
            <div className="mt-4 bg-slate-900 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">Resultado do Diagnóstico:</h3>
              <pre className="text-xs text-slate-300 overflow-auto max-h-96">
                {JSON.stringify(diagnostico, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Como funciona:</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Busca todos os clientes do Nextfit</li>
            <li>Busca todas as vendas do Nextfit</li>
            <li>Combina os dados (cliente + vendas)</li>
            <li>Salva tudo no Google Sheets</li>
            <li>No N8N, você busca direto do Sheets pelo codigoCliente ou codigoVenda</li>
          </ol>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={sincronizar} disabled={loading} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Sincronizando..." : "Sincronizar Agora"}
          </Button>

          <Button
            onClick={popularComTeste}
            disabled={loading}
            size="lg"
            variant="outline"
            className="w-full bg-transparent"
          >
            {loading ? "Populando..." : "Popular com Dados de Teste"}
          </Button>
        </div>

        {resultado && (
          <Card
            className={`p-6 ${resultado.sucesso ? "bg-green-900/20 border-green-700/50" : "bg-red-900/20 border-red-700/50"}`}
          >
            <div className="flex items-start gap-3 mb-4">
              {resultado.sucesso ? (
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-semibold text-white mb-1">
                  {resultado.sucesso ? "Sincronização Concluída!" : "Erro na Sincronização"}
                </h3>
                {resultado.sucesso && (
                  <p className="text-sm text-slate-300">
                    {resultado.totalClientes} clientes e {resultado.totalVendas} vendas sincronizados
                  </p>
                )}
              </div>
            </div>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-auto text-sm text-slate-300">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="bg-blue-900/20 border-blue-700/50 p-6">
          <h3 className="font-semibold text-white mb-3">📋 Fluxo N8N:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Detectar nova Oportunidade (webhook ou polling)</li>
            <li>Pegar o codigoPessoa (que é o ID da Venda)</li>
            <li>Buscar no Google Sheets pela coluna "codigoVenda" = codigoPessoa</li>
            <li>Pegar o telefone e nome da linha encontrada</li>
            <li>Enviar WhatsApp de confirmação</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ConfigurarNextfitPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Configurar Token do Nextfit</h1>
          <p className="text-slate-400">O token de autenticação do Nextfit não está configurado no projeto</p>
        </div>

        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-200">
            <strong>Erro detectado:</strong> A variável de ambiente{" "}
            <code className="bg-red-500/20 px-2 py-1 rounded">NEXTFIT_API_KEY</code> não está configurada. Todos os
            endpoints do Nextfit estão falhando.
          </AlertDescription>
        </Alert>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Como Configurar</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white">Obter o Token do Nextfit</h3>
              </div>
              <p className="text-slate-300 ml-10">
                Acesse o painel do Nextfit e copie seu token de API. Geralmente está em:{" "}
                <strong>Configurações → API → Token de Acesso</strong>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white">Adicionar no Vercel</h3>
              </div>
              <div className="ml-10 space-y-3">
                <p className="text-slate-300">
                  Vá para a seção <strong>Vars</strong> no menu lateral esquerdo do v0
                </p>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-400">Nome da variável:</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("NEXTFIT_API_KEY")}
                      className="text-slate-400 hover:text-white"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-green-400 font-mono">NEXTFIT_API_KEY</code>
                </div>
                <p className="text-slate-300">
                  Cole o token que você copiou do Nextfit no campo <strong>Valor</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white">Testar a Conexão</h3>
              </div>
              <p className="text-slate-300 ml-10">
                Após adicionar a variável, volte para a página de teste e tente novamente os métodos de busca.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Estrutura da Variável</h2>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 font-mono text-sm">
            <div className="text-slate-400">Nome:</div>
            <div className="text-green-400 mb-4">NEXTFIT_API_KEY</div>
            <div className="text-slate-400">Valor:</div>
            <div className="text-yellow-400">seu_token_do_nextfit_aqui_12345abcdef</div>
          </div>
        </Card>

        <Alert className="border-blue-500/50 bg-blue-500/10">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200">
            <strong>Dica:</strong> Após adicionar a variável de ambiente, pode levar alguns segundos para ela estar
            disponível. Se continuar com erro, tente fazer um novo deploy ou aguarde 1-2 minutos.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

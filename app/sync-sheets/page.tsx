"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SyncSheetsPage() {
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const sincronizar = async () => {
    setLoading(true)
    setResultado(null)

    try {
      const response = await fetch("/api/sync-nextfit-sheets", {
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

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Sincronizar Nextfit → Google Sheets</h1>
      <p className="text-muted-foreground mb-8">
        Sincroniza todos os clientes e vendas do Nextfit para o Google Sheets
      </p>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Como funciona:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Busca todos os clientes do Nextfit</li>
          <li>Busca todas as vendas do Nextfit</li>
          <li>Combina os dados (cliente + vendas)</li>
          <li>Salva tudo no Google Sheets</li>
          <li>No N8N, você busca direto do Sheets pelo codigoCliente ou codigoVenda</li>
        </ol>
      </Card>

      <Button onClick={sincronizar} disabled={loading} size="lg" className="w-full mb-6">
        {loading ? "Sincronizando..." : "Sincronizar Agora"}
      </Button>

      {resultado && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Resultado:</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(resultado, null, 2)}</pre>
        </Card>
      )}

      <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-2">Fluxo N8N:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Detectar nova Oportunidade (webhook ou polling)</li>
          <li>Pegar o codigoPessoa (que é o ID da Venda)</li>
          <li>Buscar no Google Sheets pela coluna "codigoVenda" = codigoPessoa</li>
          <li>Pegar o telefone e nome da linha encontrada</li>
          <li>Enviar WhatsApp de confirmação</li>
        </ol>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function TesteBuscaClientePage() {
  const [codigoCliente, setCodigoCliente] = useState("25839871")
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [metodo, setMetodo] = useState("")

  const testarMetodo1 = async () => {
    setLoading(true)
    setMetodo("Método 1: /api/v1/Pessoa/{id}")
    try {
      const response = await fetch(`/api/nextfit/pessoa/${codigoCliente}`)
      const data = await response.json()
      setResultado(data)
    } catch (error) {
      setResultado({ erro: String(error) })
    }
    setLoading(false)
  }

  const testarMetodo2 = async () => {
    setLoading(true)
    setMetodo("Método 2: /api/v1/Pessoa/GetClientes com filtro")
    try {
      const response = await fetch(`/api/nextfit/pessoa-filtro?codigoCliente=${codigoCliente}`)
      const data = await response.json()
      setResultado(data)
    } catch (error) {
      setResultado({ erro: String(error) })
    }
    setLoading(false)
  }

  const testarMetodo3 = async () => {
    setLoading(true)
    setMetodo("Método 3: Buscar todos e filtrar")
    try {
      const response = await fetch(`/api/nextfit/pessoa-todos?codigoCliente=${codigoCliente}`)
      const data = await response.json()
      setResultado(data)
    } catch (error) {
      setResultado({ erro: String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Teste: Buscar Cliente por ID</CardTitle>
          <CardDescription>
            Vamos testar diferentes formas de buscar um cliente específico na API do Nextfit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="codigoCliente">Código do Cliente</Label>
            <Input
              id="codigoCliente"
              value={codigoCliente}
              onChange={(e) => setCodigoCliente(e.target.value)}
              placeholder="Ex: 25839871"
            />
            <p className="text-sm text-muted-foreground">Use o codigoCliente que você pegou da Venda</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Testar Métodos:</h3>

            <Button onClick={testarMetodo1} disabled={loading} className="w-full bg-transparent" variant="outline">
              Método 1: GET /api/v1/Pessoa/{"{id}"}
            </Button>

            <Button onClick={testarMetodo2} disabled={loading} className="w-full bg-transparent" variant="outline">
              Método 2: GET /api/v1/Pessoa/GetClientes?codigoCliente={"{id}"}
            </Button>

            <Button onClick={testarMetodo3} disabled={loading} className="w-full bg-transparent" variant="outline">
              Método 3: Buscar todos e filtrar localmente
            </Button>
          </div>

          {metodo && (
            <div className="space-y-2">
              <h3 className="font-semibold">{metodo}</h3>
              <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs">{JSON.stringify(resultado, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Fluxo Correto Descoberto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Buscar Oportunidades</p>
                <code className="text-xs bg-muted p-1 rounded">GET /api/v1/Oportunidade</code>
                <p className="text-muted-foreground mt-1">Retorna: codigoPessoa (ID da Venda)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold">Buscar Venda</p>
                <code className="text-xs bg-muted p-1 rounded">GET /api/v1/Venda (filtrar por ID)</code>
                <p className="text-muted-foreground mt-1">Retorna: codigoCliente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold">Buscar Cliente</p>
                <code className="text-xs bg-muted p-1 rounded">??? (vamos descobrir aqui)</code>
                <p className="text-muted-foreground mt-1">Retorna: nome, telefone, email</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold">Enviar WhatsApp</p>
                <p className="text-muted-foreground mt-1">Mensagem de confirmação</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

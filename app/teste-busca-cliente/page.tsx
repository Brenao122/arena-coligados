"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function TesteBuscaClientePage() {
  const [codigoCliente, setCodigoCliente] = useState("26613961")
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [metodo, setMetodo] = useState("")

  const testarBuscarTodos = async () => {
    setLoading(true)
    setMetodo("buscar-todos-clientes")
    try {
      const response = await fetch(`/api/nextfit/teste-cliente?metodo=buscar-todos`)
      const data = await response.json()

      // Filtrar pelo codigoCliente
      if (data.sucesso && data.clientes) {
        const clienteEncontrado = data.clientes.find((c: any) => String(c.id) === codigoCliente)
        setResultado({
          sucesso: !!clienteEncontrado,
          totalClientes: data.clientes.length,
          clienteEncontrado: clienteEncontrado || null,
          mensagem: clienteEncontrado
            ? "Cliente encontrado com sucesso!"
            : `Cliente ${codigoCliente} não encontrado nos últimos ${data.clientes.length} clientes`,
        })
      } else {
        setResultado(data)
      }
    } catch (error) {
      setResultado({ erro: String(error) })
    }
    setLoading(false)
  }

  const testarMetodo = async (metodoNome: string) => {
    setLoading(true)
    setMetodo(metodoNome)
    try {
      const response = await fetch(`/api/nextfit/teste-cliente?metodo=${metodoNome}&id=${codigoCliente}`)
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
            A API do Nextfit não permite buscar cliente por ID específico. Solução: buscar todos e filtrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="codigoCliente">Código do Cliente</Label>
            <Input
              id="codigoCliente"
              value={codigoCliente}
              onChange={(e) => setCodigoCliente(e.target.value)}
              placeholder="Ex: 26613961"
            />
            <p className="text-sm text-muted-foreground">Use o codigoCliente que você pegou da Venda</p>
          </div>

          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">Solução que Funciona:</h3>
              <Button onClick={testarBuscarTodos} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                Buscar TODOS os clientes e filtrar pelo ID
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Este método busca todos os clientes recentes e filtra localmente pelo codigoCliente
              </p>
            </div>

            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-sm">
                Métodos que NÃO funcionam (retornam HTML)
              </summary>
              <div className="space-y-2 mt-3">
                <Button
                  onClick={() => testarMetodo("pessoa-id")}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  GET /api/v1/Pessoa/{codigoCliente}
                </Button>

                <Button
                  onClick={() => testarMetodo("cliente-id")}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  GET /api/v1/Cliente/{codigoCliente}
                </Button>

                <Button
                  onClick={() => testarMetodo("pessoa-filtro")}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  GET /api/v1/Pessoa/GetClientes?codigoCliente={codigoCliente}
                </Button>

                <Button
                  onClick={() => testarMetodo("pessoa-filtro-id")}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  GET /api/v1/Pessoa/GetClientes?id={codigoCliente}
                </Button>

                <Button
                  onClick={() => testarMetodo("pessoa-buscar")}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  GET /api/v1/Pessoa/Buscar?codigo={codigoCliente}
                </Button>
              </div>
            </details>
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
          <CardTitle>Fluxo Correto para o N8N</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Buscar Oportunidades Recentes</p>
                <code className="text-xs bg-muted p-1 rounded">GET /api/v1/Oportunidade (últimos 5 min)</code>
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
                <p className="font-semibold">Buscar TODOS os Clientes</p>
                <code className="text-xs bg-muted p-1 rounded">GET /api/v1/Pessoa/GetClientes (sem filtro)</code>
                <p className="text-muted-foreground mt-1">Retorna: lista de todos os clientes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold">Filtrar no N8N</p>
                <code className="text-xs bg-muted p-1 rounded">clientes.find(c =&gt; c.id === codigoCliente)</code>
                <p className="text-muted-foreground mt-1">Encontra o cliente específico na lista</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-semibold">Enviar WhatsApp</p>
                <p className="text-muted-foreground mt-1">Mensagem de confirmação com nome e telefone</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

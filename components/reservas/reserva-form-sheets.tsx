"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth-simple"
import { Loader2, X } from "lucide-react"

interface ReservaFormProps {
  onClose: () => void
  onSuccess: () => void
  reservaId?: string
}

interface Quadra {
  id: string
  name: string
  type: string
  price_per_hour: number
}

interface Professor {
  id: string
  user_id: string
  hourly_rate: number
  profiles: {
    name: string
  }
}

interface Cliente {
  id: string
  name: string
  email: string
}

export function ReservaForm({ onClose, onSuccess, reservaId }: ReservaFormProps) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [formData, setFormData] = useState({
    cliente_id: "",
    quadra_id: "",
    professor_id: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    tipo: "locacao" as "locacao" | "aula",
    observacoes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados reais das planilhas
        const [quadrasRes, professoresRes, clientesRes] = await Promise.all([
          fetch('/api/sheets/read?sheet=quadras'),
          fetch('/api/sheets/read?sheet=professores'),
          fetch('/api/sheets/read?sheet=clientes')
        ])

        const [quadrasData, professoresData, clientesData] = await Promise.all([
          quadrasRes.json(),
          professoresRes.json(),
          clientesRes.json()
        ])

        // Processar quadras
        if (quadrasData.ok && quadrasData.rows) {
          const quadrasFormatadas = quadrasData.rows.map((q: any) => ({
            id: q.id || `quadra-${Math.random().toString(36).substr(2, 9)}`,
            name: q.nome || 'Quadra sem nome',
            type: q.tipo || 'Não especificado',
            price_per_hour: parseFloat(q.preco_hora) || 0
          }))
          setQuadras(quadrasFormatadas)
        }

        // Processar professores
        if (professoresData.ok && professoresData.rows) {
          const professoresFormatados = professoresData.rows.map((p: any) => ({
            id: p.id || `prof-${Math.random().toString(36).substr(2, 9)}`,
            user_id: p.id,
            hourly_rate: parseFloat(p.preco_aula) || 0,
            profiles: { name: p.nome || 'Professor sem nome' }
          }))
          setProfessores(professoresFormatados)
        }

        // Processar clientes
        if (clientesData.ok && clientesData.rows) {
          const clientesFormatados = clientesData.rows.map((c: any) => ({
            id: c.id || `cliente-${Math.random().toString(36).substr(2, 9)}`,
            name: c.nome || 'Cliente sem nome',
            email: c.email || ''
          }))
          
          if (profile?.role === "admin" || profile?.role === "professor") {
            setClientes(clientesFormatados)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchData()
  }, [profile])

  const calculateValue = () => {
    const quadra = quadras.find((q) => q.id === formData.quadra_id)
    const professor = professores.find((p) => p.id === formData.professor_id)

    if (!quadra || !formData.hora_inicio || !formData.hora_fim) return 0

    const inicio = new Date(`2000-01-01T${formData.hora_inicio}`)
    const fim = new Date(`2000-01-01T${formData.hora_fim}`)
    const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)

    if (formData.tipo === "aula" && professor) {
      return professor.hourly_rate * horas
    }

    return quadra.price_per_hour * horas
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const reservaData = {
        Nome: clientes.find(c => c.id === formData.cliente_id)?.name || profile?.full_name || "Cliente",
        Email: clientes.find(c => c.id === formData.cliente_id)?.email || profile?.email || "",
        Telefone: clientes.find(c => c.id === formData.cliente_id)?.id || profile?.phone || "",
        Data: formData.data,
        Hora: formData.hora_inicio,
        Serviço: formData.tipo === "aula" ? "Aula" : "Locação",
        Status: "Pendente",
        Observações: formData.observacoes,
        Valor: calculateValue(),
        Professor: formData.tipo === "aula" ? professores.find(p => p.id === formData.professor_id)?.profiles.name || "" : "",
        Quadra: quadras.find(q => q.id === formData.quadra_id)?.name || ""
      }

      // Enviar para Google Sheets via API
      const response = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'Página1',
          rows: [reservaData]
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error || 'Erro ao salvar reserva')
      }

      onSuccess()
      onClose()
    } catch (error: unknown) {
      setError("Erro ao salvar reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{reservaId ? "Editar Reserva" : "Nova Reserva"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(profile?.role === "admin" || profile?.role === "professor") && (
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-gray-200">
                Cliente
              </Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id} className="text-white hover:bg-gray-600">
                      {cliente.name} ({cliente.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quadra" className="text-gray-200">
                Quadra
              </Label>
              <Select
                value={formData.quadra_id}
                onValueChange={(value) => setFormData({ ...formData, quadra_id: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a quadra" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {quadras.map((quadra) => (
                    <SelectItem key={quadra.id} value={quadra.id} className="text-white hover:bg-gray-600">
                      {quadra.name} - R$ {quadra.price_per_hour}/h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-200">
                Tipo
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "locacao" | "aula") => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="locacao" className="text-white hover:bg-gray-600">
                    Locação
                  </SelectItem>
                  <SelectItem value="aula" className="text-white hover:bg-gray-600">
                    Aula
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.tipo === "aula" && (
            <div className="space-y-2">
              <Label htmlFor="professor" className="text-gray-200">
                Professor
              </Label>
              <Select
                value={formData.professor_id}
                onValueChange={(value) => setFormData({ ...formData, professor_id: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o professor" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {professores.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id} className="text-white hover:bg-gray-600">
                      {professor.profiles.name} - R$ {professor.hourly_rate}/h
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-gray-200">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio" className="text-gray-200">
                Hora Início
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fim" className="text-gray-200">
                Hora Fim
              </Label>
              <Input
                id="hora_fim"
                type="time"
                value={formData.hora_fim}
                onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-gray-200">
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {formData.quadra_id && formData.hora_inicio && formData.hora_fim && (
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300">Valor estimado:</p>
              <p className="text-2xl font-bold text-orange-500">R$ {calculateValue().toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Reserva"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

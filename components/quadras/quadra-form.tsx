"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X, Upload } from "lucide-react"

interface QuadraFormProps {
  onClose: () => void
  onSuccess: () => void
  quadraId?: string
}

export function QuadraForm({ onClose, onSuccess, quadraId }: QuadraFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    preco_hora: "",
    ativa: true,
    descricao: "",
    imagem_url: "",
  })

  const tiposQuadra = [
    { value: "futevolei", label: "Futevôlei" },
    { value: "volei", label: "Vôlei" },
    { value: "tenis", label: "Tênis" },
    { value: "beach_tennis", label: "Beach Tennis" },
    { value: "multipla", label: "Múltipla" },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/sheets/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "quadras",
          data: {
            nome: formData.nome,
            tipo: formData.tipo,
            preco_hora: formData.preco_hora,
            ativa: formData.ativa ? "Sim" : "Não",
            descricao: formData.descricao,
            data_cadastro: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar quadra")
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error saving quadra:", error)
      setError(error.message || "Erro ao salvar quadra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{quadraId ? "Editar Quadra" : "Nova Quadra"}</CardTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-200">
                Nome da Quadra
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Quadra 1 - Futsal"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-200">
                Tipo
              </Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {tiposQuadra.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value} className="text-white hover:bg-gray-600">
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_hora" className="text-gray-200">
                Preço por Hora (R$)
              </Label>
              <Input
                id="preco_hora"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_hora}
                onChange={(e) => setFormData({ ...formData, preco_hora: e.target.value })}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ativa" className="text-gray-200">
                Status
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="ativa"
                  checked={formData.ativa}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativa: checked })}
                />
                <Label htmlFor="ativa" className="text-gray-200">
                  {formData.ativa ? "Ativa" : "Inativa"}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-gray-200">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição da quadra, equipamentos disponíveis, etc."
              rows={3}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem" className="text-gray-200">
              Imagem da Quadra
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

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
                "Salvar Quadra"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

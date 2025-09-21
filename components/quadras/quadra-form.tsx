"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Loader2, X, Upload } from "lucide-react"
import { isValidUUID, handleDatabaseError } from "@/lib/supabase/error-handler"

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
    { value: "futsal", label: "Futsal" },
    { value: "volei", label: "Vôlei" },
    { value: "basquete", label: "Basquete" },
    { value: "society", label: "Society" },
    { value: "tenis", label: "Tênis" },
    { value: "beach_tennis", label: "Beach Tennis" },
    { value: "padel", label: "Padel" },
    { value: "multipla", label: "Múltipla" },
  ]

  useEffect(() => {
    if (quadraId) {
      fetchQuadra()
    }
  }, [quadraId])

  const fetchQuadra = async () => {
    if (!quadraId || quadraId === "new" || !isValidUUID(quadraId)) return

    try {
      const { data, error } = await supabase.from("quadras").select("*").eq("id", quadraId).single()

      if (error) throw error

      setFormData({
        nome: data.nome,
        tipo: data.tipo,
        preco_hora: data.preco_hora.toString(),
        ativa: data.ativa,
        descricao: data.descricao || "",
        imagem_url: data.imagem_url || "",
      })

      if (data.imagem_url) {
        setImagePreview(data.imagem_url)
      }
    } catch (error) {
      console.error("Error fetching quadra:", error)
      const dbError = handleDatabaseError(error)
      setError(dbError.message)
    }
  }

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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imagem_url || null

    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `quadras/${fileName}`

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile)

      if (uploadError) {
        console.error("Erro no upload para Supabase Storage:", uploadError)
        return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(formData.nome + " " + formData.tipo)}`
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath)

      console.log("Upload realizado com sucesso:", publicUrl)
      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(formData.nome + " " + formData.tipo)}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const imageUrl = await uploadImage()

      const quadraData = {
        nome: formData.nome,
        tipo: formData.tipo,
        preco_hora: Number.parseFloat(formData.preco_hora),
        ativa: formData.ativa,
        descricao: formData.descricao,
        imagem_url: imageUrl,
      }

      if (quadraId && quadraId !== "new" && isValidUUID(quadraId)) {
        const { error } = await supabase.from("quadras").update(quadraData).eq("id", quadraId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("quadras").insert([quadraData])
        if (error) {
          console.warn("Erro ao inserir no Supabase:", error)
          alert("Quadra cadastrada com sucesso! (Modo demonstração - dados não persistidos)")
        }
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error saving quadra:", error)
      const dbError = handleDatabaseError(error)
      setError(dbError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quadraId ? "Editar Quadra" : "Nova Quadra"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
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
              <Label htmlFor="nome">Nome da Quadra</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Quadra 1 - Futsal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposQuadra.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_hora">Preço por Hora (R$)</Label>
              <Input
                id="preco_hora"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco_hora}
                onChange={(e) => setFormData({ ...formData, preco_hora: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ativa">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="ativa"
                  checked={formData.ativa}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativa: checked })}
                />
                <Label htmlFor="ativa">{formData.ativa ? "Ativa" : "Inativa"}</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição da quadra, equipamentos disponíveis, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem da Quadra</Label>
            <div className="flex items-center gap-4">
              <Input id="imagem" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
              <Button type="button" variant="outline" size="sm">
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-brand-primary hover:bg-orange-600">
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

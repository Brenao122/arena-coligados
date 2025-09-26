"use client"

import { useState } from "react"
import { QuadrasList } from "@/components/quadras/quadras-list"
import { QuadraForm } from "@/components/quadras/quadra-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function QuadrasPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingQuadra, setEditingQuadra] = useState<string | undefined>()
  const [refreshList, setRefreshList] = useState(false)

  const handleCreateQuadra = () => {
    setEditingQuadra(undefined)
    setShowForm(true)
  }

  const handleEditQuadra = (quadraId: string) => {
    setEditingQuadra(quadraId)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingQuadra(undefined)
  }

  const handleFormSuccess = () => {
    setRefreshList(!refreshList)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <QuadraForm onClose={handleFormClose} onSuccess={handleFormSuccess} quadraId={editingQuadra} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quadras</h1>
          <p className="text-muted-foreground">Gerencie as quadras da arena</p>
        </div>
        <Button onClick={handleCreateQuadra} className="bg-brand-primary hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Quadra
        </Button>
      </div>

      <QuadrasList onEdit={handleEditQuadra} refresh={refreshList} />
    </div>
  )
}

"use client"

import { useState } from "react"
import { ProfessoresList } from "@/components/professores/professores-list"
import { ProfessorForm } from "@/components/professores/professor-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProfessoresPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<string | undefined>()
  const [refreshList, setRefreshList] = useState(false)

  const handleCreateProfessor = () => {
    setEditingProfessor(undefined)
    setShowForm(true)
  }

  const handleEditProfessor = (professorId: string) => {
    setEditingProfessor(professorId)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProfessor(undefined)
  }

  const handleFormSuccess = () => {
    setRefreshList(!refreshList)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <ProfessorForm onClose={handleFormClose} onSuccess={handleFormSuccess} professorId={editingProfessor} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
          <p className="text-muted-foreground">Gerencie os professores da arena</p>
        </div>
        <Button onClick={handleCreateProfessor} className="bg-brand-primary hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Novo Professor
        </Button>
      </div>

      <ProfessoresList onEdit={handleEditProfessor} refresh={refreshList} />
    </div>
  )
}

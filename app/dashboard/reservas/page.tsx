"use client"

import { useState } from "react"
import { CalendarView } from "@/components/reservas/calendar-view"
import { ReservasList } from "@/components/reservas/reservas-list"
import { ReservaForm } from "@/components/reservas/reserva-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"

export default function ReservasPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingReserva, setEditingReserva] = useState<string | undefined>()
  const [refreshList, setRefreshList] = useState(false)

  const handleCreateReserva = () => {
    setEditingReserva(undefined)
    setShowForm(true)
  }

  const handleEditReserva = (reserva: any) => {
    setEditingReserva(reserva.id)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingReserva(undefined)
  }

  const handleFormSuccess = () => {
    setRefreshList(!refreshList)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <ReservaForm onClose={handleFormClose} onSuccess={handleFormSuccess} reservaId={editingReserva} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground">Gerencie as reservas da arena</p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <CalendarView onCreateReserva={handleCreateReserva} />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreateReserva} className="bg-brand-primary hover:bg-orange-600">
              Nova Reserva
            </Button>
          </div>
          <ReservasList onEdit={handleEditReserva} refresh={refreshList} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

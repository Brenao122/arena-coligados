"use client"

import { useState } from "react"
import { ClientesList } from "@/components/clientes/clientes-list"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { ClienteDetails } from "@/components/clientes/cliente-details"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, MessageSquare } from "lucide-react"
import { LeadsList } from "@/components/leads/leads-list"

export default function ClientesPage() {
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [editingCliente, setEditingCliente] = useState<string | undefined>()
  const [refreshList, setRefreshList] = useState(false)

  const handleCreateCliente = () => {
    setEditingCliente(undefined)
    setShowForm(true)
  }

  const handleEditCliente = (clienteId: string) => {
    setEditingCliente(clienteId)
    setShowForm(true)
  }

  const handleViewCliente = (clienteId: string) => {
    setShowDetails(clienteId)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCliente(undefined)
  }

  const handleDetailsBack = () => {
    setShowDetails(null)
  }

  const handleFormSuccess = () => {
    setRefreshList(!refreshList)
  }

  if (showForm) {
    return (
      <div className="space-y-6 pt-4">
        <ClienteForm onClose={handleFormClose} onSuccess={handleFormSuccess} clienteId={editingCliente} />
      </div>
    )
  }

  if (showDetails) {
    return (
      <div className="space-y-6 pt-4">
        <ClienteDetails clienteId={showDetails} onBack={handleDetailsBack} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-gray-400">Gerencie clientes e leads da arena</p>
        </div>
        <Button
          onClick={handleCreateCliente}
          className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Tabs defaultValue="clientes" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="clientes"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-4">
          <ClientesList onEdit={handleEditCliente} onView={handleViewCliente} refresh={refreshList} />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <LeadsList refresh={refreshList} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


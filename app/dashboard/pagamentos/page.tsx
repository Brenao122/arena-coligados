"use client"

import { useState } from "react"
import { PagamentosList } from "@/components/pagamentos/pagamentos-list"

export default function PagamentosPage() {
  const [refreshList, setRefreshList] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-muted-foreground">Gerencie todos os pagamentos da arena</p>
      </div>

      <PagamentosList refresh={refreshList} />
    </div>
  )
}

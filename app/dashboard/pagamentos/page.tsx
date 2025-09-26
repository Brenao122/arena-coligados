"use client"

import { useState } from "react"
import { PagamentosList } from "@/components/pagamentos/pagamentos-list"
import { PagamentosListSheets } from "@/components/pagamentos/pagamentos-list-sheets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Sheet } from "lucide-react"

export default function PagamentosPage() {
  const [refreshList, setRefreshList] = useState(false)
  const [dataSource, setDataSource] = useState<"supabase" | "sheets">("sheets")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Pagamentos</h1>
          <p className="text-gray-400">Gerencie todos os pagamentos da arena</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">Fonte de Dados</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                variant={dataSource === "sheets" ? "default" : "outline"}
                size="sm"
                onClick={() => setDataSource("sheets")}
                className={
                  dataSource === "sheets"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <Sheet className="h-4 w-4 mr-2" />
                Google Sheets
              </Button>
              <Button
                variant={dataSource === "supabase" ? "default" : "outline"}
                size="sm"
                onClick={() => setDataSource("supabase")}
                className={
                  dataSource === "supabase"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <Database className="h-4 w-4 mr-2" />
                Supabase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {dataSource === "sheets" ? (
        <PagamentosListSheets refresh={refreshList} />
      ) : (
        <PagamentosList refresh={refreshList} />
      )}
    </div>
  )
}

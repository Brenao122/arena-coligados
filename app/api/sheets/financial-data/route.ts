import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    const financialData = await readSheetData("Financeiro")

    // Processar dados da planilha para o formato esperado pelo gráfico
    const processedData = financialData.map((row: any, index: number) => ({
      day: index + 1,
      date: new Date(row.data || Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      receita: Number.parseFloat(row.receita || row.valor || 0),
      transacoes: Number.parseInt(row.transacoes || 1),
      pagamentos: Number.parseInt(row.pagamentos || 1),
      interacoes: Number.parseInt(row.interacoes || Math.floor(Math.random() * 10) + 5),
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Erro ao buscar dados financeiros da planilha:", error)
    return NextResponse.json({ error: "Erro ao conectar com Google Sheets" }, { status: 500 })
  }
}

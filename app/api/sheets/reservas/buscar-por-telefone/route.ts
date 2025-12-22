import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const telefone = searchParams.get("telefone")

    if (!telefone) {
      return NextResponse.json({ error: "Telefone não fornecido" }, { status: 400 })
    }

    const todasReservas = await readSheetData("Reservas")

    const reservasCliente = todasReservas
      .filter((row: Record<string, any>) => row.Telefone === telefone)
      .map((row: Record<string, any>) => ({
        id: row.ID || `${row.Data}-${row.Horario}`,
        data: row.Data,
        horarios: row.Horarios ? row.Horarios.split(",") : [row.Horario],
        unidade: row.Unidade,
        modalidade: row.Modalidade,
        valor: Number.parseFloat(row.Valor || "0"),
        status: row.Status,
        payment_id: row.PaymentID,
        created_at: row.Timestamp,
        nome: row.Nome,
        telefone: row.Telefone,
      }))
      .sort((a: any, b: any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

    return NextResponse.json({ success: true, reservas: reservasCliente })
  } catch (error) {
    console.error("Erro ao buscar reservas:", error)
    return NextResponse.json({ error: "Erro ao buscar reservas" }, { status: 500 })
  }
}

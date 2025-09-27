import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    const reservasData = await readSheetData("Reservas")

    // Processar dados da planilha para ocupação semanal
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const ocupacaoSemanal = diasSemana.map((dia, index) => {
      const reservasDoDia = reservasData.filter((row: any) => {
        const dataReserva = new Date(row.data || row.data_agendamento)
        return dataReserva.getDay() === index
      })

      const ocupacao = Math.min((reservasDoDia.length / 12) * 100, 100)

      return {
        day: dia,
        ocupacao: Math.round(ocupacao),
        total: reservasDoDia.length,
      }
    })

    // Reordenar para começar na segunda-feira
    const reordenado = ocupacaoSemanal.slice(1).concat(ocupacaoSemanal.slice(0, 1))

    return NextResponse.json(reordenado)
  } catch (error) {
    console.error("Erro ao buscar dados de ocupação da planilha:", error)
    return NextResponse.json({ error: "Erro ao conectar com Google Sheets" }, { status: 500 })
  }
}

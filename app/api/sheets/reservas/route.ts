import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    console.log("[v0] Iniciando busca de reservas...")

    const data = await readSheetData("leads - quadra")
    console.log("[v0] ✅ Dados brutos carregados:", data.length)

    const reservas = data.map((row: any) => {
      // Extrair horários do campo "horarios" que pode estar em formato "08:30 - 10:00" ou "08:30, 09:00"
      let horariosArray: string[] = []

      if (row.horarios) {
        if (row.horarios.includes(" - ")) {
          // Formato de intervalo: "08:30 - 10:00"
          const [inicio, fim] = row.horarios.split(" - ")
          // Gerar todos os horários entre inicio e fim
          const HORARIOS = [
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
          ]
          const indexInicio = HORARIOS.indexOf(inicio.trim())
          const indexFim = HORARIOS.indexOf(fim.trim())

          if (indexInicio !== -1 && indexFim !== -1) {
            horariosArray = HORARIOS.slice(indexInicio, indexFim)
          }
        } else if (row.horarios.includes(",")) {
          // Formato de lista: "08:30, 09:00, 10:00"
          horariosArray = row.horarios.split(",").map((h: string) => h.trim())
        } else {
          // Horário único: "08:30"
          horariosArray = [row.horarios.trim()]
        }
      }

      // Extrair o nome da quadra do campo "quadra_id" (ex: "Quadra 01" -> "Quadra 01")
      const quadra = row.quadra_id || row.quadra || ""

      return {
        data: row.data,
        unidade: row.Unidade || row.unidade,
        quadra: quadra,
        horarios: horariosArray,
        status: row.status,
        nome: row.nome,
        telefone: row.whatsapp_number || row.telefone,
      }
    })

    console.log("[v0] ✅ Reservas transformadas:", reservas.length)
    if (reservas.length > 0) {
      console.log("[v0] Exemplo de reserva:", reservas[0])
    }

    return NextResponse.json({ reservas })
  } catch (error) {
    console.error("[v0] ❌ Erro ao buscar reservas:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json(
      {
        error: "Erro ao conectar com Google Sheets",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

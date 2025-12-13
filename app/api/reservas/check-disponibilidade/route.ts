import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { unidade, quadra, data, horarios } = await request.json()

    if (!unidade || !quadra || !data) {
      return NextResponse.json(
        { error: "Parâmetros inválidos: unidade, quadra e data são obrigatórios" },
        { status: 400 },
      )
    }

    // Buscar reservas existentes para esta quadra e data
    const responseReservas = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sheets/reservas`)

    if (!responseReservas.ok) {
      throw new Error("Erro ao buscar reservas")
    }

    const dataReservas = await responseReservas.json()
    const horariosOcupados: string[] = []

    // Filtrar reservas para a quadra e data específicas
    dataReservas.reservas?.forEach((reserva: any) => {
      if (reserva.unidade === unidade && reserva.quadra === quadra && reserva.data === data) {
        // Adicionar todos os horários da reserva como ocupados
        if (Array.isArray(reserva.horarios)) {
          horariosOcupados.push(...reserva.horarios)
        }
      }
    })

    // Se foram enviados horários específicos para validar
    if (horarios && Array.isArray(horarios)) {
      const horariosIndisponiveis = horarios.filter((h: string) => horariosOcupados.includes(h))

      if (horariosIndisponiveis.length > 0) {
        return NextResponse.json(
          {
            error: "Alguns horários não estão mais disponíveis",
            horariosIndisponiveis,
          },
          { status: 409 }, // Conflict
        )
      }

      return NextResponse.json({
        disponivel: true,
        mensagem: "Todos os horários estão disponíveis",
      })
    }

    // Retornar todos os horários com status de disponibilidade
    const todosHorarios = [
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

    const horariosComStatus = todosHorarios.map((horario) => ({
      horario,
      disponivel: !horariosOcupados.includes(horario),
      bloqueado: false,
    }))

    return NextResponse.json({
      unidade,
      quadra,
      data,
      horarios: horariosComStatus,
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar disponibilidade:", error)
    return NextResponse.json({ error: "Erro ao verificar disponibilidade de horários" }, { status: 500 })
  }
}

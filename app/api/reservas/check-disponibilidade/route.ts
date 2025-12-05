import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { unidade, quadra, data } = await request.json()

    if (!unidade || !quadra || !data) {
      return NextResponse.json(
        { error: "Parâmetros inválidos: unidade, quadra e data são obrigatórios" },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const dataDate = new Date(data)
    const horariosDisponibilidade = []

    // Gera lista de horários: 08:00 até 21:00
    for (let hour = 8; hour <= 20; hour++) {
      const horario = `${String(hour).padStart(2, "0")}:00`
      const horario_inicio = `${String(hour).padStart(2, "0")}:00:00`
      const horario_fim = `${String(hour + 1).padStart(2, "0")}:00:00`

      const { data: bloqueado_result } = await supabase
        .from("horarios_bloqueados")
        .select("id, bloqueado")
        .eq("quadra_id", quadra)
        .eq("data", data)
        .eq("horario_inicio", horario_inicio)
        .single()

      const bloqueado = bloqueado_result?.bloqueado || false

      horariosDisponibilidade.push({
        horario,
        disponivel: !bloqueado,
        bloqueado,
      })
    }

    return NextResponse.json({
      unidade,
      quadra,
      data,
      horarios: horariosDisponibilidade,
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar disponibilidade:", error)
    return NextResponse.json({ error: "Erro ao verificar disponibilidade de horários" }, { status: 500 })
  }
}

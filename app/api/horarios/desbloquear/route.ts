import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { quadra_id, data, horario_inicio } = await request.json()

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { data: isAdminData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()

    if (!isAdminData) {
      return NextResponse.json({ error: "Acesso negado: apenas admins podem desbloquear horários" }, { status: 403 })
    }

    const { error } = await supabase
      .from("horarios_bloqueados")
      .update({ bloqueado: false, motivo: null })
      .eq("quadra_id", quadra_id)
      .eq("data", data)
      .eq("horario_inicio", horario_inicio)

    if (error) {
      console.error("[v0] Erro ao desbloquear horário:", error)
      return NextResponse.json({ error: "Erro ao desbloquear horário" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Horário desbloqueado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}

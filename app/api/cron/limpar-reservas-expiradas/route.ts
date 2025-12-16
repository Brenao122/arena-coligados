import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    console.log("[v0] Cron job de limpeza iniciado:", new Date().toISOString())

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/reservas/limpar-expiradas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] Cron job de limpeza concluído:", data)
      return NextResponse.json({ success: true, data })
    } else {
      throw new Error("Erro ao executar limpeza")
    }
  } catch (error) {
    console.error("[v0] Erro no cron job de limpeza:", error)
    return NextResponse.json({ error: "Erro ao executar cron job" }, { status: 500 })
  }
}

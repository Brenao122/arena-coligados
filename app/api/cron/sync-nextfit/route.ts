import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[v0] Cron job iniciado:", new Date().toISOString())

    // Chamar o endpoint de sincronização
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/sync-nextfit-sheets`, {
      method: "POST",
    })

    const data = await response.json()

    console.log("[v0] Cron job concluído:", data)

    return NextResponse.json({
      sucesso: true,
      timestamp: new Date().toISOString(),
      resultado: data,
    })
  } catch (error: any) {
    console.error("[v0] Erro no cron job:", error)
    return NextResponse.json(
      {
        sucesso: false,
        erro: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

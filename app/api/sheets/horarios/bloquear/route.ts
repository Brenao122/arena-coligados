import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const { data, unidade, quadra, horarios, motivo } = await request.json()

    console.log("[v0] Bloqueando horários:", { data, unidade, quadra, horarios })

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    // Criar uma reserva de bloqueio
    const values = [
      [
        new Date().toISOString(),
        data,
        unidade,
        quadra,
        horarios,
        "BLOQUEIO",
        "SISTEMA",
        "",
        "",
        "",
        "CONFIRMADA",
        `BLOQUEIO-${Date.now()}`,
        "0",
        "0",
        motivo || "Bloqueio administrativo",
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "leads - quadra!A:O",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })

    console.log("[v0] Horário bloqueado com sucesso!")

    return NextResponse.json({ success: true, message: "Horário bloqueado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao bloquear horário:", error)
    return NextResponse.json(
      { error: "Erro ao bloquear horário", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

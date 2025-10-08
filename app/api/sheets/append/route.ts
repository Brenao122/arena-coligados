import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sheetName, data } = body

    if (!sheetName || !data) {
      return NextResponse.json({ success: false, error: "sheetName e data são obrigatórios" }, { status: 400 })
    }

    console.log("[v0] === DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE ===")
    console.log("[v0] GOOGLE_PRIVATE_KEY existe?", !!process.env.GOOGLE_PRIVATE_KEY)
    console.log("[v0] GOOGLE_PRIVATE_KEY length:", process.env.GOOGLE_PRIVATE_KEY?.length || 0)
    console.log("[v0] GOOGLE_PRIVATE_KEY primeiros 50 chars:", process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50))
    console.log("[v0] SERVICE_ACCOUNT_EMAIL:", SERVICE_ACCOUNT_EMAIL)
    console.log("[v0] SPREADSHEET_ID:", SPREADSHEET_ID)
    console.log("[v0] Appending data to sheet:", sheetName)
    console.log("[v0] Data to append:", JSON.stringify(data))

    // Initialize Google Sheets connection
    const auth = new GoogleAuth({
      credentials: {
        client_email: SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()

    // Find the sheet by name
    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      console.log("[v0] Abas disponíveis:", Object.keys(doc.sheetsByTitle))
      return NextResponse.json({ success: false, error: `Aba "${sheetName}" não encontrada` }, { status: 404 })
    }

    // Add row to sheet
    await sheet.addRow(data)

    console.log("[v0] Data appended successfully to:", sheetName)

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] === ERRO DETALHADO ===")
    console.error("[v0] Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar dados",
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    )
  }
}

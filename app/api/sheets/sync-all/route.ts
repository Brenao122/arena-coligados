import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

export async function POST() {
  try {
    console.log("[v0] Starting manual sync with Google Sheets")

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

    console.log("[v0] Connected to spreadsheet:", doc.title)

    // Get all sheets
    const sheets = doc.sheetsByIndex
    const syncResults = []

    for (const sheet of sheets) {
      try {
        await sheet.loadHeaderRow()
        const rows = await sheet.getRows()

        syncResults.push({
          sheetName: sheet.title,
          rowCount: rows.length,
          status: "success",
        })

        console.log("[v0] Synced sheet:", sheet.title, "with", rows.length, "rows")
      } catch (error) {
        console.error("[v0] Error syncing sheet:", sheet.title, error)
        syncResults.push({
          sheetName: sheet.title,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sincronização manual concluída",
      results: syncResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Manual sync error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido na sincronização",
      },
      { status: 500 },
    )
  }
}

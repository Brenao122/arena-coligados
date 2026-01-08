import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

export async function GET() {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: "GOOGLE_PRIVATE_KEY não está configurada",
      })
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()

    const sheets = doc.sheetsByIndex.map((sheet) => sheet.title)

    return NextResponse.json({
      success: true,
      title: doc.title,
      sheets,
      message: "Conexão estabelecida com sucesso",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

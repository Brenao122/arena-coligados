import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sheetName, data } = body

    if (!sheetName || !data) {
      return NextResponse.json({ success: false, error: "sheetName e data são obrigatórios" }, { status: 400 })
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

    if (!privateKey || !clientEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciais do Google não configuradas",
          debug: {
            hasPrivateKey: !!privateKey,
            hasClientEmail: !!clientEmail,
          },
        },
        { status: 500 },
      )
    }

    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n")

    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()

    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      return NextResponse.json(
        {
          success: false,
          error: `Aba "${sheetName}" não encontrada`,
          availableSheets: Object.keys(doc.sheetsByTitle),
        },
        { status: 404 },
      )
    }

    await sheet.addRow(data)

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar dados",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

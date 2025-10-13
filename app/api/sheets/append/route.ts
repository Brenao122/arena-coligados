import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"

export async function POST(request: Request) {
  const debugInfo: any = {
    hasGoogleServiceAccountJson: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    hasGooglePrivateKeyBase64: !!process.env.GOOGLE_PRIVATE_KEY_BASE64,
    hasGoogleServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  }

  try {
    const body = await request.json()
    const { sheetName, data } = body

    if (!sheetName || !data) {
      return NextResponse.json(
        { success: false, error: "sheetName e data são obrigatórios", debug: debugInfo },
        { status: 400 },
      )
    }

    let serviceAccountJson

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      const base64Json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
      debugInfo.base64Length = base64Json.length

      try {
        const jsonString = Buffer.from(base64Json, "base64").toString("utf-8")
        debugInfo.jsonLength = jsonString.length
        serviceAccountJson = JSON.parse(jsonString)
        debugInfo.clientEmail = serviceAccountJson.client_email
        debugInfo.projectId = serviceAccountJson.project_id
      } catch (decodeError) {
        debugInfo.decodeError = decodeError instanceof Error ? decodeError.message : "Erro ao decodificar"
        return NextResponse.json(
          { success: false, error: "Erro ao decodificar GOOGLE_SERVICE_ACCOUNT_JSON", debug: debugInfo },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json(
        { success: false, error: "GOOGLE_SERVICE_ACCOUNT_JSON não configurado", debug: debugInfo },
        { status: 500 },
      )
    }

    debugInfo.authCreated = true
    const auth = new GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    debugInfo.loadingDoc = true
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)

    await doc.loadInfo()
    debugInfo.docTitle = doc.title

    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      debugInfo.availableSheets = Object.keys(doc.sheetsByTitle)
      return NextResponse.json(
        {
          success: false,
          error: `Aba "${sheetName}" não encontrada`,
          debug: debugInfo,
        },
        { status: 404 },
      )
    }

    await sheet.addRow(data)
    debugInfo.rowAdded = true

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
      debug: debugInfo,
    })
  } catch (error) {
    debugInfo.error = error instanceof Error ? error.message : "Erro desconhecido"
    debugInfo.errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar dados",
        debug: debugInfo,
      },
      { status: 500 },
    )
  }
}

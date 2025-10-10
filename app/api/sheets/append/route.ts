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

    let serviceAccountJson

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      console.log("[v0] Usando GOOGLE_SERVICE_ACCOUNT_JSON da variável de ambiente")
      const base64Json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
      const jsonString = Buffer.from(base64Json, "base64").toString("utf-8")
      serviceAccountJson = JSON.parse(jsonString)
      console.log("[v0] JSON decodificado com sucesso. Email:", serviceAccountJson.client_email)
    } else {
      return NextResponse.json(
        { success: false, error: "GOOGLE_SERVICE_ACCOUNT_JSON não configurado" },
        { status: 500 },
      )
    }

    console.log("[v0] Criando GoogleAuth com JSON completo...")
    const auth = new GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    console.log("[v0] GoogleAuth criado com sucesso")

    console.log("[v0] Carregando documento...")
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)

    await doc.loadInfo()
    console.log("[v0] Documento carregado com sucesso. Título:", doc.title)

    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      console.log("[v0] Abas disponíveis:", Object.keys(doc.sheetsByTitle))
      return NextResponse.json(
        {
          success: false,
          error: `Aba "${sheetName}" não encontrada`,
          availableSheets: Object.keys(doc.sheetsByTitle),
        },
        { status: 404 },
      )
    }

    console.log("[v0] Adicionando linha...")
    await sheet.addRow(data)
    console.log("[v0] Linha adicionada com sucesso!")

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] ERRO:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao adicionar dados",
      },
      { status: 500 },
    )
  }
}

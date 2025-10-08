import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"

function formatPrivateKey(key: string): string {
  // Remove espaços extras e normaliza quebras de linha
  let formatted = key.trim()

  // Se a chave tem \\n literal (string), substitui por quebra de linha real
  if (formatted.includes("\\n")) {
    formatted = formatted.replace(/\\n/g, "\n")
  }

  // Garante que começa com BEGIN e termina com END
  if (!formatted.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Chave privada não contém o cabeçalho BEGIN PRIVATE KEY")
  }

  if (!formatted.includes("-----END PRIVATE KEY-----")) {
    throw new Error("Chave privada não contém o rodapé END PRIVATE KEY")
  }

  return formatted
}

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

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      console.error("[v0] GOOGLE_PRIVATE_KEY não está configurada!")
      return NextResponse.json(
        {
          success: false,
          error: "GOOGLE_PRIVATE_KEY não configurada",
          details: "A variável de ambiente GOOGLE_PRIVATE_KEY não foi encontrada",
        },
        { status: 500 },
      )
    }

    let privateKey: string
    try {
      privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY)
      console.log("[v0] Chave privada formatada com sucesso")
    } catch (formatError) {
      console.error("[v0] Erro ao formatar chave privada:", formatError)
      return NextResponse.json(
        {
          success: false,
          error: "PRIVATE_KEY_FORMAT_ERROR",
          details: formatError instanceof Error ? formatError.message : "Erro ao formatar chave privada",
        },
        { status: 500 },
      )
    }

    // Initialize Google Sheets connection
    const auth = new GoogleAuth({
      credentials: {
        client_email: SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("[v0] Autenticação criada, carregando documento...")

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)

    try {
      await doc.loadInfo()
      console.log("[v0] Documento carregado com sucesso. Título:", doc.title)
    } catch (loadError) {
      console.error("[v0] Erro ao carregar documento:", loadError)
      const errorMessage = loadError instanceof Error ? loadError.message : String(loadError)

      if (errorMessage.includes("permission") || errorMessage.includes("403")) {
        return NextResponse.json(
          {
            success: false,
            error: "PERMISSION_DENIED",
            details: `A service account ${SERVICE_ACCOUNT_EMAIL} não tem permissão para acessar a planilha. Compartilhe a planilha com este email.`,
          },
          { status: 403 },
        )
      }

      throw loadError
    }

    // Find the sheet by name
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

    console.log("[v0] Aba encontrada, adicionando linha...")

    try {
      await sheet.addRow(data)
      console.log("[v0] Data appended successfully to:", sheetName)
    } catch (addError) {
      console.error("[v0] Erro ao adicionar linha:", addError)
      const errorMessage = addError instanceof Error ? addError.message : String(addError)

      return NextResponse.json(
        {
          success: false,
          error: "FAILED_TO_ADD_ROW",
          details: errorMessage,
        },
        { status: 500 },
      )
    }

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

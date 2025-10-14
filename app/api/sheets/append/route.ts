import { NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { GoogleSpreadsheet } from "google-spreadsheet"

const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"

export async function POST(request: Request) {
  try {
    console.log("[v0] ===== API SHEETS APPEND INICIADA =====")

    const body = await request.json()
    const { sheetName, data } = body

    console.log("[v0] Dados recebidos na API:")
    console.log("[v0] - sheetName:", sheetName)
    console.log("[v0] - data:", JSON.stringify(data, null, 2))

    if (!sheetName || !data) {
      console.error("[v0] ❌ Faltam parâmetros obrigatórios")
      return NextResponse.json({ success: false, error: "sheetName e data são obrigatórios" }, { status: 400 })
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

    console.log("[v0] Verificando credenciais:")
    console.log("[v0] - GOOGLE_SERVICE_ACCOUNT_EMAIL:", clientEmail ? "✅ Presente" : "❌ Ausente")
    console.log("[v0] - GOOGLE_PRIVATE_KEY:", privateKey ? "✅ Presente" : "❌ Ausente")

    if (!privateKey || !clientEmail) {
      console.error("[v0] ❌ Credenciais do Google não configuradas")
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

    let formattedPrivateKey = privateKey

    // Se a chave não tem quebras de linha, adicionar no formato PEM correto
    if (!privateKey.includes("\n")) {
      console.log("[v0] Formatando chave privada (sem quebras de linha)")
      const keyContent = privateKey
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .trim()

      const formattedContent = keyContent.match(/.{1,64}/g)?.join("\n") || keyContent
      formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${formattedContent}\n-----END PRIVATE KEY-----`
    } else {
      console.log("[v0] Formatando chave privada (substituindo \\n)")
      formattedPrivateKey = privateKey.replace(/\\n/g, "\n")
    }

    console.log("[v0] Criando autenticação Google...")
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: formattedPrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("[v0] Conectando ao Google Sheets...")
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()
    console.log("[v0] ✅ Conectado ao Google Sheets:", doc.title)

    console.log("[v0] Abas disponíveis:", Object.keys(doc.sheetsByTitle).join(", "))

    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      console.error("[v0] ❌ Aba não encontrada:", sheetName)
      return NextResponse.json(
        {
          success: false,
          error: `Aba "${sheetName}" não encontrada`,
          availableSheets: Object.keys(doc.sheetsByTitle),
        },
        { status: 404 },
      )
    }

    console.log("[v0] ✅ Aba encontrada:", sheetName)
    console.log("[v0] Adicionando linha na planilha...")

    await sheet.addRow(data)

    console.log("[v0] ✅ Linha adicionada com sucesso!")
    console.log("[v0] ===== API SHEETS APPEND FINALIZADA COM SUCESSO =====")

    return NextResponse.json({
      success: true,
      message: "Dados adicionados com sucesso",
      sheetName,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] ===== ERRO NA API SHEETS APPEND =====")
    console.error("[v0] Tipo do erro:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Mensagem:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "N/A")

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
